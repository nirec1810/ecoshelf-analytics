'use client'

import { Badge } from '@/components/ui/badge'
import type { ProduccionConPan } from '@/models/produccion.model'
import { monedaDecimal, porcentajeTexto } from '@/lib/formatos'

interface Props {
  registros: ProduccionConPan[]
}

function pctDesperdicio(desperdicio: number, producido: number): string {
  return porcentajeTexto(desperdicio, producido)
}

function pctVenta(vendido: number, producido: number): string {
  return porcentajeTexto(vendido, producido)
}

function badgeDesperdicio(desperdicio: number, producido: number) {
  if (producido === 0) return <Badge variant="secondary">—</Badge>
  const pct = desperdicio / producido
  if (pct === 0)    return <Badge className="bg-green-100 text-green-700">0%</Badge>
  if (pct <= 0.10)  return <Badge className="bg-yellow-100 text-yellow-700">{pctDesperdicio(desperdicio, producido)}</Badge>
  if (pct <= 0.20)  return <Badge className="bg-orange-100 text-orange-700">{pctDesperdicio(desperdicio, producido)}</Badge>
  return <Badge variant="destructive">{pctDesperdicio(desperdicio, producido)} ⚠️</Badge>
}

export function TablaHistorial({ registros }: Props) {
  if (registros.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-3xl mb-2">📋</p>
        <p>No hay registros para el período seleccionado.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-3 font-semibold text-gray-600">Fecha</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Pan</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Producido</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Vendido</th>
            <th className="px-4 py-3 font-semibold text-gray-600">% Venta</th>
            <th className="px-4 py-3 font-semibold text-gray-600">% Desperdicio</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Costo</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ganancia</th>
          </tr>
        </thead>
        <tbody>
          {registros.map(r => (
            <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500">
                {new Date(r.fecha).toLocaleDateString('es-EC')}
              </td>
              <td className="px-4 py-3 font-medium">{r.pan.nombre}</td>
              <td className="px-4 py-3">{r.producido}</td>
              <td className="px-4 py-3 text-green-600">{r.vendido}</td>
              <td className="px-4 py-3">{pctVenta(r.vendido, r.producido)}</td>
              <td className="px-4 py-3">{badgeDesperdicio(r.desperdicio, r.producido)}</td>
              <td className="px-4 py-3 text-gray-500">{monedaDecimal(r.costo)}</td>
              <td className="px-4 py-3 text-green-600 font-medium">{monedaDecimal(r.ganancia)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
