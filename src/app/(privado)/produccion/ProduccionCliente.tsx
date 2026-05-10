'use client'

import { useState }        from 'react'
import { Input }           from '@/components/ui/input'
import { Label }           from '@/components/ui/label'
import { TablaProduccion } from '@/components/produccion/TablaProduccion'
import type { Pan }        from '@/models/pan.model'

interface Props { panes: Pan[] }

export function ProduccionCliente({ panes }: Props) {
  const hoy = new Date().toISOString().split('T')[0]
  const [fecha, setFecha] = useState(hoy)

  if (panes.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-2">🍞</p>
        <p>No hay panes activos. Activa al menos uno desde el módulo de Panes.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Selector de fecha */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-end gap-4">
        <div className="flex flex-col gap-1">
          <Label>Fecha del registro</Label>
          <Input
            type="date"
            value={fecha}
            max={hoy}
            onChange={e => setFecha(e.target.value)}
            className="w-44"
          />
        </div>
        <p className="text-sm text-gray-400 pb-1">
          Puedes registrar producción de días anteriores
        </p>
      </div>

      {/* Tabla de producción — se re-renderiza al cambiar la fecha */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <TablaProduccion key={fecha} panes={panes} fecha={fecha} />
      </div>
    </div>
  )
}