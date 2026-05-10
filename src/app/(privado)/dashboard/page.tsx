import { ProduccionRepositorio } from '@/models/produccion.repositorio'
import { PanRepositorio } from '@/models/pan.repositorio'
import Link from 'next/link' // Importante para la navegación

// Helpers movidos fuera para limpieza, o podrías usarlos dentro.
const pct = (parte: number, total: number) => 
  total === 0 ? 0 : Number(((parte / total) * 100).toFixed(1))

export default async function PaginaDashboard() {
  // Manejo de fechas un poco más robusto
  const hoyObj = new Date()
  const hoy = hoyObj.toLocaleDateString('sv-SE') // Formato YYYY-MM-DD
  const inicio = new Date(hoyObj.getTime() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString('sv-SE')

  const [registros, panes] = await Promise.all([
    ProduccionRepositorio.obtenerPorRango(inicio, hoy),
    PanRepositorio.obtenerActivos(),
  ])

  // Métricas globales
  const totalProducido   = registros.reduce((s, r) => s + r.producido, 0)
  const totalVendido     = registros.reduce((s, r) => s + r.vendido, 0)
  const totalDesperdicio = registros.reduce((s, r) => s + r.desperdicio, 0)
  const totalGanancia    = registros.reduce((s, r) => s + r.ganancia, 0)

  const porPan = panes.map(pan => {
    const filas = registros.filter(r => r.pan_id === pan.id)
    const producido   = filas.reduce((s, r) => s + r.producido, 0)
    const vendido     = filas.reduce((s, r) => s + r.vendido, 0)
    const desperdicio = filas.reduce((s, r) => s + r.desperdicio, 0)
    const ganancia    = filas.reduce((s, r) => s + r.ganancia, 0)
    
    return { 
      pan, 
      producido, 
      vendido, 
      desperdicio, 
      ganancia,
      pv: pct(vendido, producido),
      pd: pct(desperdicio, producido)
    }
  }).filter(m => m.producido > 0)

  const stats = [
    { label: 'Producido',   valor: `${totalProducido} u`,     color: 'text-gray-800' },
    { label: 'Vendido',     valor: `${totalVendido} u`,       color: 'text-green-600' },
    { label: 'Desperdicio', valor: `${totalDesperdicio} u`,   color: 'text-red-500' },
    { label: 'Ganancia',    valor: `$${totalGanancia.toLocaleString('es-CL')}`, color: 'text-amber-700' },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📊 Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Últimos 7 días — {inicio} al {hoy}</p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.valor}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Estado por pan */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-700">Estado por pan</h2>
        </div>

        <div className="overflow-x-auto">
          {porPan.length === 0 ? (
            <p className="text-center text-gray-400 py-12 text-sm">No hay registros esta semana.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Pan</th>
                  <th className="px-6 py-3">Producido</th>
                  <th className="px-6 py-3">Vendido</th>
                  <th className="px-6 py-3">% Venta</th>
                  <th className="px-6 py-3">% Desp.</th>
                  <th className="px-6 py-3">Ganancia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {porPan.map((item) => (
                  <tr key={item.pan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.pan.nombre}</td>
                    <td className="px-6 py-4 text-gray-600">{item.producido}</td>
                    <td className="px-6 py-4 text-green-600 font-medium">{item.vendido}</td>
                    <td className="px-6 py-4">
                      <span className={item.pv >= 85 ? 'text-green-600 font-bold' : 'text-gray-600'}>
                        {item.pv}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={item.pd > 20 ? 'text-red-600 font-bold' : 'text-gray-600'}>
                        {item.pd}% {item.pd > 20 && '⚠️'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-amber-700 font-semibold">
                      ${item.ganancia.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Acceso rápido */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: '/insumos',     label: '🧂 Insumos',     desc: 'Gestiona ingredientes' },
          { href: '/panes',       label: '🍞 Panes',       desc: 'Catálogo y recetas' },
          { href: '/produccion',  label: '📋 Producción',  desc: 'Registro del día' },
          { href: '/sugerencias', label: '💡 Sugerencias', desc: 'Motor de análisis' },
        ].map(item => (
          <Link 
            key={item.href} 
            href={item.href}
            className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-400 hover:shadow-md transition-all"
          >
            <p className="font-semibold text-gray-800 group-hover:text-amber-700">{item.label}</p>
            <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}