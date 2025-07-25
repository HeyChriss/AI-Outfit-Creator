import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Dropout, Flatten
from tensorflow.keras.applications import Xception
from tensorflow.keras.preprocessing import image
import os
from dotenv import load_dotenv
from typing import Dict, List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ClothingClassifier:
    """
    A class to handle clothing classification using a pre-trained Xception-based model.
    """
    
    def __init__(self, image_size: int = 224):
        """
        Initialize the ClothingClassifier.
        
        Args:
            image_size (int): Size of the input images (square).
        """
        load_dotenv()
        
        self.image_size = image_size
        self.model_weights_path = "C:/Users/bansb/OneDrive/Desktop/DS460/AI-Outfit-Creator/drippedup/backend/small.keras"
        self.model = None
        self.class_labels = [
            'Blazer', 'Blouse', 'Body', 'Dress', 'Hat', 'Hoodie', 'Longsleeve', 
            'Not sure', 'Other', 'Outwear', 'Pants', 'Polo', 'Shirt', 'Shoes', 
            'Shorts', 'Skirt', 'T-Shirt', 'Top', 'Undershirt'
        ]
        
        # Initialize the model
        self._initialize_model()
    
    def _create_architecture(self) -> Model:
        """
        Creates and returns the Xception-based neural network architecture.
        
        Returns:
            Model: The compiled Keras model.
        """
        try:
            # Build the model architecture
            base_model = Xception(
                weights=None,
                include_top=False,
                input_shape=(self.image_size, self.image_size, 3)
            )

            inputs = Input(shape=(self.image_size, self.image_size, 3))
            base = base_model(inputs, training=False)

            # Flatten the output layer to 1 dimension
            x = Flatten()(base)

            x = Dense(256, activation='relu')(x)
            x = Dropout(0.1)(x)

            x = Dense(64, activation='relu')(x)
            x = Dropout(0.1)(x)  

            x = Dense(len(self.class_labels), activation='softmax')(x)         

            # Append the dense network to the base model
            model = Model(inputs, x)
            
            # Compile the model
            model.compile(
                optimizer='adamax', 
                loss='categorical_crossentropy', 
                metrics=['accuracy']
            )
            
            logger.info("Model architecture created successfully")
            return model
            
        except Exception as e:
            logger.error(f"Error creating model architecture: {e}")
            raise
    
    def _load_weights(self, model: Model) -> bool:
        """
        Loads weights into the model from the specified path.
        
        Args:
            model: The Keras model to load weights into.
            
        Returns:
            bool: True if weights were loaded successfully, False otherwise.
        """
        if not self.model_weights_path:
            logger.error("No model weights path specified in environment variables")
            return False
            
        try:
            model.load_weights(self.model_weights_path)
            logger.info("Model weights loaded successfully!")
            return True
        except Exception as e:
            logger.error(f"Error loading weights: {e}")
            return False
    
    def _initialize_model(self) -> None:
        """
        Initialize the model by creating architecture and loading weights.
        """
        try:
            self.model = self._create_architecture()
            weights_loaded = self._load_weights(self.model)
            
            if weights_loaded:
                logger.info("Model initialized successfully with weights")
            else:
                raise RuntimeError("Failed to load model weights - model cannot be used")
                
        except Exception as e:
            logger.error(f"Error initializing model: {e}")
            raise
    
    def predict(self, img_array: np.ndarray) -> Dict:
        """
        Make predictions on an image.
        
        Args:
            img_path (str): Path to the image file.
            
        Returns:
            dict: Dictionary containing the top prediction result.
        """
        if self.model is None:
            raise ValueError("Model not initialized")
        
        try:
            
            # Get prediction
            prediction = self.model.predict(img_array, verbose=0)
            
            # Get the class with highest probability
            predicted_class_idx = np.argmax(prediction, axis=1)[0]
            predicted_class_name = self.class_labels[predicted_class_idx]
            
            # Get confidence score
            confidence = float(prediction[0][predicted_class_idx] * 100)
            
            # Return only the top prediction
            results = {
                "predicted_class_index": int(predicted_class_idx),
                "predicted_class_name": predicted_class_name,
                "confidence": confidence
            }
            
            return results
            
        except Exception as e:
            logger.error(f"Error making prediction on {img_array}: {e}")
            raise
    
    def get_model_info(self) -> Dict:
        """
        Get information about the model.
        
        Returns:
            dict: Model information including architecture and class labels.
        """
        if self.model is None:
            return {"error": "Model not initialized"}
        
        return {
            "model_type": "Xception-based",
            "input_shape": (self.image_size, self.image_size, 3),
            "num_classes": len(self.class_labels),
            "class_labels": self.class_labels,
            "weights_loaded": self.model_weights_path is not None
        }



# Example usage and testing
#if __name__ == "__main__":
#    # Initialize the classifier
#    classifier = ClothingClassifier()
#    
#    # Test prediction
#    try:
#        results = classifier.predict('pants.jpg')
#        
#        print(f"Predicted class: {results['predicted_class_name']}")
#        print(f"Confidence: {results['confidence']:.2f}%")
#        
#    except Exception as e:
#        print(f"Error during testing: {e}") 