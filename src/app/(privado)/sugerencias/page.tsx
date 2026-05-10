import { SugerenciasCliente } from './SugerenciasCliente'

export default function PaginaSugerencias() {
  // Semana anterior por defecto
  const hoy    = new Date()
  const lunes  = new Date(hoy)
  lunes.setDate(hoy.getDate() - hoy.getDay() - 6)
  const domingo = new Date(lunes)
  domingo.setDate(lunes.getDate() + 6)

  const inicio = lunes.toISOString().split('T')[0]
  const fin    = domingo.toISOString().split('T')[0]

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">💡 Sugerencias de Producción</h1>
        <p className="text-gray-500 mt-1">Motor de análisis semanal</p>
      </div>
      <SugerenciasCliente inicioDefault={inicio} finDefault={fin} />
    </main>
  )
}