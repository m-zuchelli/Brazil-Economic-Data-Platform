import { useMemo, useState } from "react"
import { IndicatorItem } from "../types"

interface DataTableProps {
  data: IndicatorItem[]
  pageSize?: number
}

export default function DataTable({ data, pageSize = 12 }: DataTableProps) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize])

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Indicador</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Fonte</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item) => (
              <tr key={`${item.indicator}-${item.date}`} className="border-t border-slate-200">
                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3">{item.indicator}</td>
                <td className="px-4 py-3">{item.value.toFixed(2)}</td>
                <td className="px-4 py-3">{item.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-600">
        <span>
          Página {page} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            className="rounded-md border border-slate-200 px-3 py-1 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Anterior
          </button>
          <button
            className="rounded-md border border-slate-200 px-3 py-1 disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  )
}
