# migration_script.py
import os
import json
import asyncio
import shutil
from pathlib import Path
from supabase_service import supabase_service
from fastapi import UploadFile
import tempfile

class LocalToSupabaseMigration:
    """Migration script to move data from local JSON files to Supabase"""
    
    def __init__(self, user_id: str):
        """
        Initialize migration for a specific user
        
        Args:
            user_id: The Supabase user ID to migrate data to
        """
        self.user_id = user_id
        self.backend_dir = Path(__file__).parent
        self.images_dir = self.backend_dir / "images"
        self.metadata_file = self.images_dir / "metadata.json"
        self.outfit_metadata_file = self.images_dir / "outfit_metadata.json"
        
        self.migrated_items = {}  # Map old IDs to new IDs
        self.migration_log = []
        
    def log(self, message: str):
        """Log migration progress"""
        print(f"[MIGRATION] {message}")
        self.migration_log.append(message)
    
    async def migrate_clothing_items(self):
        """Migrate clothing items from local storage to Supabase"""
        if not self.metadata_file.exists():
            self.log("No metadata.json file found, skipping clothing items migration")
            return
        
        self.log("Starting clothing items migration...")
        
        try:
            with open(self.metadata_file, 'r', encoding='utf-8') as f:
                items = json.load(f)
        except Exception as e:
            self.log(f"Error reading metadata.json: {e}")
            return
        
        for item in items:
            try:
                await self._migrate_single_item(item)
            except Exception as e:
                self.log(f"Error migrating item {item.get('id', 'unknown')}: {e}")
                continue
        
        self.log(f"Completed clothing items migration. Migrated {len(self.migrated_items)} items.")
    
    async def _migrate_single_item(self, item: dict):
        """Migrate a single clothing item"""
        old_id = item.get("id")
        if not old_id:
            self.log("Skipping item with no ID")
            return
        
        # Construct the local image path
        image_relative_path = item.get("image")
        if not image_relative_path:
            self.log(f"Skipping item {old_id} - no image path")
            return
        
        local_image_path = self.images_dir / image_relative_path
        
        if not local_image_path.exists():
            self.log(f"Skipping item {old_id} - image file not found: {local_image_path}")
            return
        
        # Prepare item details
        details = item.get("details", {})
        category = details.get("category", item.get("category", "Other"))
        
        # Create a temporary UploadFile-like object
        try:
            with open(local_image_path, 'rb') as f:
                file_content = f.read()
            
            # Create temporary file to simulate UploadFile
            with tempfile.NamedTemporaryFile(delete=False, suffix=local_image_path.suffix) as temp_file:
                temp_file.write(file_content)
                temp_file_path = temp_file.name
            
            # Create UploadFile-like object
            class MockUploadFile:
                def __init__(self, file_path: str, filename: str, content_type: str):
                    self.file_path = file_path
                    self.filename = filename
                    self.content_type = content_type
                
                async def read(self):
                    with open(self.file_path, 'rb') as f:
                        return f.read()
            
            # Determine content type
            file_ext = local_image_path.suffix.lower()
            content_type_map = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp'
            }
            content_type = content_type_map.get(file_ext, 'image/jpeg')
            
            mock_file = MockUploadFile(temp_file_path, local_image_path.name, content_type)
            
            # Upload image to Supabase
            image_data = await supabase_service.upload_image(mock_file, category, self.user_id)
            
            # Prepare item details for Supabase
            supabase_details = {
                "name": details.get("name", ""),
                "category": category,
                "color": details.get("color", ""),
                "brand": details.get("brand", ""),
                "notes": details.get("notes", ""),
                **details  # Include any additional details
            }
            
            # Save to Supabase database
            new_item = await supabase_service.save_clothing_item(image_data, supabase_details, self.user_id)
            
            # Track the mapping
            self.migrated_items[old_id] = new_item["id"]
            
            self.log(f"Successfully migrated item: {old_id} -> {new_item['id']} ({category})")
            
            # Clean up temp file
            os.unlink(temp_file_path)
            
        except Exception as e:
            self.log(f"Error migrating item {old_id}: {e}")
            raise
    
    async def migrate_outfits(self):
        """Migrate outfits from local storage to Supabase"""
        if not self.outfit_metadata_file.exists():
            self.log("No outfit_metadata.json file found, skipping outfits migration")
            return
        
        self.log("Starting outfits migration...")
        
        try:
            with open(self.outfit_metadata_file, 'r', encoding='utf-8') as f:
                outfits = json.load(f)
        except Exception as e:
            self.log(f"Error reading outfit_metadata.json: {e}")
            return
        
        migrated_outfits = 0
        
        for outfit in outfits:
            try:
                await self._migrate_single_outfit(outfit)
                migrated_outfits += 1
            except Exception as e:
                self.log(f"Error migrating outfit {outfit.get('id', 'unknown')}: {e}")
                continue
        
        self.log(f"Completed outfits migration. Migrated {migrated_outfits} outfits.")
    
    async def _migrate_single_outfit(self, outfit: dict):
        """Migrate a single outfit"""
        old_id = outfit.get("id")
        if not old_id:
            self.log("Skipping outfit with no ID")
            return
        
        name = outfit.get("name", f"Migrated Outfit {old_id[:8]}")
        description = outfit.get("description", "")
        tags = outfit.get("tags", [])
        old_item_ids = outfit.get("item_ids", [])
        
        # Map old item IDs to new item IDs
        new_item_ids = []
        missing_items = []
        
        for old_item_id in old_item_ids:
            if old_item_id in self.migrated_items:
                new_item_ids.append(self.migrated_items[old_item_id])
            else:
                missing_items.append(old_item_id)
        
        if missing_items:
            self.log(f"Warning: Outfit {old_id} references missing items: {missing_items}")
        
        if not new_item_ids:
            self.log(f"Skipping outfit {old_id} - no valid items found")
            return
        
        # Create outfit in Supabase
        new_outfit = await supabase_service.save_outfit(
            name=name,
            item_ids=new_item_ids,
            user_id=self.user_id,
            description=description,
            tags=tags
        )
        
        self.log(f"Successfully migrated outfit: {old_id} -> {new_outfit['id']} ({name})")
    
    async def create_backup(self):
        """Create a backup of the original data before migration"""
        backup_dir = self.backend_dir / "migration_backup"
        backup_dir.mkdir(exist_ok=True)
        
        try:
            # Backup metadata files
            if self.metadata_file.exists():
                shutil.copy2(self.metadata_file, backup_dir / "metadata.json")
                self.log("Backed up metadata.json")
            
            if self.outfit_metadata_file.exists():
                shutil.copy2(self.outfit_metadata_file, backup_dir / "outfit_metadata.json")
                self.log("Backed up outfit_metadata.json")
            
            # Backup images directory
            if self.images_dir.exists():
                backup_images_dir = backup_dir / "images"
                if backup_images_dir.exists():
                    shutil.rmtree(backup_images_dir)
                shutil.copytree(self.images_dir, backup_images_dir)
                self.log("Backed up images directory")
            
            self.log(f"Backup completed in: {backup_dir}")
            
        except Exception as e:
            self.log(f"Error creating backup: {e}")
            raise
    
    async def generate_migration_report(self):
        """Generate a migration report"""
        report_path = self.backend_dir / "migration_report.txt"
        
        with open(report_path, 'w') as f:
            f.write("=== SUPABASE MIGRATION REPORT ===\n")
            f.write(f"User ID: {self.user_id}\n")
            f.write(f"Migration Date: {asyncio.get_event_loop().time()}\n\n")
            
            f.write("=== MIGRATED ITEMS ===\n")
            for old_id, new_id in self.migrated_items.items():
                f.write(f"{old_id} -> {new_id}\n")
            
            f.write(f"\nTotal Items Migrated: {len(self.migrated_items)}\n\n")
            
            f.write("=== MIGRATION LOG ===\n")
            for log_entry in self.migration_log:
                f.write(f"{log_entry}\n")
        
        self.log(f"Migration report saved to: {report_path}")
    
    async def run_full_migration(self, create_backup: bool = True):
        """Run the complete migration process"""
        self.log(f"Starting full migration for user: {self.user_id}")
        
        try:
            if create_backup:
                await self.create_backup()
            
            # Migrate clothing items first (outfits depend on them)
            await self.migrate_clothing_items()
            
            # Then migrate outfits
            await self.migrate_outfits()
            
            # Generate report
            await self.generate_migration_report()
            
            self.log("Migration completed successfully!")
            
        except Exception as e:
            self.log(f"Migration failed: {e}")
            raise

async def main():
    """Main migration function"""
    # You need to provide a valid Supabase user ID
    # This should be the ID of the user you want to migrate data to
    
    USER_ID = input("Enter the Supabase user ID to migrate data to: ").strip()
    
    if not USER_ID:
        print("Error: User ID is required")
        return
    
    # Confirm migration
    confirm = input(f"Are you sure you want to migrate local data to user {USER_ID}? (yes/no): ").strip().lower()
    if confirm != 'yes':
        print("Migration cancelled")
        return
    
    migration = LocalToSupabaseMigration(USER_ID)
    
    try:
        await migration.run_full_migration()
        print("\n✅ Migration completed successfully!")
        print("Check the migration_report.txt file for details.")
        print("Your original data has been backed up in the migration_backup/ directory.")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        print("Check the migration_report.txt file for details.")
        print("Your original data is still intact.")

if __name__ == "__main__":
    asyncio.run(main())

# Example usage:
# python migration_script.py