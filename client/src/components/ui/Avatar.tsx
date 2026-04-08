import { getAvatarStyle } from '../../utils/getAvatarHue'
import { cx } from '../../utils/cx'

interface AvatarProps {
  username: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ username, size = 'md', className }: AvatarProps) {
  const style = getAvatarStyle(username)
  const initial = username.charAt(0).toUpperCase()

  return (
    <span
      className={cx('avatar', `avatar-${size}`, className)}
      style={style}
      aria-label={username}
      title={username}
    >
      {initial}
    </span>
  )
}
