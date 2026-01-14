from datetime import date

from fastapi import APIRouter, HTTPException, Query

from app.etl.runner import run_etl
from app.schemas.models import IndicatorsResponse, LatestResponse, SeriesResponse, StatsResponse
from app.services.queries import get_latest, get_series, get_stats, list_indicators
from app.services.settings import get_settings

router = APIRouter()
INDICATOR_QUERY = Query(...)
START_QUERY = Query(...)
END_QUERY = Query(...)


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/etl/run")
def etl_run():
    settings = get_settings()
    result = run_etl(settings)
    return result


@router.get("/indicators", response_model=IndicatorsResponse)
def indicators():
    settings = get_settings()
    return {"indicators": list_indicators(settings)}


@router.get("/series", response_model=SeriesResponse)
def series(
    indicator: str = INDICATOR_QUERY,
    start: date = START_QUERY,
    end: date = END_QUERY,
):
    settings = get_settings()
    data = get_series(settings, indicator, start, end)
    if not data:
        raise HTTPException(status_code=404, detail="No data found")
    return {"indicator": indicator, "start": start, "end": end, "data": data}


@router.get("/stats", response_model=StatsResponse)
def stats(
    indicator: str = INDICATOR_QUERY,
    start: date = START_QUERY,
    end: date = END_QUERY,
):
    settings = get_settings()
    stats_data = get_stats(settings, indicator, start, end)
    if stats_data is None:
        raise HTTPException(status_code=404, detail="No data found")
    return {"indicator": indicator, "start": start, "end": end, **stats_data}


@router.get("/latest", response_model=LatestResponse)
def latest():
    settings = get_settings()
    return {"data": get_latest(settings)}
