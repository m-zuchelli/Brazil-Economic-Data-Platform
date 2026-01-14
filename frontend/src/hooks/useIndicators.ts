import { useEffect, useState } from "react"
import { fetchIndicators } from "../services/api"

export function useIndicators() {
  const [data, setData] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetchIndicators()
      .then((items) => {
        if (active) {
          setData(items)
        }
      })
      .catch((err: Error) => {
        if (active) {
          setError(err.message)
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
  }, [])

  return { data, loading, error }
}
