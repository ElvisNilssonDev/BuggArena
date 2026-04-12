export function getAvatarHue(name) {
  let hash = 0;
  for (const ch of name) {
    hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}