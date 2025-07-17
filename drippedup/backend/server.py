# backend/server.py - Clean Supabase-only version
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import io
import tempfile
from typing import Dict, List
import logging
from classification import ClothingClassifier
from PIL import Image
import numpy as np
import json
from fashion import FashionCompatibility
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import Supabase service
from supabase_service import supabase_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="DrippedUp API"
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # might have to change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the classifier globally
classifier = None
fashion = None

@app.on_event("startup")
async def startup_event():
    """Initialize the classifier and fashion tester when the server starts."""
    global classifier, fashion
    try:
        classifier = ClothingClassifier()
        logger.info("Classifier initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize classifier: {e}")
        raise
    
    # Make fashion model optional
    try:
        fashion = FashionCompatibility()
        logger.info("FashionCompatibility initialized successfully")
    except Exception as e:
        logger.warning(f"FashionCompatibility not available: {e}")
        logger.info("Server will run without fashion compatibility features")
        fashion = None

@app.get("/")
async def root():
    """Root endpoint to check if the server is running."""
    return {
        "message": "DrippedUp API is running with Supabase!",
        "supabase_enabled": True,
        "fashion_model_available": fashion is not None
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    global classifier
    if classifier is None:
        raise HTTPException(status_code=503, detail="Classifier not initialized")
    
    return {
        "status": "healthy",
        "classifier_ready": classifier is not None,
        "fashion_model_ready": fashion is not None,
        "supabase_enabled": True,
        "model_info": classifier.get_model_info() if classifier else None
    }

def process_image_from_memory(image_data: bytes, image_size: int = 224) -> np.ndarray:
    """
    Process image data directly from memory without saving to disk.
    
    Args:
        image_data: Raw image bytes
        image_size: Target size for the image
        
    Returns:
        np.ndarray: Preprocessed image array ready for prediction
    """
    try:
        # Open image from bytes
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image
        image = image.resize((image_size, image_size))
        
        # Convert to numpy array and normalize
        img_array = np.array(image)
        img_array = img_array / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
        
    except Exception as e:
        logger.error(f"Error processing image from memory: {e}")
        raise

@app.post("/predict")
async def predict_clothing(file: UploadFile = File(...)):
    """
    Predict clothing type from uploaded image.
    
    Args:
        file: The uploaded image file
        
    Returns:
        JSON response with the top prediction result
    """
    global classifier
    
    if classifier is None:
        raise HTTPException(status_code=503, detail="Classifier not initialized")
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read image data into memory
        image_data = await file.read()
        
        # Process image directly from memory
        img_array = process_image_from_memory(image_data, classifier.image_size)
        
        # Make prediction using the model directly
        prediction = classifier.model.predict(img_array, verbose=0)
        
        # Get the class with highest probability
        predicted_class_idx = np.argmax(prediction, axis=1)[0]
        predicted_class_name = classifier.class_labels[predicted_class_idx]
        
        # Get confidence score
        confidence = float(prediction[0][predicted_class_idx] * 100)
        
        # Return only the top prediction
        results = {
            "predicted_class_index": int(predicted_class_idx),
            "predicted_class_name": predicted_class_name,
            "confidence": confidence,
            "uploaded_file": {
                "filename": file.filename,
                "content_type": file.content_type,
                "size": len(image_data)
            }
        }
        
        logger.info(f"Prediction completed for {file.filename}: {predicted_class_name} ({confidence:.2f}%)")
        return results
        
    except Exception as e:
        logger.error(f"Error processing prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/model-info")
async def get_model_info():
    """Get information about the loaded model."""
    global classifier
    
    if classifier is None:
        raise HTTPException(status_code=503, detail="Classifier not initialized")
    
    return classifier.get_model_info()

@app.post("/save-item")
async def save_item_endpoint(
    file: UploadFile = File(...),
    clothing_type: str = Form(...),
    details: str = Form(None),
    user_id: str = Form(...)
):
    """
    Save uploaded image and details to Supabase.
    """
    try:
        details_dict = json.loads(details) if details else {}
        
        # Upload image to Supabase
        image_data = await supabase_service.upload_image(file, clothing_type, user_id)
        
        # Save clothing item to database
        item = await supabase_service.save_clothing_item(image_data, details_dict, user_id)
        
        return {
            "message": "Item saved successfully to Supabase",
            "item": item
        }
        
    except Exception as e:
        logger.error(f"Error saving item: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save item: {str(e)}")

@app.get("/recent-uploads")
async def get_recent_uploads_endpoint(user_id: str = None):
    """
    Get the most recent uploads from Supabase.
    """
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        items = await supabase_service.get_user_items(user_id, limit=10)
        # Convert to the format your frontend expects
        recent_uploads = []
        for item in items:
            recent_uploads.append({
                "image_path": item.get("image_url", ""),
                "item_info": item
            })
        return {"recent_uploads": recent_uploads}
    except Exception as e:
        logger.error(f"Error getting recent uploads: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get recent uploads: {str(e)}")

@app.get("/categories")
async def get_categories(user_id: str = None):
    """
    Get all available clothing categories for a user.
    """
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        categories = await supabase_service.get_user_categories(user_id)
        return {"categories": categories}
    except Exception as e:
        logger.error(f"Error getting categories: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get categories: {str(e)}")

@app.get("/items/category/{category}")
async def get_items_by_category_endpoint(category: str, user_id: str = None):
    """
    Get all items for a specific category.
    """
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        items = await supabase_service.get_user_items(user_id, category=category)
        return {"category": category, "items": items}
    except Exception as e:
        logger.error(f"Error getting items for category {category}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get items for category: {str(e)}")

@app.get("/items/grouped")
async def get_items_grouped_by_category_endpoint(user_id: str = None):
    """
    Get all items grouped by category.
    """
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        # Get all items and group them
        items = await supabase_service.get_user_items(user_id)
        grouped_items = {}
        for item in items:
            category = item.get("category", "Other")
            if category not in grouped_items:
                grouped_items[category] = []
            grouped_items[category].append(item)
        return {"items_by_category": grouped_items}
    except Exception as e:
        logger.error(f"Error getting grouped items: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get grouped items: {str(e)}")

@app.get("/item/{item_id}")
async def get_item_by_id(item_id: str):
    """
    Get item information by ID.
    """
    try:
        item_info = await supabase_service.get_item_by_id(item_id)
        if item_info is None:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"item": item_info}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting item {item_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get item: {str(e)}")

@app.post("/fashion-predict")
async def fashion_predict(item_id1: str = Form(...), item_id2: str = Form(...)):
    """
    Predict fashion compatibility between two items by their IDs.
    """
    global fashion
    if fashion is None:
        raise HTTPException(status_code=503, detail="FashionCompatibility not available")
    
    try:
        # Get items from Supabase
        item1 = await supabase_service.get_item_by_id(item_id1)
        item2 = await supabase_service.get_item_by_id(item_id2)
        
        if not item1 or not item2:
            raise HTTPException(status_code=404, detail="One or both items not found")
        
        # Download images for ML processing
        image1_data = await supabase_service.download_image_for_ml(item1["image_path"])
        image2_data = await supabase_service.download_image_for_ml(item2["image_path"])
        
        # Save to temporary files for ML model
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f1:
            f1.write(image1_data)
            temp_path1 = f1.name
        
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f2:
            f2.write(image2_data)
            temp_path2 = f2.name
        
        try:
            # Predict compatibility
            result = fashion.predict_from_paths(temp_path1, temp_path2)
            
            # Add item info to response
            result["items"] = [
                {"id": item_id1, "info": item1},
                {"id": item_id2, "info": item2}
            ]
            
            return result
            
        finally:
            # Clean up temp files
            os.unlink(temp_path1)
            os.unlink(temp_path2)
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing fashion prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Fashion prediction failed: {str(e)}")

@app.get("/fashion-model-info")
async def get_fashion_model_info():
    """Get information about the loaded fashion model."""
    global fashion
    if fashion is None:
        raise HTTPException(status_code=503, detail="FashionCompatibility not available")
    return fashion.get_model_info()

# ========== OUTFIT ENDPOINTS ==========

@app.post("/outfit")
async def create_outfit(
    name: str = Form(...),
    item_ids: str = Form(...),  # JSON string of item IDs
    description: str = Form(""),
    tags: str = Form("[]"),  # JSON string of tags
    user_id: str = Form(...)
):
    """
    Create a new outfit with the given name and item IDs.
    """
    try:
        # Parse JSON strings
        item_ids_list = json.loads(item_ids)
        tags_list = json.loads(tags)
        
        # Create outfit using Supabase
        result = await supabase_service.save_outfit(name, item_ids_list, user_id, description, tags_list)
        return {
            "message": "Outfit saved successfully",
            "outfit": result
        }
        
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating outfit: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create outfit: {str(e)}")

@app.get("/outfit/{outfit_id}")
async def get_outfit_by_id(outfit_id: str):
    """
    Get outfit information by ID, including populated item details.
    """
    try:
        outfit = await supabase_service.get_outfit_with_items(outfit_id)
        if outfit is None:
            raise HTTPException(status_code=404, detail="Outfit not found")
        return {"outfit": outfit}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting outfit {outfit_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get outfit: {str(e)}")

@app.get("/outfits")
async def get_all_outfits_endpoint(user_id: str = None):
    """
    Get all outfits with populated item details.
    """
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        outfits = await supabase_service.get_user_outfits(user_id)
        return {"outfits": outfits, "count": len(outfits)}
    except Exception as e:
        logger.error(f"Error getting all outfits: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get outfits: {str(e)}")

@app.get("/outfits/basic")
async def get_all_outfits_basic(user_id: str = None):
    """
    Get all outfits without populated item details (faster).
    """
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        # Get basic outfit info from Supabase
        outfits_result = supabase_service.supabase.table("outfits").select("*").eq("user_id", user_id).execute()
        outfits = outfits_result.data or []
        return {"outfits": outfits, "count": len(outfits)}
    except Exception as e:
        logger.error(f"Error getting all outfits basic: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get outfits: {str(e)}")

@app.get("/outfits/recent/{limit}")
async def get_recent_outfits_endpoint(limit: int, user_id: str = None):
    """
    Get the most recent outfits with populated item details.
    """
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        if limit <= 0:
            raise HTTPException(status_code=400, detail="Limit must be positive")
        if limit > 100:
            raise HTTPException(status_code=400, detail="Limit cannot exceed 100")
        
        outfits = await supabase_service.get_recent_outfits(user_id, limit)
        return {"outfits": outfits, "count": len(outfits)}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting recent outfits: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get recent outfits: {str(e)}")

@app.delete("/outfit/{outfit_id}")
async def delete_outfit_endpoint(outfit_id: str):
    """
    Delete an outfit by ID.
    """
    try:
        success = await supabase_service.delete_outfit(outfit_id)
        if not success:
            raise HTTPException(status_code=404, detail="Outfit not found")
        
        return {"message": "Outfit deleted successfully", "id": outfit_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting outfit {outfit_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete outfit: {str(e)}")

@app.delete("/item/{item_id}")
async def delete_item_endpoint(item_id: str):
    """
    Delete a clothing item by ID.
    """
    try:
        success = await supabase_service.delete_item(item_id)
        if not success:
            raise HTTPException(status_code=404, detail="Item not found")
        
        return {"message": "Item deleted successfully", "id": item_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting item {item_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete item: {str(e)}")

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"}
    )

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )