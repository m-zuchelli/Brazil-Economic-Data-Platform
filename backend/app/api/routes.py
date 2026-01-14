from datetime import date
from fastapi import APIRouter, HTTPException, Query
from app.schemas.models import IndicatorsResponse, SeriesResponse, StatsResponse, LatestResponse
from app.services.settings import get_settings
from app.services.queries import list_indicators, get_series, get_stats, get_latest
from app.etl.runner import run_etl

router = APIRouter()


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
    indicator: str = Query(...),
    start: date = Query(...),
    end: date = Query(...),
):
    settings = get_settings()
    data = get_series(settings, indicator, start, end)
    if not data:
        raise HTTPException(status_code=404, detail="No data found")
    return {"indicator": indicator, "start": start, "end": end, "data": data}


@router.get("/stats", response_model=StatsResponse)
def stats(
    indicator: str = Query(...),
    start: date = Query(...),
    end: date = Query(...),
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
