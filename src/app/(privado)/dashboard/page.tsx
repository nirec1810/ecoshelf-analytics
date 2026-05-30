import Link from 'next/link'
import { obtenerDashboardAction } from '@/controllers/dashboard.controlador'
import { monedaDecimal } from '@/lib/formatos'

export default async function PaginaDashboard() {
  const { inicio, fin, stats, porPan } = await obtenerDashboardAction()

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Últimos 7 días: {inicio} al {fin}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.valor}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

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
                {porPan.map(item => (
                  <tr key={item.pan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.pan.nombre}</td>
                    <td className="px-6 py-4 text-gray-600">{item.producido}</td>
                    <td className="px-6 py-4 text-green-600 font-medium">{item.vendido}</td>
                    <td className="px-6 py-4">
                      <span className={item.pctVenta >= 85 ? 'text-green-600 font-bold' : 'text-gray-600'}>
                        {item.pctVenta}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={item.pctDesperdicio > 20 ? 'text-red-600 font-bold' : 'text-gray-600'}>
                        {item.pctDesperdicio}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-amber-700 font-semibold">
                      {monedaDecimal(item.ganancia)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: '/insumos',     label: 'Insumos',     desc: 'Gestiona ingredientes' },
          { href: '/panes',       label: 'Panes',       desc: 'Catálogo y recetas' },
          { href: '/produccion',  label: 'Producción',  desc: 'Registro del día' },
          { href: '/sugerencias', label: 'Sugerencias', desc: 'Motor de análisis' },
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
