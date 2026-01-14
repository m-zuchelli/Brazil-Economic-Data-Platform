import { StatsResponse } from "../types"

interface StatsSummaryProps {
  stats: StatsResponse | null
}

export default function StatsSummary({ stats }: StatsSummaryProps) {
  if (!stats) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
        Estatísticas indisponíveis
      </div>
    )
  }

  return (
    <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 sm:grid-cols-4">
      <div>
        <p className="text-slate-400">Mínimo</p>
        <p className="text-lg font-semibold text-slate-900">{stats.min.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-slate-400">Máximo</p>
        <p className="text-lg font-semibold text-slate-900">{stats.max.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-slate-400">Média</p>
        <p className="text-lg font-semibold text-slate-900">{stats.avg.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-slate-400">Variação</p>
        <p className="text-lg font-semibold text-slate-900">
          {stats.pct_change === null ? "-" : `${stats.pct_change.toFixed(2)}%`}
        </p>
      </div>
    </div>
  )
}
