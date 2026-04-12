from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.routes import router as api_router

app = FastAPI(
    title="Quantum Pothole Severity Detection API",
    description="Real-time pothole severity prediction using a hybrid CNN–QNN model",
    version="1.0.0"
)

app.include_router(api_router)

# Allow requests from local frontends (Vite dev + preview + prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:4173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
