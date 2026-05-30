import { PanRepositorio }    from '@/models/pan.repositorio'
import { ProduccionCliente } from './ProduccionCliente'

export default async function PaginaProduccion() {
  const panes = await PanRepositorio.obtenerActivos()

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Producción</h1>
        <p className="text-gray-500 mt-1">Registra la producción y ventas por día</p>
      </div>
      <ProduccionCliente panes={panes} />
    </main>
  )
}