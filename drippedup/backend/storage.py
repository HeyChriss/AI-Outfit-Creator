import os
import json
import uuid
from fastapi import UploadFile
from typing import Dict, List, Optional
from datetime import datetime

IMAGES_ROOT = os.path.join(os.path.dirname(__file__), "images")
METADATA_FILE = os.path.join(IMAGES_ROOT, "metadata.json")
OUTFIT_METADATA_FILE = os.path.join(IMAGES_ROOT, "outfit_metadata.json")

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
    metadata = load_metadata(METADATA_FILE)
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
    save_metadata(metadata, METADATA_FILE)

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
    return load_metadata(METADATA_FILE)

def get_picture(id: str) -> Optional[str]:
    """Return the image path for a given ID from metadata.json, or None if not found."""
    metadata = get_metadata()
    for item in metadata:
        if item.get("id") == id:
            return os.path.join(IMAGES_ROOT, item.get("image"))
    return None

def look_items(n: int) -> List[Dict]:
    """Return the n most recent items from metadata.json (sorted by insertion order)."""
    return get_recent_entries(n, METADATA_FILE)

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
    return get_by_id(id, METADATA_FILE) 

def get_all_categories() -> List[str]:
    """Return a list of all unique categories from metadata.json."""
    return get_unique_values("category", METADATA_FILE)

def get_items_by_category(category: str) -> List[Dict]:
    """Return all items for a specific category."""
    return get_by_field_value("category", category, METADATA_FILE)

def get_all_items_grouped_by_category() -> Dict[str, List[Dict]]:
    """Return all items grouped by category."""
    metadata = load_metadata(METADATA_FILE)
    grouped = {}
    for item in metadata:
        category = item.get("category")
        if category:
            if category not in grouped:
                grouped[category] = []
            grouped[category].append(item)
    return grouped

# ========== GENERIC METADATA FUNCTIONS ==========

def load_metadata(metadata_file: str) -> List[Dict]:
    """Load and return the metadata list from the specified file."""
    if os.path.exists(metadata_file):
        with open(metadata_file, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except Exception:
                return []
    return []

def save_metadata(metadata: List[Dict], metadata_file: str):
    """Save metadata list to the specified file."""
    with open(metadata_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)

def get_by_id(id: str, metadata_file: str) -> Optional[Dict]:
    """Return the metadata entry for the given ID, or None if not found."""
    metadata = load_metadata(metadata_file)
    for item in metadata:
        if item.get("id") == id:
            return item
    return None

def get_recent_entries(n: int, metadata_file: str) -> List[Dict]:
    """Return the n most recent entries from metadata file (sorted by insertion order)."""
    metadata = load_metadata(metadata_file)
    return metadata[-n:] if n > 0 else []

def get_unique_values(field: str, metadata_file: str) -> List[str]:
    """Return a list of all unique values for the given field."""
    metadata = load_metadata(metadata_file)
    values = set()
    for item in metadata:
        value = item.get(field)
        if value:
            if isinstance(value, list):
                values.update(value)
            else:
                values.add(value)
    return sorted(list(values))

def get_by_field_value(field: str, value: str, metadata_file: str) -> List[Dict]:
    """Return all entries where the field contains the value."""
    metadata = load_metadata(metadata_file)
    result = []
    for item in metadata:
        field_value = item.get(field)
        if field_value:
            if isinstance(field_value, list) and value in field_value:
                result.append(item)
            elif field_value == value:
                result.append(item)
    return result

def delete_by_id(id: str, metadata_file: str) -> bool:
    """Delete an entry by ID. Returns True if successful, False if not found."""
    metadata = load_metadata(metadata_file)
    original_length = len(metadata)
    
    # Filter out the entry with the given ID
    metadata = [item for item in metadata if item.get("id") != id]
    
    if len(metadata) < original_length:
        save_metadata(metadata, metadata_file)
        return True
    return False

# ========== OUTFIT-SPECIFIC FUNCTIONS ==========

def save_outfit(name: str, item_ids: List[str], description: str = "", tags: List[str] = None) -> Dict:
    """Save a new outfit with the given name and item IDs."""
    if tags is None:
        tags = []
    
    outfit_id = generate_random_id()
    metadata = load_metadata(OUTFIT_METADATA_FILE)
    
    # Remove any existing entry with this ID (shouldn't happen with UUID)
    metadata = [outfit for outfit in metadata if outfit.get("id") != outfit_id]
    
    # Add new entry
    metadata.append({
        "id": outfit_id,
        "name": name,
        "item_ids": item_ids,
        "description": description,
        "tags": tags,
        "created_at": datetime.utcnow().isoformat() + "Z"
    })
    
    save_metadata(metadata, OUTFIT_METADATA_FILE)
    
    return {
        "message": "Outfit saved successfully",
        "id": outfit_id,
        "name": name,
        "item_ids": item_ids,
        "description": description,
        "tags": tags,
        "metadata_file": OUTFIT_METADATA_FILE
    }

def get_outfit_with_items(outfit_id: str) -> Optional[Dict]:
    """Return outfit info with full item details populated."""
    outfit = get_by_id(outfit_id, OUTFIT_METADATA_FILE)
    if not outfit:
        return None
    
    # Get full item details for each item_id
    items = []
    for item_id in outfit.get("item_ids", []):
        item_info = get_item_info(item_id)
        if item_info:
            items.append(item_info)
    
    # Return outfit with populated items
    return {
        **outfit,
        "items": items
    }

def get_recent_outfits(limit: int = 10) -> List[Dict]:
    """Return a list of recent outfits with their item details populated."""
    recent_outfits = get_recent_entries(limit, OUTFIT_METADATA_FILE)
    result = []
    
    for outfit in recent_outfits:
        outfit_with_items = get_outfit_with_items(outfit["id"])
        if outfit_with_items:
            result.append(outfit_with_items)
    
    return result

def get_all_outfits_with_items() -> List[Dict]:
    """Return all outfits with their item details populated."""
    all_outfits = load_metadata(OUTFIT_METADATA_FILE)
    result = []
    
    for outfit in all_outfits:
        outfit_with_items = get_outfit_with_items(outfit["id"])
        if outfit_with_items:
            result.append(outfit_with_items)
    
    return result

# ========== WRAPPER FUNCTIONS FOR CONSISTENCY ==========

# Outfit functions using generic functions
def get_outfit_info(outfit_id: str) -> Optional[Dict]:
    """Return the full outfit metadata dictionary for the outfit with the given ID."""
    return get_by_id(outfit_id, OUTFIT_METADATA_FILE)

def get_all_outfits() -> List[Dict]:
    """Return all outfits."""
    return load_metadata(OUTFIT_METADATA_FILE)

def get_all_outfit_tags() -> List[str]:
    """Return a list of all unique tags from outfit metadata."""
    return get_unique_values("tags", OUTFIT_METADATA_FILE)

def get_outfits_by_tag(tag: str) -> List[Dict]:
    """Return all outfits that contain the specified tag."""
    return get_by_field_value("tags", tag, OUTFIT_METADATA_FILE)

def delete_outfit(outfit_id: str) -> bool:
    """Delete an outfit by ID. Returns True if successful, False if not found."""
    return delete_by_id(outfit_id, OUTFIT_METADATA_FILE)
