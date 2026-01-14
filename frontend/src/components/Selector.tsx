interface SelectorProps {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

export default function Selector({ label, value, options, onChange }: SelectorProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-600">
      {label}
      <select
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
