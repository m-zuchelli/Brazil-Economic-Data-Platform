export type Indicator = "selic" | "ipca" | "usd_brl" | string

export interface IndicatorItem {
  date: string
  indicator: string
  value: number
  source: string
}

export interface LatestItem {
  indicator: string
  date: string
  value: number
  source: string
}

export interface SeriesResponse {
  indicator: string
  start: string
  end: string
  data: IndicatorItem[]
}

export interface StatsResponse {
  indicator: string
  start: string
  end: string
  min: number
  max: number
  avg: number
  pct_change: number | null
}
