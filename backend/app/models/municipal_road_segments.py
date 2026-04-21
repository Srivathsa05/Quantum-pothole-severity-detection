from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class MunicipalRoadSegment(Base):
    """Model for static municipal road management integration."""
    
    __tablename__ = "municipal_road_segments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    road_name: Mapped[str] = mapped_column(String(255), nullable=False)
    segment_name: Mapped[str] = mapped_column(String(255), nullable=False)
    start_latitude: Mapped[float] = mapped_column(Float, nullable=False)
    start_longitude: Mapped[float] = mapped_column(Float, nullable=False)
    end_latitude: Mapped[float] = mapped_column(Float, nullable=False)
    end_longitude: Mapped[float] = mapped_column(Float, nullable=False)
    road_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 'arterial', 'collector', 'local', 'highway'
    length_km: Mapped[float] = mapped_column(Float, nullable=False)
    municipality: Mapped[str] = mapped_column(String(100), nullable=False)
    ward: Mapped[str | None] = mapped_column(String(100), nullable=True)
    zone: Mapped[str | None] = mapped_column(String(100), nullable=True)
    responsible_department: Mapped[str | None] = mapped_column(String(255), nullable=True)
    contact_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    contact_phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    last_inspection_date: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_maintenance_date: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)

    def __repr__(self):
        return f"<MunicipalRoadSegment(id={self.id}, road_name={self.road_name}, segment_name={self.segment_name})>"
