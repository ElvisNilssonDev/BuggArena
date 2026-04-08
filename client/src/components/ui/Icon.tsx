// Inline SVG icon set — no external dependency needed

type IconName =
  | 'bug'
  | 'search'
  | 'chevron-up'
  | 'chevron-down'
  | 'trophy'
  | 'code'
  | 'user'
  | 'logout'
  | 'plus'
  | 'check'
  | 'star'
  | 'flame'
  | 'arrow-right'
  | 'menu'
  | 'x'
  | 'copy'

interface IconProps {
  name: IconName
  size?: number
  className?: string
  'aria-hidden'?: boolean
}

const PATHS: Record<IconName, string> = {
  bug: 'M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v1h-2v-1a1 1 0 0 0-1-1h-1v.17A4 4 0 0 1 16 13v3a4 4 0 0 1-8 0v-3a4 4 0 0 1 .04-.83H7a1 1 0 0 0-1 1v1H4v-1a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2zM4 11H2V9h2v2zm18 0h-2V9h2v2zM4 16H2v-2h2v2zm18 0h-2v-2h2v2z',
  search: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  'chevron-up': 'M18 15l-6-6-6 6',
  'chevron-down': 'M6 9l6 6 6-6',
  trophy: 'M8 21h8m-4-4v4M5 3H3v5a4 4 0 0 0 4 4h.5M19 3h2v5a4 4 0 0 1-4 4h-.5M7 3h10l-1 8a4 4 0 0 1-8 0L7 3z',
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9',
  plus: 'M12 5v14M5 12h14',
  check: 'M20 6L9 17l-5-5',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  flame: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  'arrow-right': 'M5 12h14m-7-7 7 7-7 7',
  menu: 'M3 12h18M3 6h18M3 18h18',
  x: 'M18 6 6 18M6 6l12 12',
  copy: 'M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-4H8zM16 4v4h4M8 12h8M8 16h4',
}

export function Icon({ name, size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
