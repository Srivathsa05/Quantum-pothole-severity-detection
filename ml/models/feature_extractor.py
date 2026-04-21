import torch.nn as nn
from torchvision import models

class FeatureExtractor(nn.Module):
    def __init__(self):
        super().__init__()
        self.model = models.resnet50(weights="IMAGENET1K_V1")
        self.model.fc = nn.Identity()

    def forward(self, x):
        return self.model(x)