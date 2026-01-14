import { useEffect, useMemo, useState } from "react"
import { useIndicators } from "../hooks/useIndicators"
import { useLatest } from "../hooks/useLatest"
import { useSeries } from "../hooks/useSeries"
import StatCard from "../components/StatCard"
import Selector from "../components/Selector"
import DateRange from "../components/DateRange"
import SeriesChart from "../components/SeriesChart"
import DataTable from "../components/DataTable"
import StatsSummary from "../components/StatsSummary"
import { toChartData } from "../services/api"

export default function Dashboard() {
  const indicatorsState = useIndicators()
  const latestState = useLatest()
  const [selected, setSelected] = useState("selic")
  const [start, setStart] = useState("2019-01-01")
  const [end, setEnd] = useState("2023-12-01")

  useEffect(() => {
    if (indicatorsState.data.length && !indicatorsState.data.includes(selected)) {
      setSelected(indicatorsState.data[0])
    }
  }, [indicatorsState.data, selected])

  const seriesState = useSeries(selected, start, end)

  const chartData = useMemo(() => toChartData(seriesState.data), [seriesState.data])

  const content = () => {
    if (seriesState.loading) {
      return <div className="rounded-lg border border-slate-200 bg-white p-6">Carregando...</div>
    }
    if (seriesState.error) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
          {seriesState.error}
        </div>
      )
    }
    if (!seriesState.data.length) {
      return (
        <div className="rounded-lg border border-slate-200 bg-white p-6">Sem dados</div>
      )
    }
    return (
      <div className="space-y-6">
        <StatsSummary stats={seriesState.stats} />
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <SeriesChart data={chartData} />
        </div>
        <DataTable data={seriesState.data} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Economic Indicators Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Monitoramento de séries históricas com dados locais e pipeline ETL.
          </p>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        <section className="grid gap-4 sm:grid-cols-3">
          {latestState.loading && (
            <div className="col-span-full rounded-lg border border-slate-200 bg-white p-6">
              Carregando indicadores...
            </div>
          )}
          {latestState.error && (
            <div className="col-span-full rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
              {latestState.error}
            </div>
          )}
          {!latestState.loading && !latestState.error &&
            latestState.data.map((item) => (
              <StatCard
                key={item.indicator}
                title={item.indicator}
                value={item.value.toFixed(2)}
                subtitle={`Atualizado em ${item.date}`}
              />
            ))}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Selector
              label="Indicador"
              value={selected}
              options={indicatorsState.data.length ? indicatorsState.data : [selected]}
              onChange={setSelected}
            />
            <DateRange start={start} end={end} onStartChange={setStart} onEndChange={setEnd} />
          </div>
        </section>

        <section>{content()}</section>
      </main>
    </div>
  )
}
