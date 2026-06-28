// PRINCIPIO SOLID APLICADO: Single Responsibility Principle (SRP)
// MetricasServicio tiene UNA responsabilidad: transformar datos crudos
// de producción + recetas en MetricaPan[] enriquecidas. Si la fórmula de
// margen cambia, solo este archivo se edita.

import { PanRepositorio }       from '@/models/pan.repositorio'
import { ProduccionRepositorio } from '@/models/produccion.repositorio'
import { RecetaRepositorio }    from '@/models/receta.repositorio'
import { proporcion }            from '@/lib/formatos'
import type { MetricaPan }       from '@/models/sugerencia.model'

export class MetricasServicio {
  async calcular(inicio: string, fin: string): Promise<MetricaPan[]> {
    const [agrupado, panes] = await Promise.all([
      ProduccionRepositorio.obtenerAgrupado(inicio, fin),
      PanRepositorio.obtenerActivos(),
    ])

    const metricas = await Promise.all(
      agrupado.map(async fila => {
        const pan = panes.find(p => p.id === fila.pan_id)
        if (!pan) return null

        const receta = await RecetaRepositorio.obtenerPorPan(fila.pan_id)
        const costo  = receta.reduce((t, r) => t + r.cantidad * r.insumo.costo, 0)
        const margen = Number((pan.precio - costo).toFixed(4))

        return {
          pan_id:      pan.id,
          nombre:      pan.nombre,
          precio:      pan.precio,
          margen,
          producido:   fila.producido,
          vendido:     fila.vendido,
          desperdicio: fila.desperdicio,
          pct_venta:   proporcion(fila.vendido,     fila.producido),
          pct_desp:    proporcion(fila.desperdicio, fila.producido),
        } as MetricaPan
      })
    )

    return metricas.filter(Boolean) as MetricaPan[]
  }
}