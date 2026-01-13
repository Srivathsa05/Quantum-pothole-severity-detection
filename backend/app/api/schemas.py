from pydantic import BaseModel, Field


class PredictionResponse(BaseModel):
    class_name: str = Field(
        ...,
        description="Predicted pothole severity class"
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Prediction confidence score"
    )
