'use server'

import { calcularResultadoMotor } from './sugerencia.motor'
import type { ResultadoMotor } from '@/models/sugerencia.model'

export async function ejecutarMotorAction(
  inicio: string,
  fin: string
): Promise<ResultadoMotor> {
  return calcularResultadoMotor(inicio, fin)
}
