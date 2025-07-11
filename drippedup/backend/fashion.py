import os
import logging
from dotenv import load_dotenv
from typing import Dict, Optional
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
import numpy as np

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
        self.model_weights_path = model_path or os.getenv('FASHION_MODEL_WEIGHTS_PATH')
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

    def preprocess_image(self, img: Image.Image) -> torch.Tensor:
        return self.transform(img).unsqueeze(0).to(self.device)

    def predict(self, img1: np.ndarray, img2: np.ndarray) -> Dict:
        """
        Make compatibility prediction for two images.
        Args:
            img1 (np.ndarray): First image as numpy array (HWC, RGB)
            img2 (np.ndarray): Second image as numpy array (HWC, RGB)
        Returns:
            dict: Compatibility score and embeddings
        """
        if self.model is None:
            raise ValueError("Model not initialized")
        try:
            pil_img1 = Image.fromarray(img1.astype('uint8'), 'RGB')
            pil_img2 = Image.fromarray(img2.astype('uint8'), 'RGB')
            tensor1 = self.preprocess_image(pil_img1)
            tensor2 = self.preprocess_image(pil_img2)
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
# if __name__ == "__main__":
#     tester = FashionCompatibilityTester(model_path="fashion_model.pth")
#     # img1 = ... # Load as numpy array
#     # img2 = ... # Load as numpy array
#     # result = tester.predict(img1, img2)
#     # print(result) 