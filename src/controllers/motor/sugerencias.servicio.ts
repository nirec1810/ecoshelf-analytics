// PRINCIPIOS Y PATRONES APLICADOS:
//   - SRP: Solo se encarga de generar y ordenar sugerencias.
//   - OCP: Recibe MotorConfig; no hardcodea los umbrales.
//   - Strategy: Delega el ordenamiento a IOrdenadorSugerencias.

import { RecetaRepositorio }         from '@/models/receta.repositorio'
import type { MetricaPan, Sugerencia } from '@/models/sugerencia.model'
import type { MotorConfig }            from './motor.config'
import type { IOrdenadorSugerencias }  from './ordenador.strategy'

export class SugerenciasServicio {
  constructor(
    private readonly config:   MotorConfig,
    private readonly ordenador: IOrdenadorSugerencias,
  ) {}

  async generar(metricas: MetricaPan[]): Promise<Sugerencia[]> {
    // OCP: umbrales vienen de la config inyectada, no están escritos aquí
    const panesExceso   = metricas.filter(m => m.pct_desp  >  this.config.umbralDesperdicio)
    const panesDemanda  = metricas.filter(m => m.pct_venta >= this.config.umbralDemanda)

    if (panesExceso.length === 0 || panesDemanda.length === 0) return []

    const sugerencias: Sugerencia[] = []

    for (const exceso of panesExceso) {
      const reducir = Math.floor(exceso.desperdicio / 7)
      if (reducir === 0) continue

      const insumosLibres = await this.calcularInsumosLibres(exceso.pan_id, reducir)

      for (const demanda of panesDemanda) {
        if (demanda.pan_id === exceso.pan_id) continue

        const extras = await this.calcularExtras(demanda.pan_id, insumosLibres)
        if (extras === 0) continue

        sugerencias.push({
          pan_exceso:        exceso,
          pan_demanda:       demanda,
          reducir,
          extras,
          ganancia_estimada: Number((extras * demanda.margen).toFixed(2)),
          insumos_libres:    insumosLibres,
        })
      }
    }

    // Strategy: el ordenamiento es intercambiable sin tocar esta clase
    return this.ordenador.ordenar(sugerencias)
  }

  private async calcularInsumosLibres(
    pan_id: string,
    reducir: number,
  ): Promise<Sugerencia['insumos_libres']> {
    const receta = await RecetaRepositorio.obtenerPorPan(pan_id)
    return receta.map(r => ({
      insumo_id: r.insumo_id,
      nombre:    r.insumo.nombre,
      unidad:    r.insumo.unidad,
      cantidad:  Number((r.cantidad * reducir).toFixed(4)),
    }))
  }

  private async calcularExtras(
    pan_demanda_id: string,
    insumosLibres: Sugerencia['insumos_libres'],
  ): Promise<number> {
    const receta = await RecetaRepositorio.obtenerPorPan(pan_demanda_id)
    if (receta.length === 0) return 0

    const posibles = receta.map(r => {
      const libre = insumosLibres.find(il => il.insumo_id === r.insumo_id)
      if (!libre || r.cantidad === 0) return Infinity
      return Math.floor(libre.cantidad / r.cantidad)
    })

    const extras = Math.min(...posibles)
    return extras === Infinity ? 0 : extras
  }
}