'use client'

import { useRouter } from 'next/navigation'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/badge'
import { eliminarPanAction, toggleActivoAction } from '@/controllers/pan.controlador'
import type { PanConCosto } from '@/models/pan.model'
import { monedaDecimal } from '@/lib/formatos'

interface Props {
  panes:    PanConCosto[]
  onEditar: (pan: PanConCosto) => void
}

export function TablaPanes({ panes, onEditar }: Props) {
  const router = useRouter()

  async function manejarEliminar(id: string) {
    if (!confirm('¿Eliminar este pan? Se eliminarán también sus registros de receta.')) return
    await eliminarPanAction(id)
  }

  async function manejarToggle(id: string, activo: boolean) {
    await toggleActivoAction(id, !activo)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Costo</TableHead>
          <TableHead>Margen</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {panes.map(pan => (
          <TableRow key={pan.id} className={!pan.activo ? 'opacity-50' : ''}>
            <TableCell className="font-medium">{pan.nombre}</TableCell>
            <TableCell>{monedaDecimal(pan.precio)}</TableCell>
            <TableCell className="text-gray-500">{monedaDecimal(pan.costo, 4)}</TableCell>
            <TableCell className="text-green-600 font-medium">
              {monedaDecimal(pan.margen, 4)}
            </TableCell>
            <TableCell>
              <Badge variant={pan.activo ? 'default' : 'secondary'}>
                {pan.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm" variant="outline"
                  onClick={() => router.push(`/panes/${pan.id}/receta`)}
                >
                  Receta
                </Button>
                <Button
                  size="sm" variant="outline"
                  onClick={() => onEditar(pan)}
                >
                  Editar
                </Button>
                <Button
                  size="sm" variant="ghost"
                  onClick={() => manejarToggle(pan.id, pan.activo)}
                >
                  {pan.activo ? 'Desactivar' : 'Activar'}
                </Button>
                <Button
                  size="sm" variant="destructive"
                  onClick={() => manejarEliminar(pan.id)}
                >
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
