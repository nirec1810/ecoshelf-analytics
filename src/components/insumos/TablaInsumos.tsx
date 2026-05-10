'use client'

import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { eliminarInsumoAction, actualizarStockSemanaAction } from '@/controllers/insumo.controlador'
import type { Insumo } from '@/models/insumo.model'
import { useState } from 'react'

interface Props {
  insumos:  Insumo[]
  onEditar: (insumo: Insumo) => void
}

export function TablaInsumos({ insumos, onEditar }: Props) {
  // Estado local para editar stock_semana inline
  const [stocks, setStocks] = useState<Record<string, number>>(
    Object.fromEntries(insumos.map(i => [i.id, i.stock_semana]))
  )

  async function manejarEliminar(id: string) {
    if (!confirm('¿Eliminar este insumo? Esto afectará las recetas que lo usen.')) return
    await eliminarInsumoAction(id)
  }

  async function manejarStockSemana(id: string) {
    await actualizarStockSemanaAction(id, stocks[id])
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Unidad</TableHead>
          <TableHead>Costo</TableHead>
          <TableHead>Stock actual</TableHead>
          <TableHead>Stock semana</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {insumos.map(insumo => (
          <TableRow key={insumo.id}>
            <TableCell className="font-medium">{insumo.nombre}</TableCell>
            <TableCell>{insumo.unidad}</TableCell>
            <TableCell>${insumo.costo.toFixed(4)}/{insumo.unidad}</TableCell>
            <TableCell>{insumo.stock} {insumo.unidad}</TableCell>
            <TableCell>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  min={0}
                  step={0.001}
                  className="w-20 h-8"
                  value={stocks[insumo.id]}
                  onChange={e => setStocks(prev => ({
                    ...prev,
                    [insumo.id]: Number(e.target.value)
                  }))}
                />
                <span className="text-xs text-gray-400">{insumo.unidad}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => manejarStockSemana(insumo.id)}
                >
                  Guardar
                </Button>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEditar(insumo)}>
                  Editar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => manejarEliminar(insumo.id)}>
                  Eliminar
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}