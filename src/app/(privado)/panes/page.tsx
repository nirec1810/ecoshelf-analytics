import { Suspense }               from 'react'
import { obtenerPanesConCostoAction } from '@/controllers/pan.controlador'
import { PanesCliente }           from './PanesCliente'

export default async function PaginaPanes() {
  const panes = await obtenerPanesConCostoAction()

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🍞 Panes</h1>
        <p className="text-gray-500 mt-1">Catálogo de tipos de pan y sus márgenes</p>
      </div>
      <Suspense fallback={<p>Cargando...</p>}>
        <PanesCliente panesIniciales={panes} />
      </Suspense>
    </main>
  )
}