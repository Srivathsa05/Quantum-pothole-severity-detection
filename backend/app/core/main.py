from fastapi import FastAPI
from backend.app.api.routes import router as api_router

app = FastAPI(
    title="Quantum Pothole Severity Detection API",
    description="Real-time pothole severity prediction using a hybrid CNN–QNN model",
    version="1.0.0"
)

app.include_router(api_router)
