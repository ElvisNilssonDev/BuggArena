export function getAvatarHue(username: string): number {
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

export function getAvatarStyle(username: string): { background: string; color: string } {
  const hue = getAvatarHue(username)
  return {
    background: `hsl(${hue}, 60%, 20%)`,
    color: `hsl(${hue}, 80%, 75%)`,
  }
}
