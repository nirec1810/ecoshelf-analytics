'use server'

import { revalidatePath }        from 'next/cache'
import { ProduccionRepositorio } from '@/models/produccion.repositorio'
import { RecetaRepositorio }     from '@/models/receta.repositorio'
import { PanRepositorio }        from '@/models/pan.repositorio'
import type { RegistroDiario }   from '@/models/produccion.model'

const RUTA = '/produccion'

// ── Calcula el costo de producción por unidad ──────────────────
async function calcularCostoPorUnidad(pan_id: string): Promise<number> {
  const receta = await RecetaRepositorio.obtenerPorPan(pan_id)
  return receta.reduce((total, r) => total + r.cantidad * r.insumo.costo, 0)
}

// ── Obtiene el registro del día actual ─────────────────────────
export async function obtenerProduccionHoyAction() {
  const hoy = new Date().toISOString().split('T')[0]
  return await ProduccionRepositorio.obtenerPorFecha(hoy)
}

// ── Obtiene historial por rango de fechas ──────────────────────
export async function obtenerHistorialAction(inicio: string, fin: string) {
  return await ProduccionRepositorio.obtenerPorRango(inicio, fin)
}

// ── Guarda el registro del día con campos calculados ───────────
export async function guardarProduccionAction(
  registros: RegistroDiario[],
  fecha:     string
) {
  if (registros.length === 0)
    throw new Error('Debe haber al menos un pan registrado')

  const resultados = await Promise.all(
    registros.map(async ({ pan_id, producido, vendido }) => {

      // Validaciones
      if (producido < 0) throw new Error('La cantidad producida no puede ser negativa')
      if (vendido < 0)   throw new Error('La cantidad vendida no puede ser negativa')
      if (vendido > producido) throw new Error('Lo vendido no puede superar lo producido')

      // Obtiene el pan para usar su precio
      const pan = await PanRepositorio.obtenerPorId(pan_id)
      if (!pan) throw new Error(`Pan no encontrado: ${pan_id}`)

      // ── Cálculos del core ──────────────────────────────────
      const costo_unidad  = await calcularCostoPorUnidad(pan_id)
      const desperdicio   = producido - vendido
      const costo         = Number((costo_unidad  * producido).toFixed(2))
      const ganancia      = Number((vendido * pan.precio - costo).toFixed(2))

      return ProduccionRepositorio.guardar({
        pan_id,
        fecha,
        producido,
        vendido,
        desperdicio,
        costo,
        ganancia,
      })
    })
  )

  revalidatePath(RUTA)
  return resultados
}