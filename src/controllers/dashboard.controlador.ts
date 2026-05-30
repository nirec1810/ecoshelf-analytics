'use server'

import { ProduccionRepositorio } from '@/models/produccion.repositorio'
import { PanRepositorio } from '@/models/pan.repositorio'
import type { Pan } from '@/models/pan.model'
import type { ProduccionConPan } from '@/models/produccion.model'
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

type TotalesProduccion = Pick<
  ProduccionConPan,
  'producido' | 'vendido' | 'desperdicio' | 'ganancia'
>

function crearTotales(): TotalesProduccion {
  return { producido: 0, vendido: 0, desperdicio: 0, ganancia: 0 }
}

function agruparPorPan(registros: ProduccionConPan[]) {
  const agrupado = new Map<string, TotalesProduccion>()
  const totales = crearTotales()

  for (const registro of registros) {
    const porPan = agrupado.get(registro.pan_id) ?? crearTotales()

    porPan.producido += registro.producido
    porPan.vendido += registro.vendido
    porPan.desperdicio += registro.desperdicio
    porPan.ganancia += registro.ganancia

    totales.producido += registro.producido
    totales.vendido += registro.vendido
    totales.desperdicio += registro.desperdicio
    totales.ganancia += registro.ganancia

    agrupado.set(registro.pan_id, porPan)
  }

  return { agrupado, totales }
}

export async function obtenerDashboardAction() {
  const { inicio, fin } = rangoUltimosDias(7)

  const [registros, panes] = await Promise.all([
    ProduccionRepositorio.obtenerPorRango(inicio, fin),
    PanRepositorio.obtenerActivos(),
  ])

  const { agrupado, totales } = agruparPorPan(registros)

  const porPan: MetricaDashboardPan[] = panes
    .map(pan => {
      const metricas = agrupado.get(pan.id) ?? crearTotales()

      return {
        pan,
        producido: metricas.producido,
        vendido: metricas.vendido,
        desperdicio: metricas.desperdicio,
        ganancia: metricas.ganancia,
        pctVenta: porcentaje(metricas.vendido, metricas.producido),
        pctDesperdicio: porcentaje(metricas.desperdicio, metricas.producido),
      }
    })
    .filter(m => m.producido > 0)

  const stats = [
    { label: 'Producido',   valor: `${totales.producido} u`,       color: 'text-gray-800' },
    { label: 'Vendido',     valor: `${totales.vendido} u`,         color: 'text-green-600' },
    { label: 'Desperdicio', valor: `${totales.desperdicio} u`,     color: 'text-red-500' },
    { label: 'Ganancia',    valor: moneda(totales.ganancia),       color: 'text-amber-700' },
  ]

  return {
    inicio,
    fin,
    stats,
    porPan,
  }
}
