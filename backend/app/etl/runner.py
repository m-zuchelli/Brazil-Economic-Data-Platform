import csv
from datetime import date
from typing import Iterable

from pydantic import BaseModel, ValidationError

from app.db.connection import get_connection
from app.services.settings import Settings


class IndicatorRow(BaseModel):
    date: date
    indicator: str
    value: float
    source: str


def load_rows(path) -> Iterable[IndicatorRow]:
    with path.open() as f:
        reader = csv.DictReader(f)
        for row in reader:
            yield IndicatorRow(**row)


def run_etl(settings: Settings) -> dict:
    if not settings.data_path.exists():
        raise FileNotFoundError(str(settings.data_path))
    rows = []
    indicators = set()
    for row in load_rows(settings.data_path):
        indicators.add(row.indicator)
        rows.append(row)
    with get_connection(settings) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS indicators (
                date TEXT NOT NULL,
                indicator TEXT NOT NULL,
                value REAL NOT NULL,
                source TEXT NOT NULL
            )
            """
        )
        conn.execute("DELETE FROM indicators")
        conn.executemany(
            "INSERT INTO indicators (date, indicator, value, source) VALUES (?, ?, ?, ?)",
            [(r.date.isoformat(), r.indicator, r.value, r.source) for r in rows],
        )
    return {"rows_inserted": len(rows), "indicators": sorted(indicators)}


def safe_run_etl(settings: Settings) -> dict:
    try:
        return run_etl(settings)
    except ValidationError as exc:
        return {"error": str(exc)}
