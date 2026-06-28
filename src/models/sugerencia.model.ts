// Métricas calculadas por pan para la semana analizada
export interface MetricaPan {
  pan_id:       string
  nombre:       string
  precio:       number
  margen:       number       // precio - costo_unidad
  producido:    number
  vendido:      number
  desperdicio:  number
  pct_venta:    number       // vendido / producido
  pct_desp:     number       // desperdicio / producido
}

// Resultado del motor para un par de panes
export interface Sugerencia {
  pan_exceso:          MetricaPan
  pan_demanda:         MetricaPan
  reducir:             number     // unidades a reducir del pan_exceso
  extras:              number     // unidades adicionales posibles del pan_demanda
  ganancia_estimada:   number     // extras × margen_pan_demanda
  insumos_libres: {
    insumo_id: string
    nombre:    string
    unidad:    string
    cantidad:  number            // cantidad liberada al reducir
  }[]
}

// Distribución de stock por pan
export interface DistribucionPan {
  pan_id:           string
  nombre:           string
  insumo_id:        string
  nombre_insumo:    string
  unidad:           string
  asignado:         number       // stock asignado a este pan
  produccion_est:   number       // unidades que se pueden producir
  ganancia_est:     number       // produccion_est × margen
}

// Resultado completo del motor
export interface ResultadoMotor {
  semana_inicio:   string
  semana_fin:      string
  UMBRAL_DESPERDICIO: number
  UMBRAL_DEMANDA: number
  metricas:        MetricaPan[]
  sugerencias:     Sugerencia[]
  distribucion:    DistribucionPan[]
  ganancia_actual: number        // ganancia real de la semana analizada
  ganancia_est:    number        // ganancia estimada si se aplican sugerencias
}