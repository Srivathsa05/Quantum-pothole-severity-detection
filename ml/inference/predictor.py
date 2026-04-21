import torch
import numpy as np
from PIL import Image
from torchvision import transforms
import logging
import os

from ml.config import DEVICE, CLASS_NAMES
from ml.models.qnn_model import HybridModel

logger = logging.getLogger(__name__)

# Load model once
model = HybridModel()
# Get absolute path to project root
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_dir))
model_path = os.path.join(project_root, "ml", "artifacts", "best_model.pth")
checkpoint = torch.load(model_path, map_location=DEVICE)

# Handle different checkpoint formats
if "state_dict" in checkpoint:
    state_dict = checkpoint["state_dict"]
else:
    state_dict = checkpoint

# Log model architecture and checkpoint info
logger.info(f"Model architecture: {model}")
logger.info(f"Checkpoint keys: {list(checkpoint.keys())}")
logger.info(f"State dict keys: {list(state_dict.keys())[:5]}... (showing first 5)")
logger.info(f"Model state dict keys: {list(model.state_dict().keys())[:5]}... (showing first 5)")

# Load state dict
model.load_state_dict(state_dict)
model.to(DEVICE)
model.eval()

# Verify model is working by running a dummy forward pass
dummy_input = torch.randn(1, 3, 224, 224).to(DEVICE)
with torch.no_grad():
    dummy_output = model(dummy_input)
logger.info(f"Dummy forward pass output: {dummy_output}")
logger.info(f"Model loaded successfully and ready for inference")

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )
])

@torch.no_grad()
def predict_image(image_path: str, debug: bool = False):
    img = Image.open(image_path).convert("RGB")
    x = transform(img).unsqueeze(0).to(DEVICE)

    logits = model(x)
    probs = torch.softmax(logits, dim=1).cpu().numpy()[0]

    pred = int(np.argmax(probs))

    if debug or probs[pred] > 0.95:
        logger.info(f"Predictions for {image_path}:")
        for i, (name, p) in enumerate(zip(CLASS_NAMES, probs)):
            marker = " <-- SELECTED" if i == pred else ""
            logger.info(f"  {name}: {p:.4f}{marker}")
        logger.info(f"Raw logits: {logits.cpu().numpy()[0]}")

    return {
        "class": CLASS_NAMES[pred],
        "confidence": float(probs[pred]),
        "all_probabilities": {name: float(p) for name, p in zip(CLASS_NAMES, probs)},
        "raw_logits": logits.cpu().numpy()[0].tolist()
    }