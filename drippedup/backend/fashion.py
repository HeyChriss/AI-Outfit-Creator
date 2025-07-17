import os
import logging
from dotenv import load_dotenv
from typing import Dict, Optional, Union
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
import numpy as np
import cv2

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SiameseNetwork(nn.Module):
    """
    Improved Siamese Network with better architecture
    """
    def __init__(self, embedding_dim=128, dropout=0.3):
        super(SiameseNetwork, self).__init__()


        self.backbone = models.resnet50(pretrained=True)
        backbone_output_dim = 2048
        
        # Remove the final classification layer
        self.feature_extractor = nn.Sequential(*list(self.backbone.children())[:-1])

        # Freeze early layers
        for param in list(self.feature_extractor.parameters())[:20]:
            param.requires_grad = False

        # Embedding layers with batch norm
        self.embedding = nn.Sequential(
            nn.Flatten(),
            nn.Linear(backbone_output_dim, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout),
            nn.Linear(512, embedding_dim),
            nn.BatchNorm1d(embedding_dim)
        )

        # Compatibility classifier
        self.classifier = nn.Sequential(
            nn.Linear(embedding_dim * 2, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout),
            nn.Linear(256, 64),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout/2),
            nn.Linear(64, 1),
            nn.Sigmoid()
        )

    def forward_once(self, x):
        features = self.feature_extractor(x)
        embedding = self.embedding(features)
        embedding = F.normalize(embedding, p=2, dim=1)
        return embedding

    def forward(self, image1, image2):
        embedding1 = self.forward_once(image1)
        embedding2 = self.forward_once(image2)
        combined = torch.cat([embedding1, embedding2], dim=1)
        compatibility = self.classifier(combined)
        return compatibility, embedding1, embedding2

class FashionCompatibility:
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize the compatibility tester
        Args:
            model_path: Path to the saved model weights
        """
        load_dotenv()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model_weights_path = "C:/Users/bansb/OneDrive/Desktop/DS460/AI-Outfit-Creator/drippedup/backend/siamese_model_real.pth"
        if not self.model_weights_path:
            logger.error("No model weights path specified in environment variables or constructor.")
            raise ValueError("Model weights path must be specified.")

        self.model = SiameseNetwork(embedding_dim=128)
        self._load_weights()
        self.model.to(self.device)
        self.model.eval()

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        logger.info("Model loaded successfully!")

    def _load_weights(self):
        try:
            state_dict = torch.load(self.model_weights_path, map_location=self.device)
            self.model.load_state_dict(state_dict)
            logger.info("Model weights loaded successfully!")
        except Exception as e:
            logger.error(f"Error loading model weights: {e}")
            raise

    def load_image_from_path(self, image_path: str) -> torch.Tensor:
        """
        Load image from file path
        """
        try:
            image = Image.open(image_path).convert('RGB')
            image_tensor = self.transform(image).unsqueeze(0)
            return image_tensor.to(self.device)
        except Exception as e:
            logger.error(f"Error loading image {image_path}: {e}")
            return None

    def preprocess_image(self, img: Union[Image.Image, np.ndarray, str]) -> torch.Tensor:
        """
        this has to be done this way because the model expects a tensor. We cannot use the image directly. 
        or the other function with the other model.
        """
        if isinstance(img, str):
            # If it's a file path, load it directly
            return self.load_image_from_path(img)
        elif isinstance(img, np.ndarray):
            # Ensure the array is in the right format
            if img.dtype != np.uint8:
                # If it's in 0-1 range, convert to 0-255
                if img.max() <= 1.0:
                    img = (img * 255).astype(np.uint8)
                else:
                    img = img.astype(np.uint8)
            
            # Ensure it's RGB just in case 
            if len(img.shape) == 3 and img.shape[2] == 3:
                # Convert BGR to RGB if needed (common with OpenCV)
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            
            pil_img = Image.fromarray(img, 'RGB')
        elif isinstance(img, Image.Image):
            pil_img = img.convert('RGB')
        else:
            raise ValueError(f"Unsupported image type: {type(img)}")
        
        return self.transform(pil_img).unsqueeze(0).to(self.device)

    def predict_from_paths(self, img1_path: str, img2_path: str) -> Dict:
        """
        Predict compatibility from paths.
        """
        try:
            tensor1 = self.load_image_from_path(img1_path)
            tensor2 = self.load_image_from_path(img2_path)
            
            if tensor1 is None or tensor2 is None:
                raise ValueError("Failed to load one or both images")
            
            with torch.no_grad():
                compatibility, embedding1, embedding2 = self.model(tensor1, tensor2)
                score = float(compatibility.item())
                emb1 = embedding1.cpu().numpy().flatten().tolist()
                emb2 = embedding2.cpu().numpy().flatten().tolist()
            
            return {
                "compatibility_score": score,
                "embedding1": emb1,
                "embedding2": emb2
            }
        except Exception as e:
            logger.error(f"Error making prediction: {e}")
            raise

    def get_model_info(self) -> Dict:
        if self.model is None:
            return {"error": "Model not initialized"}
        return {
            "model_type": "Siamese ResNet-based",
            "input_shape": (224, 224, 3),
            "embedding_dim": 128,
            "weights_loaded": self.model_weights_path is not None
        }
    

# Example usage 
#if __name__ == "__main__":
 #   tester = FashionCompatibility()
    # img1 = ... # Load as numpy array
    # img2 = ... # Load as numpy array
    # result = tester.predict(img1, img2)
    # print(result) 