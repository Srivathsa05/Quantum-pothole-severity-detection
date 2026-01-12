import joblib
import numpy as np

ARTIFACT_DIR = "ml/artifacts"

def load_preprocessors():
    pca = joblib.load(f"{ARTIFACT_DIR}/pca.joblib")
    scaler = joblib.load(f"{ARTIFACT_DIR}/scaler.joblib")
    return pca, scaler

def preprocess_embedding(embedding, pca, scaler):
    z = pca.transform(embedding)
    z = scaler.transform(z)
    z = (z - z.min()) / (z.max() - z.min()) * np.pi
    return z
