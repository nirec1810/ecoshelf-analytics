'use server'

import { revalidatePath }  from 'next/cache'
import { PanRepositorio }  from '@/models/pan.repositorio'
import { RecetaRepositorio } from '@/models/receta.repositorio'
import type { CrearPanDTO, ActualizarPanDTO, PanConCosto } from '@/models/pan.model'

const RUTA = '/panes'

// Calcula el costo por unidad sumando (cantidad × costo) de cada ingrediente
function calcularCosto(receta: { cantidad: number; insumo: { costo: number } }[]): number {
  return receta.reduce((total, r) => total + r.cantidad * r.insumo.costo, 0)
}

export async function obtenerPanesAction() {
  return await PanRepositorio.obtenerTodos()
}

export async function obtenerPanesConCostoAction(): Promise<PanConCosto[]> {
  const panes = await PanRepositorio.obtenerTodos()

  const panesConCosto = await Promise.all(
    panes.map(async pan => {
      const receta = await RecetaRepositorio.obtenerPorPan(pan.id)
      const costo  = calcularCosto(receta)
      return {
        ...pan,
        costo:  Number(costo.toFixed(4)),
        margen: Number((pan.precio - costo).toFixed(4)),
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