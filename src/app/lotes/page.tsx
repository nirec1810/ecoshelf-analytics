import { Suspense } from 'react'
import { LotesCliente } from './LotesCliente'
import { LoteRepositorio } from '@/models/lote.repositorio'
import { cerrarSesionAction } from '@/controllers/auth.controlador'
import { Button } from '@/components/ui/button'

export default async function PaginaLotes() {
  const lotes = await LoteRepositorio.obtenerTodos()

  return (
    <main>
      <div>
        <h1>EcoShelf Analytics</h1>
        <p>Gestión de lotes próximos a vencer</p>
      </div>
      <form action={cerrarSesionAction}>
          <Button variant="outline">Cerrar sesión</Button>
        </form>
      <Suspense fallback={<p>Cargando lotes...</p>}>
        <LotesCliente lotesIniciales={lotes} />
      </Suspense>
    </main>
  )
}