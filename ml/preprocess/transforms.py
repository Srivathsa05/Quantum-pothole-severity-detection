import joblib
import numpy as np
import os

def load_preprocessors():
    # Get absolute path to artifacts
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    artifact_dir = os.path.join(project_root, "ml", "artifacts")
    
    pca = joblib.load(f"{artifact_dir}/pca.joblib")
    scaler = joblib.load(f"{artifact_dir}/scaler.joblib")
    return pca, scaler

def preprocess_embedding(embedding, pca, scaler):
    z = pca.transform(embedding)
    z = scaler.transform(z)
    z = (z - z.min()) / (z.max() - z.min()) * np.pi
    return z
