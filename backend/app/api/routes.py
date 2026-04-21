import os

import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException



from app.api.schemas import PredictionResponse

from app.api import data_routes, gamify_routes, ws_routes_optimized as ws_routes

from ml.inference.predictor import predict_image

from app.db.session import SessionLocal

from app.utils.db_helpers import save_detection_with_mix



router = APIRouter()



# Mount feature/data/gamification routes so main app picks them up once.

router.include_router(data_routes.router, tags=["data"])

router.include_router(gamify_routes.router, tags=["gamify"])

router.include_router(ws_routes.router, tags=["stream"])



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



        # ---------- Step 4: Save to database ----------

        db = SessionLocal()

        try:

            save_detection_with_mix(
                db=db,
                location="Uploaded Segment",
                severity=result["class"],
                confidence=result["confidence"],
                detection_type="uploaded",
                all_probabilities=result.get("all_probabilities"),
            )
        except Exception as db_error:
            # Log database error but don't fail the prediction
            print(f"Database save failed: {db_error}")
        finally:
            db.close()



        # ---------- Step 5: Return structured response ----------

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

