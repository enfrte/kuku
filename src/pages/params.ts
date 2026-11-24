export function parseId(value: string | undefined): number | undefined {
  if (!value) return undefined
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : undefined
}
