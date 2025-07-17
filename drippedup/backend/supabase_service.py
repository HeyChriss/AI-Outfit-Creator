# backend/supabase_service.py
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import Dict, List, Optional, Tuple
from fastapi import UploadFile
import uuid
import json
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

class SupabaseService:
    def __init__(self):
        url = os.environ.get("SUPABASE_URL")
        # Use service role key for backend operations
        key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        
        if not url or not key:
            raise ValueError("Missing Supabase environment variables")
        
        self.supabase: Client = create_client(url, key)
        logger.info("Supabase service initialized successfully")
    
    async def upload_image(self, file: UploadFile, category: str, user_id: str) -> Dict:
        """Upload image to Supabase Storage"""
        try:
            # Generate unique filename
            file_ext = file.filename.split('.')[-1] if file.filename else 'jpg'
            file_name = f"{uuid.uuid4()}.{file_ext}"
            file_path = f"{user_id}/{category}/{file_name}"
            
            # Read file data
            file_data = await file.read()
            
            # Upload to Supabase Storage
            result = self.supabase.storage.from_("clothing-images").upload(
                path=file_path,
                file=file_data,
                file_options={"content-type": file.content_type}
            )
            
            if hasattr(result, 'error') and result.error:
                raise Exception(f"Upload failed: {result.error}")
            
            # Get public URL
            public_url = self.supabase.storage.from_("clothing-images").get_public_url(file_path)
            
            logger.info(f"Image uploaded successfully: {file_path}")
            
            return {
                "file_path": file_path,
                "public_url": public_url,
                "file_name": file_name
            }
            
        except Exception as e:
            logger.error(f"Failed to upload image: {str(e)}")
            raise Exception(f"Failed to upload image: {str(e)}")
    
    async def save_clothing_item(self, image_data: Dict, details: Dict, user_id: str) -> Dict:
        """Save clothing item to database"""
        try:
            item_data = {
                "user_id": user_id,
                "name": details.get("name", ""),
                "category": details.get("category", ""),
                "color": details.get("color", ""),
                "brand": details.get("brand", ""),
                "notes": details.get("notes", ""),
                "image_url": image_data["public_url"],
                "image_path": image_data["file_path"],
                "details": details  # Store full details as JSONB
            }
            
            result = self.supabase.table("clothing_items").insert(item_data).execute()
            
            if not result.data:
                raise Exception("Failed to insert clothing item")
            
            logger.info(f"Clothing item saved: {result.data[0]['id']}")
            return result.data[0]
            
        except Exception as e:
            logger.error(f"Failed to save clothing item: {str(e)}")
            raise Exception(f"Failed to save clothing item: {str(e)}")
    
    async def get_user_items(self, user_id: str, category: Optional[str] = None, limit: int = 100) -> List[Dict]:
        """Get clothing items for a user"""
        try:
            query = self.supabase.table("clothing_items").select("*").eq("user_id", user_id)
            
            if category:
                query = query.eq("category", category)
            
            result = query.order("created_at", desc=True).limit(limit).execute()
            return result.data
            
        except Exception as e:
            logger.error(f"Failed to get user items: {str(e)}")
            raise Exception(f"Failed to get user items: {str(e)}")
    
    async def get_item_by_id(self, item_id: str) -> Optional[Dict]:
        """Get single item by ID"""
        try:
            result = self.supabase.table("clothing_items").select("*").eq("id", item_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Failed to get item: {str(e)}")
            raise Exception(f"Failed to get item: {str(e)}")
    
    async def get_user_categories(self, user_id: str) -> List[str]:
        """Get all categories for a user"""
        try:
            result = self.supabase.table("clothing_items").select("category").eq("user_id", user_id).execute()
            categories = list(set([item["category"] for item in result.data if item["category"]]))
            return sorted(categories)
        except Exception as e:
            logger.error(f"Failed to get categories: {str(e)}")
            raise Exception(f"Failed to get categories: {str(e)}")
    
    async def download_image_for_ml(self, file_path: str) -> bytes:
        """Download image from storage for ML processing"""
        try:
            result = self.supabase.storage.from_("clothing-images").download(file_path)
            return result
        except Exception as e:
            logger.error(f"Failed to download image: {str(e)}")
            raise Exception(f"Failed to download image: {str(e)}")
    
    async def save_outfit(self, name: str, item_ids: List[str], user_id: str, 
                         description: str = "", tags: List[str] = None) -> Dict:
        """Save outfit to database"""
        try:
            if tags is None:
                tags = []
            
            # Validate that all items exist and belong to user
            for item_id in item_ids:
                item = await self.get_item_by_id(item_id)
                if not item or item["user_id"] != user_id:
                    raise Exception(f"Item {item_id} not found or doesn't belong to user")
            
            # Create outfit
            outfit_data = {
                "user_id": user_id,
                "name": name,
                "description": description,
                "tags": tags
            }
            
            outfit_result = self.supabase.table("outfits").insert(outfit_data).execute()
            
            if not outfit_result.data:
                raise Exception("Failed to create outfit")
            
            outfit = outfit_result.data[0]
            outfit_id = outfit["id"]
            
            # Add items to outfit
            outfit_items = [
                {
                    "outfit_id": outfit_id,
                    "clothing_item_id": item_id,
                    "position": idx
                }
                for idx, item_id in enumerate(item_ids)
            ]
            
            items_result = self.supabase.table("outfit_items").insert(outfit_items).execute()
            
            logger.info(f"Outfit saved: {outfit_id}")
            return outfit
            
        except Exception as e:
            logger.error(f"Failed to save outfit: {str(e)}")
            raise Exception(f"Failed to save outfit: {str(e)}")
    
    async def get_outfit_with_items(self, outfit_id: str) -> Optional[Dict]:
        """Get outfit with populated item details"""
        try:
            # Get outfit
            outfit_result = self.supabase.table("outfits").select("*").eq("id", outfit_id).execute()
            
            if not outfit_result.data:
                return None
            
            outfit = outfit_result.data[0]
            
            # Get outfit items with clothing details
            items_result = self.supabase.table("outfit_items").select("""
                *,
                clothing_item:clothing_items(*)
            """).eq("outfit_id", outfit_id).order("position").execute()
            
            # Add items to outfit
            outfit["items"] = [item["clothing_item"] for item in items_result.data]
            
            return outfit
            
        except Exception as e:
            logger.error(f"Failed to get outfit: {str(e)}")
            raise Exception(f"Failed to get outfit: {str(e)}")
    
    async def get_user_outfits(self, user_id: str, limit: int = 100) -> List[Dict]:
        """Get all outfits for a user with item details"""
        try:
            outfits_result = self.supabase.table("outfits").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(limit).execute()
            
            outfits_with_items = []
            for outfit in outfits_result.data:
                outfit_with_items = await self.get_outfit_with_items(outfit["id"])
                if outfit_with_items:
                    outfits_with_items.append(outfit_with_items)
            
            return outfits_with_items
            
        except Exception as e:
            logger.error(f"Failed to get user outfits: {str(e)}")
            raise Exception(f"Failed to get user outfits: {str(e)}")
    
    async def get_recent_outfits(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Get recent outfits for a user"""
        try:
            return await self.get_user_outfits(user_id, limit)
        except Exception as e:
            logger.error(f"Failed to get recent outfits: {str(e)}")
            raise Exception(f"Failed to get recent outfits: {str(e)}")
    
    async def delete_outfit(self, outfit_id: str) -> bool:
        """Delete an outfit by ID"""
        try:
            # Delete outfit items first (due to foreign key constraint)
            self.supabase.table("outfit_items").delete().eq("outfit_id", outfit_id).execute()
            
            # Delete outfit
            result = self.supabase.table("outfits").delete().eq("id", outfit_id).execute()
            
            return len(result.data) > 0
            
        except Exception as e:
            logger.error(f"Failed to delete outfit: {str(e)}")
            raise Exception(f"Failed to delete outfit: {str(e)}")
    
    async def delete_item(self, item_id: str) -> bool:
        """Delete a clothing item by ID"""
        try:
            # Get item to check if it exists and get image path
            item = await self.get_item_by_id(item_id)
            if not item:
                return False
            
            # Delete from outfit_items first (foreign key constraint)
            self.supabase.table("outfit_items").delete().eq("clothing_item_id", item_id).execute()
            
            # Delete from database
            result = self.supabase.table("clothing_items").delete().eq("id", item_id).execute()
            
            # Delete image from storage
            try:
                self.supabase.storage.from_("clothing-images").remove([item["image_path"]])
            except Exception as e:
                logger.warning(f"Failed to delete image from storage: {e}")
            
            return len(result.data) > 0
            
        except Exception as e:
            logger.error(f"Failed to delete item: {str(e)}")
            raise Exception(f"Failed to delete item: {str(e)}")
    
    async def update_clothing_item(self, item_id: str, updates: Dict) -> Optional[Dict]:
        """Update a clothing item"""
        try:
            result = self.supabase.table("clothing_items").update(updates).eq("id", item_id).execute()
            
            if not result.data:
                return None
            
            return result.data[0]
            
        except Exception as e:
            logger.error(f"Failed to update item: {str(e)}")
            raise Exception(f"Failed to update item: {str(e)}")
    
    async def save_compatibility_result(self, user_id: str, item1_id: str, item2_id: str, 
                                       score: float, embedding1: List[float], embedding2: List[float]) -> Dict:
        """Save compatibility prediction result for caching"""
        try:
            compatibility_data = {
                "user_id": user_id,
                "item1_id": item1_id,
                "item2_id": item2_id,
                "compatibility_score": score,
                "embedding1": embedding1,
                "embedding2": embedding2,
                "model_version": "v1.0"
            }
            
            # Use upsert to handle duplicates
            result = self.supabase.table("compatibility_results").upsert(
                compatibility_data,
                on_conflict="item1_id,item2_id"
            ).execute()
            
            return result.data[0] if result.data else None
            
        except Exception as e:
            logger.error(f"Failed to save compatibility result: {str(e)}")
            raise Exception(f"Failed to save compatibility result: {str(e)}")
    
    async def get_compatibility_result(self, item1_id: str, item2_id: str) -> Optional[Dict]:
        """Get cached compatibility result"""
        try:
            # Try both directions (item1,item2) and (item2,item1)
            result1 = self.supabase.table("compatibility_results").select("*").eq("item1_id", item1_id).eq("item2_id", item2_id).execute()
            
            if result1.data:
                return result1.data[0]
            
            result2 = self.supabase.table("compatibility_results").select("*").eq("item1_id", item2_id).eq("item2_id", item1_id).execute()
            
            if result2.data:
                return result2.data[0]
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get compatibility result: {str(e)}")
            return None

# Global instance
supabase_service = SupabaseService()