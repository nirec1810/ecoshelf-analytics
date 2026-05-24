import { semanaAnterior } from '@/lib/fechas'
import { SugerenciasCliente } from './SugerenciasCliente'

export default function PaginaSugerencias() {
  const { inicio, fin } = semanaAnterior()

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sugerencias de Producción</h1>
        <p className="text-gray-500 mt-1">Motor de análisis semanal</p>
      </div>
      <SugerenciasCliente inicioDefault={inicio} finDefault={fin} />
    </main>
  )
}
