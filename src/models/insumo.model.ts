export type Unidad = 'kg' | 'lt' | 'u'

export interface Insumo {
  id:           string
  nombre:       string
  unidad:       Unidad
  costo:        number
  stock:        number
  stock_semana: number
  creado_en:    string
}

export type CrearInsumoDTO    = Omit<Insumo, 'id' | 'creado_en'>
export type ActualizarInsumoDTO = Partial<CrearInsumoDTO>