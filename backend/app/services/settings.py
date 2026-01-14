from dataclasses import dataclass
from pathlib import Path
import os


@dataclass(frozen=True)
class Settings:
    data_path: Path
    db_path: Path


def get_settings() -> Settings:
    base_dir = Path(__file__).resolve().parents[3]
    default_data = base_dir / "data" / "indicators.csv"
    default_db = Path(__file__).resolve().parents[1] / "db" / "app.db"
    data_path = Path(os.getenv("DATA_PATH", default_data))
    db_path = Path(os.getenv("DB_PATH", default_db))
    return Settings(data_path=data_path, db_path=db_path)
