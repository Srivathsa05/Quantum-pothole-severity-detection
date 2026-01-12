import torch
from torchvision import models
from ml.config import DEVICE

def load_feature_extractor():
    resnet = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    model = torch.nn.Sequential(*list(resnet.children())[:-1])
    model.to(DEVICE)
    model.eval()
    return model

@torch.no_grad()
def extract_features(model, x):
    feats = model(x)
    return feats.view(feats.size(0), -1)
