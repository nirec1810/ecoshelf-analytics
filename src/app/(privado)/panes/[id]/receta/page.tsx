import { notFound }          from 'next/navigation'
import { PanRepositorio }    from '@/models/pan.repositorio'
import { RecetaRepositorio } from '@/models/receta.repositorio'
import { InsumoRepositorio } from '@/models/insumo.repositorio'
import { EditorReceta }      from '@/components/recetas/EditorReceta'
import { calcularCostoReceta, calcularMargenPan } from '@/lib/calculos'
import { monedaDecimal } from '@/lib/formatos'

export default async function PaginaReceta({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [pan, receta, insumos] = await Promise.all([
    PanRepositorio.obtenerPorId(id),
    RecetaRepositorio.obtenerPorPan(id),
    InsumoRepositorio.obtenerTodos(),
  ])

  if (!pan) return notFound()

  const costoTotal = calcularCostoReceta(receta)

  return (
    <main className="container mx-auto py-8 px-4 max-w-3xl">
      <a href="/panes" className="text-sm text-gray-400 hover:text-gray-600">
        ← Volver a Panes
      </a>

      <div className="mt-4 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receta — {pan.nombre}</h1>
          <p className="text-gray-500 mt-1">Ingredientes por unidad producida</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Precio de venta</p>
          <p className="text-lg font-bold text-gray-800">{monedaDecimal(pan.precio)}</p>
          <p className="text-sm text-gray-400 mt-1">Margen estimado</p>
          <p className="text-lg font-bold text-green-600">
            {monedaDecimal(calcularMargenPan(pan.precio, costoTotal), 4)}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <EditorReceta pan_id={id} receta={receta} insumos={insumos} />
      </div>
    </main>
  )
}
