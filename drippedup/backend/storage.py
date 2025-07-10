import os
import json
import uuid
from fastapi import UploadFile
from typing import Dict, List, Optional
from datetime import datetime

IMAGES_ROOT = os.path.join(os.path.dirname(__file__), "images")
METADATA_FILE = os.path.join(IMAGES_ROOT, "metadata.json")

def generate_random_id() -> str:
    """Generate a unique random ID using UUID4."""
    return str(uuid.uuid4())

def create_subfolder(clothing_type: str) -> str:
    """
    Create a subfolder for the given clothing type inside the images directory.
    Returns the path to the subfolder.
    """
    folder = os.path.join(IMAGES_ROOT, clothing_type)
    os.makedirs(folder, exist_ok=True)
    return folder

def save_image_file(folder: str, file: UploadFile, id: str) -> str:
    """
    Save the uploaded image file to the specified folder.
    Returns the path to the saved image file.
    """
    ext = os.path.splitext(file.filename)[1]
    image_filename = f"{id}{ext}"
    file_location = os.path.join(folder, image_filename)
    with open(file_location, "wb") as f:
        f.write(file.file.read())
    return file_location, image_filename

def update_metadata(id: str, category: str, image_filename: str, details: Dict):
    # Load existing metadata
    metadata = get_metadata()
    # Remove any existing entry with this ID
    metadata = [item for item in metadata if item.get("id") != id]
    # Add new entry
    metadata.append({
        "id": id,
        "category": category,
        "image": os.path.join(category, image_filename),
        "details": details,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    })
    with open(METADATA_FILE, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)

def save_item(file: UploadFile, clothing_type: str, details: Dict) -> Dict:
    """
    Orchestrates saving the image and details for an item.
    Returns a summary dict with paths.
    """
    id = generate_random_id()
    folder = create_subfolder(clothing_type)
    image_path, image_filename = save_image_file(folder, file, id)
    update_metadata(id, clothing_type, image_filename, details)
    return {
        "message": "Item saved successfully",
        "id": id,
        "image_path": image_path,
        "metadata_file": METADATA_FILE
    }

def get_metadata() -> List[Dict]:
    """Load and return the metadata list from metadata.json."""
    if os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except Exception:
                return []
    return []

def get_picture(id: str) -> Optional[str]:
    """Return the image path for a given ID from metadata.json, or None if not found."""
    metadata = get_metadata()
    for item in metadata:
        if item.get("id") == id:
            return os.path.join(IMAGES_ROOT, item.get("image"))
    return None

def look_items(n: int) -> List[Dict]:
    """Return the n most recent items from metadata.json (sorted by insertion order)."""
    metadata = get_metadata()
    return metadata[-n:] if n > 0 else []

def get_recent_uploads() -> List[Dict]:
    """Return a list of dicts for the latest 10 items, each with image path and full item info."""
    recent_items = look_items(10)
    result = []
    for item in recent_items:
        info = get_item_info(item["id"])
        image_path = get_picture(item["id"])
        if info and image_path:
            result.append({
                "image_path": image_path,
                "item_info": info
            })
    return result

def get_item_info(id: str) -> Optional[Dict]:
    """Return the full metadata dictionary for the item with the given ID, or None if not found."""
    metadata = get_metadata()
    for item in metadata:
        if item.get("id") == id:
            return item
    return None 

def get_all_categories() -> List[str]:
    """Return a list of all unique categories from metadata.json."""
    metadata = get_metadata()
    categories = set()
    for item in metadata:
        if item.get("category"):
            categories.add(item["category"])
    return sorted(list(categories))

def get_items_by_category(category: str) -> List[Dict]:
    """Return all items for a specific category."""
    metadata = get_metadata()
    items = []
    for item in metadata:
        if item.get("category") == category:
            items.append(item)
    return items

def get_all_items_grouped_by_category() -> Dict[str, List[Dict]]:
    """Return all items grouped by category."""
    metadata = get_metadata()
    grouped = {}
    for item in metadata:
        category = item.get("category")
        if category:
            if category not in grouped:
                grouped[category] = []
            grouped[category].append(item)
    return grouped