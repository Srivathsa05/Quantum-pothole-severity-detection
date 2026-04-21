from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.sqltypes import Date

from app.db.base import Base


class MaintenanceSchedule(Base):
    """Model for storing scheduled maintenance based on severity trends."""
    
    __tablename__ = "maintenance_schedules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    road_segment_id: Mapped[int] = mapped_column(Integer, nullable=False)
    scheduled_date: Mapped[object] = mapped_column(Date, nullable=False)
    priority: Mapped[str] = mapped_column(String(50), nullable=False)  # 'low', 'medium', 'high', 'urgent'
    status: Mapped[str] = mapped_column(String(50), nullable=False, default='pending')  # 'pending', 'in_progress', 'completed', 'cancelled'
    estimated_duration_hours: Mapped[float | None] = mapped_column(Float, nullable=True)
    estimated_cost: Mapped[float | None] = mapped_column(Float, nullable=True)
    assigned_team: Mapped[str | None] = mapped_column(String(255), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)
    completed_date: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<MaintenanceSchedule(id={self.id}, road_segment_id={self.road_segment_id}, scheduled_date={self.scheduled_date}, priority={self.priority})>"
