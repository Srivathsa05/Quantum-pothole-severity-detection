from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings


def get_engine():
    settings = get_settings()
    url = settings.database_url or ""

    if url.startswith("sqlite") or url == "":
        if not url:
            url = "sqlite:///pothole.db"
        return create_engine(url, connect_args={"check_same_thread": False})

    return create_engine(url)


engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
