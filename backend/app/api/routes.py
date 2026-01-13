import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException

from backend.app.api.schemas import PredictionResponse
from ml.inference.predictor import predict_image

router = APIRouter()

TEMP_DIR = "backend/temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)


@router.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    # ---------- Step 1: Validate input ----------
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    # ---------- Step 2: Save temporarily ----------
    filename = f"{uuid.uuid4()}.jpg"
    file_path = os.path.join(TEMP_DIR, filename)

    try:
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # ---------- Step 3: ML inference ----------
        result = predict_image(file_path)

        # ---------- Step 4: Return structured response ----------
        return PredictionResponse(
            class_name=result["class"],
            confidence=result["confidence"]
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"ML inference failed: {str(e)}"
        )

    finally:
        # ---------- Step 5: Cleanup ----------
        if os.path.exists(file_path):
            os.remove(file_path)
