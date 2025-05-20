import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Dropout, Flatten
from tensorflow.keras.applications import Xception
from tensorflow.keras.preprocessing import image
import os
from dotenv import load_dotenv

load_dotenv()
MODEL_WEIGHTS_PATH = os.getenv('MODEL_WEIGHTS_PATH')

def create_architecture(image_size=224):
    """
    Creates and returns the Xception-based neural network architecture.
    
    Args:
        image_size (int): Size of the input images (square).
        
    Returns:
        Model: The compiled Keras model.
    """
    # Build the model architecture
    base_model = Xception(
        weights=None,
        include_top=False,
        input_shape=(image_size, image_size, 3)
    )

    inputs = Input(shape=(image_size, image_size, 3))
    base = base_model(inputs, training=False)

    # Flatten the output layer to 1 dimension
    x = Flatten()(base)

    # Add a fully connected layer with 1,024 hidden units and ReLU activation
    x = Dense(1024, activation='relu', kernel_initializer='he_uniform', kernel_regularizer=tf.keras.regularizers.l2())(x)        

    # Add a dropout rate 
    x = Dropout(0.2)(x)

    # Add a final sigmoid layer for classification
    x = Dense(19, activation='sigmoid')(x)           

    # Append the dense network to the base model
    model = Model(inputs, x)
    
    # Compile the model
    model.compile(optimizer='adamax', loss='categorical_crossentropy', metrics=['accuracy'])
    
    return model

def load_weights(model, weights_path):
    """
    Loads weights into the model from the specified path.
    
    Args:
        model: The Keras model to load weights into.
        weights_path (str): Path to the weights file.
        
    Returns:
        bool: True if weights were loaded successfully, False otherwise.
    """
    try:
        model.load_weights(weights_path)
        print("Weights loaded successfully!")
        model.summary()
        return True
    except Exception as e:
        print(f"Error loading weights: {e}")
        return False
    

def process_image(img_path, model, image_size=224):
    """
    Processes an image and returns predictions from the model.
    
    Args:
        img_path (str): Path to the image file.
        model: The Keras model to use for prediction.
        image_size (int): Size of the input images (square).
        
    Returns:
        dict: Dictionary containing prediction results with class names and confidence scores.
    """
    class_labels = ['Blazer', 'Blouse', 'Body', 'Dress', 'Hat', 'Hoodie', 'Longsleeve', 
                    'Not sure', 'Other', 'Outwear', 'Pants', 'Polo', 'Shirt', 'Shoes', 
                    'Shorts', 'Skirt', 'T-Shirt', 'Top', 'Undershirt']
    
    # Preprocess the image
    img = image.load_img(img_path, target_size=(image_size, image_size))
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    
    # Get prediction
    prediction = model.predict(img_array)
    
    # Get the class with highest probability
    predicted_class_idx = np.argmax(prediction, axis=1)[0]
    predicted_class_name = class_labels[predicted_class_idx]
    
    # Get confidence score
    confidence = float(prediction[0][predicted_class_idx] * 100)
    
    # Get top 3 predictions
    top_indices = np.argsort(prediction[0])[-3:][::-1]
    top_predictions = []
    
    for i, idx in enumerate(top_indices):
        top_predictions.append({
            "rank": i+1,
            "class_name": class_labels[idx],
            "confidence": float(prediction[0][idx] * 100)
        })
    
    # Return results as a dictionary
    results = {
        "predicted_class_index": int(predicted_class_idx),
        "predicted_class_name": predicted_class_name,
        "confidence": confidence,
        "top_predictions": top_predictions
    }
    
    return results


def main():
    # Create the model architecture
    model = create_architecture()
    
    # Load weights
    weights_loaded = load_weights(model, MODEL_WEIGHTS_PATH)
    
    if weights_loaded:
        # Process an image and get predictions
        results = process_image('drippedup/backend/shirt.webp', model)
        
        # Print the results
        print(f"Predicted class: {results['predicted_class_name']}")
        print(f"Confidence: {results['confidence']:.2f}%")
        
        print("\nTop 3 predictions:")
        for pred in results['top_predictions']:
            print(f"{pred['rank']}. {pred['class_name']}: {pred['confidence']:.2f}%")

if __name__ == "__main__":
    main()