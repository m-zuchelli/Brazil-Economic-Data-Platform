import { useEffect, useState } from "react"
import { fetchSeries, fetchStats } from "../services/api"
import { IndicatorItem, StatsResponse } from "../types"

export function useSeries(indicator: string, start: string, end: string) {
  const [data, setData] = useState<IndicatorItem[]>([])
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    Promise.all([fetchSeries(indicator, start, end), fetchStats(indicator, start, end)])
      .then(([series, statsData]) => {
        if (active) {
          setData(series.data)
          setStats(statsData)
        }
      })
      .catch((err: Error) => {
        if (active) {
          setError(err.message)
          setData([])
          setStats(null)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [indicator, start, end])

  return { data, stats, loading, error }
}
