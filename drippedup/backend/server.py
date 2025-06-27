from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import io
from typing import Dict, List
import logging
from classification import ClothingClassifier
from PIL import Image
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Clothing Classification API",
    description="API for classifying clothing items using deep learning",
    version="1.0.0"
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the classifier globally
classifier = None

@app.on_event("startup")
async def startup_event():
    """Initialize the classifier when the server starts."""
    global classifier
    try:
        classifier = ClothingClassifier()
        logger.info("Classifier initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize classifier: {e}")
        raise

@app.get("/")
async def root():
    """Root endpoint to check if the server is running."""
    return {"message": "Clothing Classification API is running!"}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    global classifier
    if classifier is None:
        raise HTTPException(status_code=503, detail="Classifier not initialized")
    
    return {
        "status": "healthy",
        "classifier_ready": classifier is not None,
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