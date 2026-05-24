'use client'

import { useState } from 'react'
import { Button }   from '@/components/ui/button'
import { Input }    from '@/components/ui/input'
import { Label }    from '@/components/ui/label'
import { crearPanAction, actualizarPanAction } from '@/controllers/pan.controlador'
import type { Pan, CrearPanDTO } from '@/models/pan.model'

interface Props {
  panInicial?: Pan
  onExito: () => void
}

export function FormularioPan({ panInicial, onExito }: Props) {
  const [campos, setCampos] = useState<CrearPanDTO>({
    nombre: panInicial?.nombre ?? '',
    precio: panInicial?.precio ?? 0,
    activo: panInicial?.activo ?? true,
  })
  const [error,    setError]    = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  function actualizar<K extends keyof CrearPanDTO>(clave: K, valor: CrearPanDTO[K]) {
    setCampos(prev => ({ ...prev, [clave]: valor }))
  }

  async function manejarEnvio() {
    setError(null)
    setCargando(true)
    try {
      if (panInicial) {
        await actualizarPanAction(panInicial.id, campos)
      } else {
        await crearPanAction(campos)
      }
      onExito()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">

      <div className="flex flex-col gap-1">
        <Label>Nombre del pan</Label>
        <Input
          placeholder="Ej: Croissant"
          value={campos.nombre}
          onChange={e => actualizar('nombre', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label>Precio de venta ($)</Label>
        <Input
          type="number" min={0} step={0.01}
          value={campos.precio}
          onChange={e => actualizar('precio', Number(e.target.value))}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <Button onClick={manejarEnvio} disabled={cargando} className="w-full">
        {cargando ? 'Guardando...' : panInicial ? 'Actualizar Pan' : 'Crear Pan'}
      </Button>

    </div>
  )
}
