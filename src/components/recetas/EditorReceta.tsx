'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  agregarIngredienteAction,
  actualizarCantidadAction,
  eliminarIngredienteAction,
} from '@/controllers/receta.controlador'
import type { RecetaConInsumo } from '@/models/receta.model'
import type { Insumo }          from '@/models/insumo.model'
import { calcularCostoReceta }  from '@/lib/calculos'
import { monedaDecimal }        from '@/lib/formatos'

interface Props {
  pan_id:   string
  receta:   RecetaConInsumo[]
  insumos:  Insumo[]           // todos los insumos disponibles para el select
}

export function EditorReceta({ pan_id, receta, insumos }: Props) {
  const router = useRouter()
  const [filas,      setFilas]      = useState<RecetaConInsumo[]>(receta)
  const [insumoSel,  setInsumoSel]  = useState('')
  const [cantidad,   setCantidad]   = useState(0)
  const [error,      setError]      = useState<string | null>(null)
  const [cargando,   setCargando]   = useState(false)

  useEffect(() => {
    setFilas(receta)
  }, [receta])

  // Insumos que aún no están en la receta
  const insumosDisponibles = insumos.filter(
    i => !filas.some(f => f.insumo_id === i.id)
  )

  // Costo total de la receta por unidad
  const costoTotal = calcularCostoReceta(filas)

  async function manejarAgregar() {
    if (!insumoSel) return setError('Selecciona un insumo')
    if (cantidad <= 0) return setError('La cantidad debe ser mayor a 0')

    setError(null)
    setCargando(true)
    try {
      await agregarIngredienteAction({ pan_id, insumo_id: insumoSel, cantidad })
      setInsumoSel('')
      setCantidad(0)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setCargando(false)
    }
  }

  async function manejarEliminar(id: string) {
    await eliminarIngredienteAction(id, pan_id)
    setFilas(prev => prev.filter(f => f.id !== id))
  }

  async function manejarCantidad(id: string, nueva: number) {
    await actualizarCantidadAction(id, pan_id, nueva)
    setFilas(prev => prev.map(f => f.id === id ? { ...f, cantidad: nueva } : f))
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Tabla de ingredientes actuales */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Insumo</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Costo parcial</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-400 py-6">
                Sin ingredientes. Agrega el primero abajo.
              </TableCell>
            </TableRow>
          ) : (
            filas.map(fila => (
              <TableRow key={fila.id}>
                <TableCell className="font-medium">{fila.insumo.nombre}</TableCell>
                <TableCell>
                  <Input
                    type="number" min={0} step={0.0001}
                    className="w-24 h-8"
                    defaultValue={fila.cantidad}
                    onBlur={e => manejarCantidad(fila.id, Number(e.target.value))}
                  />
                </TableCell>
                <TableCell className="text-gray-500">{fila.insumo.unidad}</TableCell>
                <TableCell className="text-gray-500">
                  {monedaDecimal(fila.cantidad * fila.insumo.costo, 4)}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm" variant="destructive"
                    onClick={() => manejarEliminar(fila.id)}
                  >
                    Quitar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Costo total */}
      {filas.length > 0 && (
        <div className="text-right text-sm text-gray-500">
          Costo por unidad: <span className="font-semibold text-gray-700">{monedaDecimal(costoTotal, 4)}</span>
        </div>
      )}

      {/* Agregar ingrediente */}
      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Agregar ingrediente</p>
        <div className="flex gap-2 flex-wrap">
          <Select value={insumoSel} onValueChange={setInsumoSel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecciona insumo..." />
            </SelectTrigger>
            <SelectContent>
              {insumosDisponibles.map(i => (
                <SelectItem key={i.id} value={i.id}>
                  {i.nombre} ({i.unidad})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number" min={0} step={0.0001}
            placeholder="Cantidad"
            className="w-28"
            value={cantidad || ''}
            onChange={e => setCantidad(Number(e.target.value))}
          />
          <Button onClick={manejarAgregar} disabled={cargando}>
            {cargando ? 'Agregando...' : '+ Agregar'}
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-2">⚠️ {error}</p>
        )}
      </div>

    </div>
  )
}
