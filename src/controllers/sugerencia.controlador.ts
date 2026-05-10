'use server'

import { ProduccionRepositorio } from '@/models/produccion.repositorio'
import { RecetaRepositorio }     from '@/models/receta.repositorio'
import { InsumoRepositorio }     from '@/models/insumo.repositorio'
import { PanRepositorio }        from '@/models/pan.repositorio'
import type {
  MetricaPan, Sugerencia,
  DistribucionPan, ResultadoMotor
} from '@/models/sugerencia.model'

// ── Umbrales del motor ─────────────────────────────────────────
const UMBRAL_DESPERDICIO = 0.20   // 20% → pan con exceso
const UMBRAL_DEMANDA     = 0.85   // 85% → pan en demanda

// ── 1. Calcula métricas por pan ────────────────────────────────
async function calcularMetricas(
  inicio: string,
  fin:    string
): Promise<MetricaPan[]> {

  const [agrupado, panes] = await Promise.all([
    ProduccionRepositorio.obtenerAgrupado(inicio, fin),
    PanRepositorio.obtenerActivos(),
  ])

  const metricas = await Promise.all(
    agrupado.map(async fila => {
      const pan    = panes.find(p => p.id === fila.pan_id)
      if (!pan) return null

      const receta = await RecetaRepositorio.obtenerPorPan(fila.pan_id)
      const costo  = receta.reduce((t, r) => t + r.cantidad * r.insumo.costo, 0)
      const margen = Number((pan.precio - costo).toFixed(4))

      const pct_venta = fila.producido > 0
        ? Number((fila.vendido / fila.producido).toFixed(4))
        : 0

      const pct_desp = fila.producido > 0
        ? Number((fila.desperdicio / fila.producido).toFixed(4))
        : 0

      return {
        pan_id:      pan.id,
        nombre:      pan.nombre,
        precio:      pan.precio,
        margen,
        producido:   fila.producido,
        vendido:     fila.vendido,
        desperdicio: fila.desperdicio,
        pct_venta,
        pct_desp,
      } as MetricaPan
    })
  )

  return metricas.filter(Boolean) as MetricaPan[]
}

// ── 2. Calcula insumos liberados al reducir un pan ─────────────
async function calcularInsumosLibres(
  pan_id:  string,
  reducir: number
): Promise<Sugerencia['insumos_libres']> {

  const receta = await RecetaRepositorio.obtenerPorPan(pan_id)

  return receta.map(r => ({
    insumo_id: r.insumo_id,
    nombre:    r.insumo.nombre,
    unidad:    r.insumo.unidad,
    cantidad:  Number((r.cantidad * reducir).toFixed(4)),
  }))
}

// ── 3. Calcula cuántos extras se pueden hacer con insumos libres
async function calcularExtras(
  pan_demanda_id: string,
  insumosLibres:  Sugerencia['insumos_libres']
): Promise<number> {

  const receta = await RecetaRepositorio.obtenerPorPan(pan_demanda_id)
  if (receta.length === 0) return 0

  // Para cada ingrediente de la receta del pan en demanda,
  // calcula cuántas unidades se pueden hacer con lo liberado
  const posibles = receta.map(r => {
    const libre = insumosLibres.find(il => il.insumo_id === r.insumo_id)
    if (!libre || r.cantidad === 0) return Infinity
    return Math.floor(libre.cantidad / r.cantidad)
  })

  // El limitante es el ingrediente que alcanza para menos unidades
  const extras = Math.min(...posibles)
  return extras === Infinity ? 0 : extras
}

