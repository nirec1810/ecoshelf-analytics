'use client'

import { useState }              from 'react'
import { Button }                from '@/components/ui/button'
import { Input }                 from '@/components/ui/input'
import { Label }                 from '@/components/ui/label'
import { TarjetaSugerencia }     from '@/components/sugerencias/TarjetaSugerencia'
import { TablaDistribucion }     from '@/components/sugerencias/TablaDistribucion'
import { ejecutarMotorAction }   from '@/controllers/sugerencia.controlador'
import type { ResultadoMotor }   from '@/models/sugerencia.model'
import { monedaDecimal, proporcionTexto } from '@/lib/formatos'

interface Props {
  inicioDefault: string
  finDefault:    string
}

export function SugerenciasCliente({ inicioDefault, finDefault }: Props) {
  const [inicio,    setInicio]    = useState(inicioDefault)
  const [fin,       setFin]       = useState(finDefault)
  const [resultado, setResultado] = useState<ResultadoMotor | null>(null)
  const [cargando,  setCargando]  = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [desperdicio, setDesperdicio] = useState(0)
  const [demanda, setdemanda] = useState(0)

  async function manejarEjecutar() {
    setError(null)
    setCargando(true)
    try {
      const data = await ejecutarMotorAction(inicio, fin)
      setResultado(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Panel de control */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex gap-4 items-end flex-wrap">
          <div className="flex flex-col gap-1">
            <Label>Semana inicio</Label>
            <Input type="date" value={inicio} onChange={e => setInicio(e.target.value)} className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Semana fin</Label>
            <Input type="date" value={fin} onChange={e => setFin(e.target.value)} className="w-40" />            
          </div>
          <Button onClick={manejarEjecutar} disabled={cargando}>
            {cargando ? 'Analizando...' : 'Ejecutar motor'}
          </Button>
        </div>
        {error && <p className="text-sm text-red-600 mt-3">⚠️ {error}</p>}
      </div>

      {resultado && (
        <>
          {/* Resumen de métricas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Panes analizados',  valor: resultado.metricas.length,               color: 'text-gray-800' },
              { label: 'Sugerencias',        valor: resultado.sugerencias.length,             color: 'text-amber-600' },
              { label: 'Ganancia real',      valor: monedaDecimal(resultado.ganancia_actual), color: 'text-gray-800' },
              { label: 'Ganancia estimada',  valor: monedaDecimal(resultado.ganancia_est),    color: 'text-green-600' },
            ].map(item => (
              <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold ${item.color}`}>{item.valor}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Métricas por pan */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-700 mb-4">Métricas por pan</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-600">Pan</th>
                  <th className="px-3 py-2 font-semibold text-gray-600">Producido</th>
                  <th className="px-3 py-2 font-semibold text-gray-600">Vendido</th>
                  <th className="px-3 py-2 font-semibold text-gray-600">% Venta</th>
                  <th className="px-3 py-2 font-semibold text-gray-600">% Desperdicio</th>
                  <th className="px-3 py-2 font-semibold text-gray-600">Margen/u</th>
                </tr>
              </thead>
              <tbody>
                {resultado.metricas.map(m => (
                  <tr key={m.pan_id} className="border-b border-gray-100">
                    <td className="px-3 py-2 font-medium">{m.nombre}</td>
                    <td className="px-3 py-2">{m.producido}</td>
                    <td className="px-3 py-2 text-green-600">{m.vendido}</td>
                    <td className="px-3 py-2">
                      <span className={m.pct_venta >= demanda ? 'text-green-600 font-semibold' : ''}>
                        {proporcionTexto(m.pct_venta)}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={m.pct_desp > desperdicio ? 'text-red-600 font-semibold' : ''}>
                        {proporcionTexto(m.pct_desp)}
                        {m.pct_desp > desperdicio && ' ⚠️'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-500">{monedaDecimal(m.margen, 4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sugerencias */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-700 mb-4">💡 Sugerencias</h2>
            {resultado.sugerencias.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>Producción optimizada. No se detectaron excesos significativos.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {resultado.sugerencias.map((s, i) => (
                  <TarjetaSugerencia key={i} sugerencia={s} />
                ))}
              </div>
            )}
          </div>

          {/* Distribución de stock */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-700 mb-4">Distribución de stock semanal</h2>
            <TablaDistribucion distribucion={resultado.distribucion} />
          </div>
        </>
      )}

    </div>
  )
}
