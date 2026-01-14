from datetime import date

from app.db.connection import get_connection
from app.services.settings import Settings


def list_indicators(settings: Settings) -> list[str]:
    with get_connection(settings) as conn:
        rows = conn.execute(
            "SELECT DISTINCT indicator FROM indicators ORDER BY indicator"
        ).fetchall()
    return [row[0] for row in rows]


def get_series(settings: Settings, indicator: str, start: date, end: date) -> list[dict]:
    with get_connection(settings) as conn:
        rows = conn.execute(
            """
            SELECT date, indicator, value, source
            FROM indicators
            WHERE indicator = ? AND date BETWEEN ? AND ?
            ORDER BY date ASC
            """,
            (indicator, start.isoformat(), end.isoformat()),
        ).fetchall()
    return [dict(row) for row in rows]


def get_stats(settings: Settings, indicator: str, start: date, end: date) -> dict | None:
    with get_connection(settings) as conn:
        agg = conn.execute(
            """
            SELECT MIN(value) as min, MAX(value) as max, AVG(value) as avg
            FROM indicators
            WHERE indicator = ? AND date BETWEEN ? AND ?
            """,
            (indicator, start.isoformat(), end.isoformat()),
        ).fetchone()
        if agg is None or agg[0] is None:
            return None
        first_row = conn.execute(
            """
            SELECT value FROM indicators
            WHERE indicator = ? AND date BETWEEN ? AND ?
            ORDER BY date ASC LIMIT 1
            """,
            (indicator, start.isoformat(), end.isoformat()),
        ).fetchone()
        last_row = conn.execute(
            """
            SELECT value FROM indicators
            WHERE indicator = ? AND date BETWEEN ? AND ?
            ORDER BY date DESC LIMIT 1
            """,
            (indicator, start.isoformat(), end.isoformat()),
        ).fetchone()
    first = first_row[0] if first_row else None
    last = last_row[0] if last_row else None
    pct_change = None
    if first is not None and first != 0 and last is not None:
        pct_change = (last - first) / first * 100
    return {
        "min": float(agg[0]),
        "max": float(agg[1]),
        "avg": float(agg[2]),
        "pct_change": pct_change,
    }


def get_latest(settings: Settings) -> list[dict]:
    with get_connection(settings) as conn:
        rows = conn.execute(
            """
            SELECT i.indicator, i.date, i.value, i.source
            FROM indicators i
            JOIN (
                SELECT indicator, MAX(date) as max_date
                FROM indicators
                GROUP BY indicator
            ) m
            ON i.indicator = m.indicator AND i.date = m.max_date
            ORDER BY i.indicator
            """
        ).fetchall()
    return [dict(row) for row in rows]
