type RecetaConCosto = {
  cantidad: number
  insumo: { costo: number }
}

function redondear(valor: number, decimales: number): number {
  return Number(valor.toFixed(decimales))
}

export function calcularCostoReceta(receta: RecetaConCosto[]): number {
  return receta.reduce((total, item) => total + item.cantidad * item.insumo.costo, 0)
}

export function calcularMargenPan(precio: number, costoUnidad: number): number {
  return redondear(precio - costoUnidad, 4)
}

export function calcularDesperdicio(producido: number, vendido: number): number {
  return producido - vendido
}

export function calcularCostoProduccion(costoUnidad: number, producido: number): number {
  return redondear(costoUnidad * producido, 2)
}

export function calcularGananciaProduccion(
  vendido: number,
  precioUnidad: number,
  costoProduccion: number
): number {
  return redondear(vendido * precioUnidad - costoProduccion, 2)
}

export function redondearCostoUnidad(costoUnidad: number): number {
  return redondear(costoUnidad, 4)
}
