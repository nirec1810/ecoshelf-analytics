// PATRÓN DE DISEÑO APLICADO: Facade
// MotorFacade es la única interfaz pública del subsistema de analytics.
// Oculta la existencia de MetricasServicio, SugerenciasServicio y

// Ventajas concretas:
//   - El controlador no sabe cuántos servicios existen internamente.
//   - Cambiar la composición interna (ej. agregar un CacheServicio) no afecta
//     a ningún consumidor.
//   - El método estático `crear()` actúa como factory conveniente con defaults.

import type { ResultadoMotor }         from '@/models/sugerencia.model'
import { CONFIG_DEFAULT, type MotorConfig } from './motor.config'
import { MetricasServicio }             from './metricas.servicio'
import { SugerenciasServicio }          from './sugerencias.servicio'
import { DistribucionServicio }         from './distribucion.servicio'
import {
  OrdenarPorGanancia,
  type IOrdenadorSugerencias,
} from './ordenador.strategy'

export class MotorFacade {
  private constructor(
    private readonly metricasServicio:    MetricasServicio,
    private readonly sugerenciasServicio: SugerenciasServicio,
    private readonly distribucionServicio: DistribucionServicio,
    private readonly config:             MotorConfig,
  ) {}

  // Factory method: construye la facade con config y strategy por defecto
  static crear(
    config:    MotorConfig            = CONFIG_DEFAULT,
    ordenador: IOrdenadorSugerencias  = new OrdenarPorGanancia(),
  ): MotorFacade {
    return new MotorFacade(
      new MetricasServicio(),
      new SugerenciasServicio(config, ordenador),
      new DistribucionServicio(),
      config,
    )
  }

  // Punto de entrada único para el subsistema de analytics
  async ejecutar(inicio: string, fin: string): Promise<ResultadoMotor> {
    const metricas = await this.metricasServicio.calcular(inicio, fin)

    if (metricas.length === 0) {
      return {
        semana_inicio:   inicio,
        semana_fin:      fin,
        metricas:        [],
        sugerencias:     [],
        distribucion:    [],
        ganancia_actual: 0,
        ganancia_est:    0,
        UMBRAL_DESPERDICIO: this.config.umbralDesperdicio,
        UMBRAL_DEMANDA:    this.config.umbralDemanda,
      }
    }

    const [sugerencias, distribucion] = await Promise.all([
      this.sugerenciasServicio.generar(metricas),
      this.distribucionServicio.calcular(metricas),
    ])

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
      UMBRAL_DESPERDICIO: this.config.umbralDesperdicio,
      UMBRAL_DEMANDA:    this.config.umbralDemanda,
    }
  }
}