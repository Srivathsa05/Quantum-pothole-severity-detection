from sqlalchemy import Float, SmallInteger, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.sqltypes import DateTime

from app.db.base import Base


class PotholeLog(Base):
    __tablename__ = "pothole_log"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    image_path: Mapped[str | None] = mapped_column(Text, nullable=True)
    lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    lon: Mapped[float | None] = mapped_column(Float, nullable=True)
    class_id: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    ts: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)
