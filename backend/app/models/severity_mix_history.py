from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SeverityMixHistory(Base):
    """Model for storing aggregated severity mix data over time for trend analysis."""
    
    __tablename__ = "severity_mix_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    timestamp: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)
    severe_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    minor_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    no_pothole_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    total_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    severe_percentage: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    minor_percentage: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    no_pothole_percentage: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    time_window: Mapped[str] = mapped_column(String(50), nullable=False)  # 'hourly', 'daily', 'weekly', 'monthly'
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)

    def __repr__(self):
        return f"<SeverityMixHistory(id={self.id}, timestamp={self.timestamp}, time_window={self.time_window})>"
