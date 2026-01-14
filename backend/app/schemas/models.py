from datetime import date

from pydantic import BaseModel


class IndicatorItem(BaseModel):
    date: date
    indicator: str
    value: float
    source: str


class IndicatorsResponse(BaseModel):
    indicators: list[str]


class SeriesResponse(BaseModel):
    indicator: str
    start: date
    end: date
    data: list[IndicatorItem]


class StatsResponse(BaseModel):
    indicator: str
    start: date
    end: date
    min: float
    max: float
    avg: float
    pct_change: float | None


class LatestItem(BaseModel):
    indicator: str
    date: date
    value: float
    source: str


class LatestResponse(BaseModel):
    data: list[LatestItem]
