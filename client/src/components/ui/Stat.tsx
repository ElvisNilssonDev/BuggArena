import { cx } from '../../utils/cx'

interface StatProps {
  value: string | number
  label: string
  accent?: string
  className?: string
}

export function Stat({ value, label, accent, className }: StatProps) {
  return (
    <div className={cx('stat', className)}>
      <span className="stat-value" style={accent ? { color: accent } : undefined}>
        {value}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
