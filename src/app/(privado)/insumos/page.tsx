import { Suspense }           from 'react'
import { InsumoRepositorio }  from '@/models/insumo.repositorio'
import { InsumosCliente }     from './InsumosCliente'

export default async function PaginaInsumos() {
  const insumos = await InsumoRepositorio.obtenerTodos()

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🧂 Insumos</h1>
        <p className="text-gray-500 mt-1">Ingredientes y stock semanal</p>
      </div>
      <Suspense fallback={<p>Cargando...</p>}>
        <InsumosCliente insumosIniciales={insumos} />
      </Suspense>
    </main>
  )
}