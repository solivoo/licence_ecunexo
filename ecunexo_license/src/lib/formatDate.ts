export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return '—'
  }
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) {
    return '—'
  }
  return d.toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })
}
