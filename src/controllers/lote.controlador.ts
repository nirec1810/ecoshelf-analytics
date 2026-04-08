'use server'

import { revalidatePath } from 'next/cache'
import { LoteRepositorio } from '@/models/lote.repositorio'
import type { CrearLoteDTO, ActualizarLoteDTO } from '@/models/lote.model'

export async function obtenerLotesAction() {
  return await LoteRepositorio.obtenerTodos()
}

export async function crearLoteAction(dto: CrearLoteDTO) {
  if (dto.precio_descuento && dto.precio_descuento >= dto.precio_original) {
    throw new Error('El precio de descuento debe ser menor al precio original')
  }

  const lote = await LoteRepositorio.crear(dto)
  revalidatePath('/lotes')
  return lote
}

export async function actualizarLoteAction(id: string, dto: ActualizarLoteDTO) {
  const lote = await LoteRepositorio.actualizar(id, dto)
  revalidatePath('/lotes')
  return lote
}

export async function eliminarLoteAction(id: string) {
  await LoteRepositorio.eliminar(id)
  revalidatePath('/lotes')
}
