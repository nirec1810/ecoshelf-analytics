'use server'

// ─────────────────────────────────────────────────────────────────────────────
// sugerencia.controlador.ts  (refactorizado)
//
// ANTES: importaba calcularResultadoMotor desde sugerencia.motor.ts,
// que era un archivo monolítico con 4 responsabilidades distintas.
//
// AHORA: usa MotorFacade — interfaz única y limpia del subsistema de analytics.
// El controlador no sabe nada de MetricasServicio, SugerenciasServicio, etc.
//
// Para cambiar la estrategia de ordenamiento solo hay que pasar otro ordenador:
//   MotorFacade.crear(CONFIG_DEFAULT, new OrdenarPorDesperdicioReducido())
// ─────────────────────────────────────────────────────────────────────────────

import { MotorFacade }     from '@/controllers/motor/motor.facade'
import type { ResultadoMotor } from '@/models/sugerencia.model'

export async function ejecutarMotorAction(
  inicio: string,
  fin: string,
): Promise<ResultadoMotor> {
  const motor = MotorFacade.crear()
  return motor.ejecutar(inicio, fin)
}