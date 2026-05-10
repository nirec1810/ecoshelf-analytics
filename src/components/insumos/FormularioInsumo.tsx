'use client'

import { useState } from 'react'
import { Button }   from '@/components/ui/button'
import { Input }    from '@/components/ui/input'
import { Label }    from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { crearInsumoAction, actualizarInsumoAction } from '@/controllers/insumo.controlador'
import type { Insumo, CrearInsumoDTO, Unidad } from '@/models/insumo.model'

interface Props {
  insumoInicial?: Insumo
  onExito: () => void
}

const UNIDADES: Unidad[] = ['kg', 'lt', 'u']

export function FormularioInsumo({ insumoInicial, onExito }: Props) {
  const [campos, setCampos] = useState<CrearInsumoDTO>({
    nombre:       insumoInicial?.nombre       ?? '',
    unidad:       insumoInicial?.unidad       ?? 'kg',
    costo:        insumoInicial?.costo        ?? 0,
    stock:        insumoInicial?.stock        ?? 0,
    stock_semana: insumoInicial?.stock_semana ?? 0,
  })
  const [error,    setError]    = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  function actualizar<K extends keyof CrearInsumoDTO>(clave: K, valor: CrearInsumoDTO[K]) {
    setCampos(prev => ({ ...prev, [clave]: valor }))
  }

  async function manejarEnvio() {
    setError(null)
    setCargando(true)
    try {
      insumoInicial
        ? await actualizarInsumoAction(insumoInicial.id, campos)
        : await crearInsumoAction(campos)
      onExito()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">

      <div className="col-span-2 flex flex-col gap-1">
        <Label>Nombre</Label>
        <Input
          placeholder="Ej: Harina de trigo"
          value={campos.nombre}
          onChange={e => actualizar('nombre', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label>Unidad</Label>
        <Select
          value={campos.unidad}
          onValueChange={val => actualizar('unidad', val as Unidad)}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {UNIDADES.map(u => (
              <SelectItem key={u} value={u}>{u}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label>Costo por unidad ($)</Label>
        <Input
          type="number" min={0} step={0.0001}
          value={campos.costo}
          onChange={e => actualizar('costo', Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label>Stock actual</Label>
        <Input
          type="number" min={0} step={0.001}
          value={campos.stock}
          onChange={e => actualizar('stock', Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label>Stock semanal</Label>
        <Input
          type="number" min={0} step={0.001}
          value={campos.stock_semana}
          onChange={e => actualizar('stock_semana', Number(e.target.value))}
        />
      </div>

      {error && (
        <div className="col-span-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          ⚠️ {error}
        </div>
      )}

      <div className="col-span-2">
        <Button onClick={manejarEnvio} disabled={cargando} className="w-full">
          {cargando ? 'Guardando...' : insumoInicial ? 'Actualizar' : 'Crear Insumo'}
        </Button>
      </div>

    </div>
  )
}