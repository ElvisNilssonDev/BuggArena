import { cx } from '../../utils/cx'
import type { Difficulty } from '../../constants'

interface BadgeProps {
  children: React.ReactNode
  variant?: Difficulty | 'primary' | 'secondary' | 'neutral'
  className?: string
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span className={cx('badge', `badge-${variant}`, className)}>
      {children}
    </span>
  )
}
