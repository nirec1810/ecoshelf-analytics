import { Suspense }          from 'react'
import { HistorialCliente }  from './HistorialCliente'

export default function PaginaHistorial() {
  // Rango por defecto: últimos 7 días
  const fin    = new Date().toISOString().split('T')[0]
  const inicio = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📂 Historial de Producción</h1>
        <p className="text-gray-500 mt-1">Consulta registros anteriores por rango de fechas</p>
      </div>
      <Suspense fallback={<p>Cargando...</p>}>
        <HistorialCliente inicioDefault={inicio} finDefault={fin} />
      </Suspense>
    </main>
  )
}