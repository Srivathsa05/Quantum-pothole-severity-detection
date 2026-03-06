from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.routes import router as api_router

app = FastAPI(
    title="Quantum Pothole Severity Detection API",
    description="Real-time pothole severity prediction using a hybrid CNN–QNN model",
    version="1.0.0"
)

app.include_router(api_router)

# Allow requests from the frontend (Vite default port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
