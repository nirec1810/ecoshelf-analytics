'use client'

import { useState }  from 'react'
import { Button }    from '@/components/ui/button'
import { Input }     from '@/components/ui/input'
import { Badge }     from '@/components/ui/badge'
import { guardarProduccionAction } from '@/controllers/produccion.controlador'
import type { Pan }  from '@/models/pan.model'

interface FilaProduccion {
  pan_id:    string
  nombre:    string
  producido: number
  vendido:   number
}

interface Props {
  panes:  Pan[]
  fecha:  string
}

export function TablaProduccion({ panes, fecha }: Props) {
  const [filas, setFilas] = useState<FilaProduccion[]>(
    panes.map(p => ({ pan_id: p.id, nombre: p.nombre, producido: 0, vendido: 0 }))
  )
  const [error,    setError]    = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  function actualizarFila(pan_id: string, campo: 'producido' | 'vendido', valor: number) {
    setFilas(prev => prev.map(f =>
      f.pan_id === pan_id ? { ...f, [campo]: valor } : f
    ))
    setGuardado(false)
  }

  function calcularDesperdicio(fila: FilaProduccion): number {
    return Math.max(0, fila.producido - fila.vendido)
  }

  function estadoBadge(desperdicio: number, producido: number) {
    if (producido === 0) return <Badge variant="secondary">Sin datos</Badge>
    const pct = desperdicio / producido
    if (pct === 0)   return <Badge className="bg-green-100 text-green-700">0</Badge>
    if (pct <= 0.10) return <Badge className="bg-yellow-100 text-yellow-700">{desperdicio}</Badge>
    return <Badge variant="destructive">{desperdicio} ⚠️</Badge>
  }

  // Totales del día
  const totalProducido   = filas.reduce((s, f) => s + f.producido, 0)
  const totalVendido     = filas.reduce((s, f) => s + f.vendido,   0)
  const totalDesperdicio = filas.reduce((s, f) => s + calcularDesperdicio(f), 0)

  async function manejarGuardar() {
    setError(null)
    setCargando(true)
    try {
      await guardarProduccionAction(
        filas.map(f => ({ pan_id: f.pan_id, producido: f.producido, vendido: f.vendido })),
        fecha
      )
      setGuardado(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-600">Pan</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Producido</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Vendido</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Desperdicio</th>
            </tr>
          </thead>
          <tbody>
            {filas.map(fila => (
              <tr key={fila.pan_id} className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium">{fila.nombre}</td>
                <td className="px-4 py-3">
                  <Input
                    type="number" min={0} className="w-24 h-8"
                    value={fila.producido || ''}
                    onChange={e => actualizarFila(fila.pan_id, 'producido', Number(e.target.value))}
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="number" min={0} className="w-24 h-8"
                    value={fila.vendido || ''}
                    onChange={e => actualizarFila(fila.pan_id, 'vendido', Number(e.target.value))}
                  />
                </td>
                <td className="px-4 py-3">
                  {estadoBadge(calcularDesperdicio(fila), fila.producido)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="bg-gray-50 rounded-lg px-4 py-3 flex justify-end gap-8 text-sm">
        <div className="text-right">
          <p className="text-gray-400 text-xs uppercase tracking-wide">Total producido</p>
          <p className="font-semibold">{totalProducido} u</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs uppercase tracking-wide">Total vendido</p>
          <p className="font-semibold text-green-600">{totalVendido} u</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs uppercase tracking-wide">Total desperdicio</p>
          <p className="font-semibold text-red-500">{totalDesperdicio} u</p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          ⚠️ {error}
        </div>
      )}

      {guardado && (
        <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
          ✅ Registro guardado correctamente
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          onClick={manejarGuardar}
          disabled={cargando}
        >
          {cargando ? 'Guardando...' : '💾 Guardar registro del día'}
        </Button>
      </div>
    </div>
  )
}