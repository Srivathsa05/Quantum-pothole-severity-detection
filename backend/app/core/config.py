import os
from dataclasses import dataclass

import yaml


@dataclass(frozen=True)
class Settings:
    database_url: str
    features_file: str


def load_features(path: str) -> dict:
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}
            if not isinstance(data, dict):
                return {}
            return data
    except FileNotFoundError:
        return {}


def get_settings() -> Settings:
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    default_sqlite_path = os.path.join(project_root, "..", "pothole.db")
    default_sqlite_url = f"sqlite:///{os.path.abspath(default_sqlite_path)}"

    database_url = os.getenv("DATABASE_URL", default_sqlite_url)
    features_file = os.getenv(
        "FEATURES_FILE",
        os.path.join(project_root, "..", "features.yaml"),
    )

    return Settings(database_url=database_url, features_file=features_file)
