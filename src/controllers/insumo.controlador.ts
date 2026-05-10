'use server'

import { revalidatePath } from 'next/cache'
import { InsumoRepositorio } from '@/models/insumo.repositorio'
import type { CrearInsumoDTO, ActualizarInsumoDTO } from '@/models/insumo.model'

const RUTA = '/insumos'

export async function obtenerInsumosAction() {
  return await InsumoRepositorio.obtenerTodos()
}

export async function crearInsumoAction(dto: CrearInsumoDTO) {
  if (dto.costo <= 0)
    throw new Error('El costo debe ser mayor a 0')

  if (dto.stock_semana < 0)
    throw new Error('El stock semanal no puede ser negativo')

  const insumo = await InsumoRepositorio.crear(dto)
  revalidatePath(RUTA)
  return insumo
}

export async function actualizarInsumoAction(id: string, dto: ActualizarInsumoDTO) {
  if (dto.costo !== undefined && dto.costo <= 0)
    throw new Error('El costo debe ser mayor a 0')

  const insumo = await InsumoRepositorio.actualizar(id, dto)
  revalidatePath(RUTA)
  return insumo
}

export async function actualizarStockSemanaAction(id: string, stock_semana: number) {
  if (stock_semana < 0)
    throw new Error('El stock semanal no puede ser negativo')

  const insumo = await InsumoRepositorio.actualizar(id, { stock_semana })
  revalidatePath(RUTA)
  return insumo
}

export async function eliminarInsumoAction(id: string) {
  await InsumoRepositorio.eliminar(id)
  revalidatePath(RUTA)
}