// ── 4. Genera sugerencias comparando exceso vs demanda ────────
async function generarSugerencias(metricas: MetricaPan[]): Promise<Sugerencia[]> {
  const panesExceso   = metricas.filter(m => m.pct_desp  >  UMBRAL_DESPERDICIO)
  const panesDemanda  = metricas.filter(m => m.pct_venta >= UMBRAL_DEMANDA)

  if (panesExceso.length === 0 || panesDemanda.length === 0) return []

  const sugerencias: Sugerencia[] = []

  for (const exceso of panesExceso) {
    // Cuánto reducir: el exceso promedio diario (redondeado hacia abajo)
    const reducir = Math.floor(exceso.desperdicio / 7)
    if (reducir === 0) continue

    const insumosLibres = await calcularInsumosLibres(exceso.pan_id, reducir)

    for (const demanda of panesDemanda) {
      if (demanda.pan_id === exceso.pan_id) continue

      const extras = await calcularExtras(demanda.pan_id, insumosLibres)
      if (extras === 0) continue

      const ganancia_estimada = Number((extras * demanda.margen).toFixed(2))

      sugerencias.push({
        pan_exceso:        exceso,
        pan_demanda:       demanda,
        reducir,
        extras,
        ganancia_estimada,
        insumos_libres:    insumosLibres,
      })
    }
  }

  // Ordena por ganancia estimada descendente
  return sugerencias.sort((a, b) => b.ganancia_estimada - a.ganancia_estimada)
}

// ── 5. Distribuye el stock semanal entre los panes activos ─────
async function distribuirStock(metricas: MetricaPan[]): Promise<DistribucionPan[]> {
  const insumos  = await InsumoRepositorio.obtenerTodos()
  const resultado: DistribucionPan[] = []

  // Para cada insumo con stock disponible
  for (const insumo of insumos) {
    if (insumo.stock_semana <= 0) continue

    // Panes que usan este insumo, ordenados por % venta descendente
    const panesConInsumo: { metrica: MetricaPan; cantidad_receta: number }[] = []

    for (const metrica of metricas) {
      const receta = await RecetaRepositorio.obtenerPorPan(metrica.pan_id)
      const rInsumo = receta.find(r => r.insumo_id === insumo.id)
      if (rInsumo) {
        panesConInsumo.push({ metrica, cantidad_receta: rInsumo.cantidad })
      }
    }

    // Ordena: primero los de mayor % venta (más rentables de producir)
    panesConInsumo.sort((a, b) => b.metrica.pct_venta - a.metrica.pct_venta)

    // Distribuye el stock proporcionalmente según % venta
    const totalPct = panesConInsumo.reduce((s, p) => s + p.metrica.pct_venta, 0)
    let stockRestante = insumo.stock_semana

    for (const { metrica, cantidad_receta } of panesConInsumo) {
      if (stockRestante <= 0) break

      const proporcion  = totalPct > 0 ? metrica.pct_venta / totalPct : 1 / panesConInsumo.length
      const asignado    = Number((insumo.stock_semana * proporcion).toFixed(3))
      const produccionEst = cantidad_receta > 0 ? Math.floor(asignado / cantidad_receta) : 0
      const gananciaEst   = Number((produccionEst * metrica.margen).toFixed(2))

      stockRestante = Number((stockRestante - asignado).toFixed(3))

      resultado.push({
        pan_id:         metrica.pan_id,
        nombre:         metrica.nombre,
        insumo_id:      insumo.id,
        nombre_insumo:  insumo.nombre,
        unidad:         insumo.unidad,
        asignado,
        produccion_est: produccionEst,
        ganancia_est:   gananciaEst,
      })
    }
  }

  return resultado
}

// ── ACCIÓN PRINCIPAL — el admin la lanza manualmente ──────────
export async function ejecutarMotorAction(
  inicio: string,
  fin:    string
): Promise<ResultadoMotor> {

  // Paso 1 — métricas de la semana
  const metricas = await calcularMetricas(inicio, fin)

  if (metricas.length === 0) {
    return {
      semana_inicio:   inicio,
      semana_fin:      fin,
      metricas:        [],
      sugerencias:     [],
      distribucion:    [],
      ganancia_actual: 0,
      ganancia_est:    0,
    }
  }

  // Paso 2 — comparaciones y sugerencias
  const [sugerencias, distribucion] = await Promise.all([
    generarSugerencias(metricas),
    distribuirStock(metricas),
  ])

  // Paso 3 — ganancia real vs estimada
  const ganancia_actual = Number(
    metricas.reduce((t, m) => t + m.vendido * m.precio, 0).toFixed(2)
  )

  const ganancia_est = Number(
    (ganancia_actual + sugerencias.reduce((t, s) => t + s.ganancia_estimada, 0)).toFixed(2)
  )

  return {
    semana_inicio: inicio,
    semana_fin:    fin,
    metricas,
    sugerencias,
    distribucion,
    ganancia_actual,
    ganancia_est,
  }
}