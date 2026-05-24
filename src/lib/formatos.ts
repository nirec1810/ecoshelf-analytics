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
