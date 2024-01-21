export function toTitleCase(str: string) {
  if (!str) return ""
  return str[0].toUpperCase() + str.slice(1).toLowerCase()
}
