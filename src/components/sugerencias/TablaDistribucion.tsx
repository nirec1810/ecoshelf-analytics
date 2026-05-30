import type { DistribucionPan } from '@/models/sugerencia.model'
import { monedaDecimal } from '@/lib/formatos'

interface Props { distribucion: DistribucionPan[] }

export function TablaDistribucion({ distribucion }: Props) {
  if (distribucion.length === 0) {
    return (
      <p className="text-center text-gray-400 py-6 text-sm">
        No hay stock semanal configurado. Actualiza el stock en el módulo de Insumos.
      </p>
    )
  }

  // Agrupa por insumo para mostrar la tabla
  const porInsumo = distribucion.reduce((acc, d) => {
    if (!acc[d.insumo_id]) acc[d.insumo_id] = []
    acc[d.insumo_id].push(d)
    return acc
  }, {} as Record<string, DistribucionPan[]>)

  return (
    <div className="flex flex-col gap-4">
      {Object.values(porInsumo).map(filas => (
        <div key={filas[0].insumo_id}>
          <p className="text-sm font-semibold text-gray-600 mb-2">
            {filas[0].nombre_insumo}
            <span className="ml-2 text-gray-400 font-normal">
              (stock: {filas.reduce((s, f) => s + f.asignado, 0).toFixed(3)} {filas[0].unidad})
            </span>
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-3 py-2 font-semibold text-gray-600">Pan</th>
                <th className="px-3 py-2 font-semibold text-gray-600">Asignado</th>
                <th className="px-3 py-2 font-semibold text-gray-600">Producción est.</th>
                <th className="px-3 py-2 font-semibold text-gray-600">Ganancia est.</th>
              </tr>
            </thead>
            <tbody>
              {filas.map(f => (
                <tr key={f.pan_id} className="border-b border-gray-100">
                  <td className="px-3 py-2 font-medium">{f.nombre}</td>
                  <td className="px-3 py-2 text-gray-500">{f.asignado} {f.unidad}</td>
                  <td className="px-3 py-2">{f.produccion_est} u</td>
                  <td className="px-3 py-2 text-green-600 font-medium">{monedaDecimal(f.ganancia_est)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-3 py-2">Total</td>
                <td className="px-3 py-2 text-gray-500">
                  {filas.reduce((s, f) => s + f.asignado, 0).toFixed(3)} {filas[0].unidad}
                </td>
                <td className="px-3 py-2">{filas.reduce((s, f) => s + f.produccion_est, 0)} u</td>
                <td className="px-3 py-2 text-green-600">
                  {monedaDecimal(filas.reduce((s, f) => s + f.ganancia_est, 0))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
