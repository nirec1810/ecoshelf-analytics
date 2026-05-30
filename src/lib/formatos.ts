export function porcentaje(parte: number, total: number, decimales = 1): number {
  if (total === 0) return 0
  return Number(((parte / total) * 100).toFixed(decimales))
}

export function proporcion(parte: number, total: number, decimales = 4): number {
  if (total === 0) return 0
  return Number((parte / total).toFixed(decimales))
}

export function moneda(valor: number): string {
  return `$${valor.toLocaleString('es-CL')}`
}

export function monedaDecimal(valor: number, decimales = 2): string {
  return `$${valor.toFixed(decimales)}`
}

export function porcentajeTexto(parte: number, total: number, decimales = 1): string {
  if (total === 0) return '—'
  return `${porcentaje(parte, total, decimales)}%`
}

export function proporcionTexto(valor: number, decimales = 1): string {
  return `${(valor * 100).toFixed(decimales)}%`
}
