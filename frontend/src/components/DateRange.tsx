interface DateRangeProps {
  start: string
  end: string
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
}

export default function DateRange({ start, end, onStartChange, onEndChange }: DateRangeProps) {
  return (
    <div className="flex flex-col gap-2 text-sm text-slate-600">
      <span>Período</span>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="date"
          value={start}
          onChange={(event) => onStartChange(event.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900"
        />
        <input
          type="date"
          value={end}
          onChange={(event) => onEndChange(event.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900"
        />
      </div>
    </div>
  )
}
