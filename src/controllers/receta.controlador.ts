'use server'

import { revalidatePath }    from 'next/cache'
import { RecetaRepositorio } from '@/models/receta.repositorio'
import { InsumoRepositorio } from '@/models/insumo.repositorio'
import type { CrearRecetaDTO } from '@/models/receta.model'

function rutaReceta(pan_id: string) {
  return `/panes/${pan_id}/receta`
}

export async function obtenerRecetaAction(pan_id: string) {
  return await RecetaRepositorio.obtenerPorPan(pan_id)
}

export async function agregarIngredienteAction(dto: CrearRecetaDTO) {
  // Verifica que el insumo exista
  const insumo = await InsumoRepositorio.obtenerPorId(dto.insumo_id)
  if (!insumo) throw new Error('El insumo no existe')

  if (dto.cantidad <= 0)
    throw new Error('La cantidad debe ser mayor a 0')

  const receta = await RecetaRepositorio.agregar(dto)
  revalidatePath(rutaReceta(dto.pan_id))
  return receta
}

export async function actualizarCantidadAction(id: string, pan_id: string, cantidad: number) {
  if (cantidad <= 0)
    throw new Error('La cantidad debe ser mayor a 0')

  const receta = await RecetaRepositorio.actualizar(id, { cantidad })
  revalidatePath(rutaReceta(pan_id))
  return receta
}

export async function eliminarIngredienteAction(id: string, pan_id: string) {
  await RecetaRepositorio.eliminar(id)
  revalidatePath(rutaReceta(pan_id))
}