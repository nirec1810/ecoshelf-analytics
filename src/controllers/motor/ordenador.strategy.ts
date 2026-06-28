// PATRÓN DE DISEÑO APLICADO: Strategy
// IOrdenadorSugerencias define el contrato. Cada estrategia concreta
// encapsula su propio algoritmo de ordenamiento. El motor recibe la estrategia
// como dependencia — no sabe ni le importa cuál se usa.
//
// Estrategias disponibles:
//   - OrdenarPorGanancia       → sugerencias que maximizan ingreso primero
//   - OrdenarPorDesperdicioReducido → sugerencias que más reducen merma primero

import type { Sugerencia } from '@/models/sugerencia.model'

// Contrato de la Strategy
export interface IOrdenadorSugerencias {
  ordenar(sugerencias: Sugerencia[]): Sugerencia[]
}

// Estrategia 1: Maximizar ganancia estimada (comportamiento original)
export class OrdenarPorGanancia implements IOrdenadorSugerencias {
  ordenar(sugerencias: Sugerencia[]): Sugerencia[] {
    return [...sugerencias].sort((a, b) => b.ganancia_estimada - a.ganancia_estimada)
  }
}

// Estrategia 2: Priorizar la mayor reducción de desperdicio (nueva capacidad)
export class OrdenarPorDesperdicioReducido implements IOrdenadorSugerencias {
  ordenar(sugerencias: Sugerencia[]): Sugerencia[] {
    return [...sugerencias].sort((a, b) => b.reducir - a.reducir)
  }
}