import torch
import numpy as np
from PIL import Image
from torchvision import transforms

from ml.config import DEVICE, CLASS_NAMES
from ml.models.feature_extractor import load_feature_extractor, extract_features
from ml.models.qnn_model import load_qnn_model
from ml.preprocess.transforms import load_preprocessors, preprocess_embedding

# Load once (important for API performance)
feature_extractor = load_feature_extractor()
qnn_model = load_qnn_model()
pca, scaler = load_preprocessors()

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )
])

@torch.no_grad()
def predict_image(image_path: str):
    img = Image.open(image_path).convert("RGB")
    x = transform(img).unsqueeze(0).to(DEVICE)

    emb = extract_features(feature_extractor, x).cpu().numpy()
    z = preprocess_embedding(emb, pca, scaler)

    z_t = torch.tensor(z, dtype=torch.float32).to(DEVICE)
    logits = qnn_model(z_t)
    probs = torch.softmax(logits, dim=1).cpu().numpy()[0]

    pred = int(np.argmax(probs))
    return {
        "class": CLASS_NAMES[pred],
        "confidence": float(probs[pred])
    }
