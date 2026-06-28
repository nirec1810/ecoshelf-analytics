// PRINCIPIO SOLID APLICADO: SRP
// Responsabilidad única: calcular la distribución óptima de stock semanal
// entre los panes activos, ponderada por tasa de venta.
// Cualquier cambio en la lógica de distribución ocurre SOLO aquí.

import { InsumoRepositorio } from '@/models/insumo.repositorio'
import { RecetaRepositorio } from '@/models/receta.repositorio'
import type { DistribucionPan, MetricaPan } from '@/models/sugerencia.model'

export class DistribucionServicio {
  async calcular(metricas: MetricaPan[]): Promise<DistribucionPan[]> {
    const insumos   = await InsumoRepositorio.obtenerTodos()
    const resultado: DistribucionPan[] = []

    for (const insumo of insumos) {
      if (insumo.stock_semana <= 0) continue

      const panesConInsumo: { metrica: MetricaPan; cantidad_receta: number }[] = []

      for (const metrica of metricas) {
        const receta  = await RecetaRepositorio.obtenerPorPan(metrica.pan_id)
        const rInsumo = receta.find(r => r.insumo_id === insumo.id)
        if (rInsumo) {
          panesConInsumo.push({ metrica, cantidad_receta: rInsumo.cantidad })
        }
      }

      panesConInsumo.sort((a, b) => b.metrica.pct_venta - a.metrica.pct_venta)

      const totalPct     = panesConInsumo.reduce((s, p) => s + p.metrica.pct_venta, 0)
      let   stockRestante = insumo.stock_semana

      for (const { metrica, cantidad_receta } of panesConInsumo) {
        if (stockRestante <= 0) break

        const proporcionStock = totalPct > 0
          ? metrica.pct_venta / totalPct
          : 1 / panesConInsumo.length

        const asignado      = Number((insumo.stock_semana * proporcionStock).toFixed(3))
        const produccionEst = cantidad_receta > 0 ? Math.floor(asignado / cantidad_receta) : 0
        const gananciaEst   = Number((produccionEst * metrica.margen).toFixed(2))

        stockRestante = Number((stockRestante - asignado).toFixed(3))

        resultado.push({
          pan_id:        metrica.pan_id,
          nombre:        metrica.nombre,
          insumo_id:     insumo.id,
          nombre_insumo: insumo.nombre,
          unidad:        insumo.unidad,
          asignado,
          produccion_est: produccionEst,
          ganancia_est:   gananciaEst,
        })
      }
    }

    return resultado
  }
}