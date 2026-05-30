'use server'

import { revalidatePath }  from 'next/cache'
import { PanRepositorio }  from '@/models/pan.repositorio'
import { RecetaRepositorio } from '@/models/receta.repositorio'
import type { CrearPanDTO, ActualizarPanDTO, PanConCosto } from '@/models/pan.model'
import { calcularCostoReceta, calcularMargenPan, redondearCostoUnidad } from '@/lib/calculos'

const RUTA = '/panes'

export async function obtenerPanesAction() {
  return await PanRepositorio.obtenerTodos()
}

export async function obtenerPanesConCostoAction(): Promise<PanConCosto[]> {
  const panes = await PanRepositorio.obtenerTodos()

  const panesConCosto = await Promise.all(
    panes.map(async pan => {
      const receta = await RecetaRepositorio.obtenerPorPan(pan.id)
      const costo  = calcularCostoReceta(receta)
      return {
        ...pan,
        costo:  redondearCostoUnidad(costo),
        margen: calcularMargenPan(pan.precio, costo),
      }
    })
  )

  return panesConCosto
}

export async function crearPanAction(dto: CrearPanDTO) {
  if (dto.precio <= 0)
    throw new Error('El precio debe ser mayor a 0')

  const pan = await PanRepositorio.crear(dto)
  revalidatePath(RUTA)
  return pan
}

export async function actualizarPanAction(id: string, dto: ActualizarPanDTO) {
  if (dto.precio !== undefined && dto.precio <= 0)
    throw new Error('El precio debe ser mayor a 0')

  const pan = await PanRepositorio.actualizar(id, dto)
  revalidatePath(RUTA)
  return pan
}

export async function toggleActivoAction(id: string, activo: boolean) {
  const pan = await PanRepositorio.actualizar(id, { activo })
  revalidatePath(RUTA)
  return pan
}

export async function eliminarPanAction(id: string) {
  await PanRepositorio.eliminar(id)
  revalidatePath(RUTA)
}
