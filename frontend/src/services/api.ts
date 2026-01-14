import { IndicatorItem, LatestItem, SeriesResponse, StatsResponse } from "../types"

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || "Erro na requisição")
  }
  return response.json() as Promise<T>
}

export async function fetchIndicators(): Promise<string[]> {
  const response = await fetch(`${baseUrl}/indicators`)
  const data = await handleResponse<{ indicators: string[] }>(response)
  return data.indicators
}

export async function fetchLatest(): Promise<LatestItem[]> {
  const response = await fetch(`${baseUrl}/latest`)
  const data = await handleResponse<{ data: LatestItem[] }>(response)
  return data.data
}

export async function fetchSeries(
  indicator: string,
  start: string,
  end: string
): Promise<SeriesResponse> {
  const params = new URLSearchParams({ indicator, start, end })
  const response = await fetch(`${baseUrl}/series?${params.toString()}`)
  return handleResponse<SeriesResponse>(response)
}

export async function fetchStats(
  indicator: string,
  start: string,
  end: string
): Promise<StatsResponse> {
  const params = new URLSearchParams({ indicator, start, end })
  const response = await fetch(`${baseUrl}/stats?${params.toString()}`)
  return handleResponse<StatsResponse>(response)
}

export function toChartData(items: IndicatorItem[]): Array<{ date: string; value: number }> {
  return items.map((item) => ({ date: item.date, value: item.value }))
}
