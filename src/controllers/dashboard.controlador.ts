'use server'

import { ProduccionRepositorio } from '@/models/produccion.repositorio'
import { PanRepositorio } from '@/models/pan.repositorio'
import type { Pan } from '@/models/pan.model'
import { moneda, porcentaje } from '@/lib/formatos'
import { rangoUltimosDias } from '@/lib/fechas'

interface MetricaDashboardPan {
  pan: Pan
  producido: number
  vendido: number
  desperdicio: number
  ganancia: number
  pctVenta: number
  pctDesperdicio: number
}

export async function obtenerDashboardAction() {
  const { inicio, fin } = rangoUltimosDias(7)

  const [registros, panes] = await Promise.all([
    ProduccionRepositorio.obtenerPorRango(inicio, fin),
    PanRepositorio.obtenerActivos(),
  ])

  const totalProducido   = registros.reduce((s, r) => s + r.producido, 0)
  const totalVendido     = registros.reduce((s, r) => s + r.vendido, 0)
  const totalDesperdicio = registros.reduce((s, r) => s + r.desperdicio, 0)
  const totalGanancia    = registros.reduce((s, r) => s + r.ganancia, 0)

  const porPan: MetricaDashboardPan[] = panes
    .map(pan => {
      const filas = registros.filter(r => r.pan_id === pan.id)
      const producido   = filas.reduce((s, r) => s + r.producido, 0)
      const vendido     = filas.reduce((s, r) => s + r.vendido, 0)
      const desperdicio = filas.reduce((s, r) => s + r.desperdicio, 0)
      const ganancia    = filas.reduce((s, r) => s + r.ganancia, 0)

      return {
        pan,
        producido,
        vendido,
        desperdicio,
        ganancia,
        pctVenta: porcentaje(vendido, producido),
        pctDesperdicio: porcentaje(desperdicio, producido),
      }
    })
    .filter(m => m.producido > 0)

  const stats = [
    { label: 'Producido',   valor: `${totalProducido} u`,       color: 'text-gray-800' },
    { label: 'Vendido',     valor: `${totalVendido} u`,         color: 'text-green-600' },
    { label: 'Desperdicio', valor: `${totalDesperdicio} u`,     color: 'text-red-500' },
    { label: 'Ganancia',    valor: moneda(totalGanancia),       color: 'text-amber-700' },
  ]

  return {
    inicio,
    fin,
    stats,
    porPan,
  }
}
