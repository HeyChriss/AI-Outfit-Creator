# backend/test_supabase_connection.py
import os
from dotenv import load_dotenv

def test_supabase_connection():
    """Test Supabase connection and environment setup"""
    
    # Load environment variables
    load_dotenv()
    
    print("=== SUPABASE CONNECTION TEST ===")
    
    # Check environment variables
    print("\n1. Checking environment variables...")
    supabase_url = os.environ.get("SUPABASE_URL")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    anon_key = os.environ.get("SUPABASE_ANON_KEY")
    
    if not supabase_url:
        print("❌ SUPABASE_URL not found in environment")
        print("   Make sure you have a .env file with SUPABASE_URL=your_url")
        return False
    else:
        print(f"✅ SUPABASE_URL: {supabase_url[:30]}...")
    
    if not service_key:
        print("❌ SUPABASE_SERVICE_ROLE_KEY not found in environment")
        print("   Make sure you have SUPABASE_SERVICE_ROLE_KEY in your .env file")
        return False
    else:
        print(f"✅ SUPABASE_SERVICE_ROLE_KEY: {service_key[:30]}...")
    
    if not anon_key:
        print("❌ SUPABASE_ANON_KEY not found in environment")
        print("   Make sure you have SUPABASE_ANON_KEY in your .env file")
        return False
    else:
        print(f"✅ SUPABASE_ANON_KEY: {anon_key[:30]}...")
    
    # Test Supabase import
    print("\n2. Testing Supabase import...")
    try:
        from supabase import create_client, Client
        print("✅ Supabase package imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import supabase package: {e}")
        print("Make sure you activated your virtual environment and installed supabase")
        return False
    
    # Test client creation
    print("\n3. Testing client creation...")
    try:
        supabase_client = create_client(supabase_url, service_key)
        print("✅ Supabase client created successfully")
    except Exception as e:
        print(f"❌ Failed to create Supabase client: {e}")
        print("Check if your SUPABASE_URL and keys are correct")
        return False
    
    # Test database connection
    print("\n4. Testing database connection...")
    try:
        # Try to fetch from a table (this will fail if tables don't exist, but connection works)
        result = supabase_client.table("clothing_items").select("*").limit(1).execute()
        print("✅ Database connection successful")
        print(f"   Found {len(result.data)} items in clothing_items table")
    except Exception as e:
        print(f"⚠️  Database query failed: {e}")
        print("   This is normal if you haven't created the database tables yet")
        print("   You need to run the SQL schema in Supabase dashboard")
    
    # Test storage connection
    print("\n5. Testing storage connection...")
    try:
        buckets = supabase_client.storage.list_buckets()
        print("✅ Storage connection successful")
        print(f"   Found {len(buckets)} storage buckets")
        
        # Check for clothing-images bucket
        bucket_names = [bucket.name for bucket in buckets]
        if "clothing-images" in bucket_names:
            print("✅ Found 'clothing-images' bucket")
        else:
            print("⚠️  'clothing-images' bucket not found")
            print("   You need to create it in Supabase dashboard → Storage")
            
    except Exception as e:
        print(f"❌ Storage connection failed: {e}")
    
    print("\n=== TEST COMPLETE ===")
    
    # Test supabase_service import
    print("\n6. Testing supabase_service import...")
    try:
        from supabase_service import supabase_service
        print("✅ supabase_service imported successfully")
        print("   Your backend should work with Supabase now!")
    except Exception as e:
        print(f"❌ supabase_service import failed: {e}")
        print("   Check if supabase_service.py has syntax errors")
    
    return True

if __name__ == "__main__":
    test_supabase_connection()