type ClassValue = string | undefined | null | false | 0

export function cx(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
