from sqlalchemy import DateTime, Float, Integer, String, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.sqltypes import Text

from app.db.base import Base


class DetectionHistory(Base):
    """Model for storing all pothole detections with location and severity information."""
    
    __tablename__ = "detection_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    severity: Mapped[str] = mapped_column(String(50), nullable=False)  # 'no_pothole', 'minor', 'severe'
    confidence: Mapped[float] = mapped_column(Float, nullable=False)  # 0.00 to 1.00
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    timestamp: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)
    detection_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 'live', 'uploaded', 'batch'
    camera_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    all_probabilities: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)

    def __repr__(self):
        return f"<DetectionHistory(id={self.id}, location={self.location}, severity={self.severity}, timestamp={self.timestamp})>"
