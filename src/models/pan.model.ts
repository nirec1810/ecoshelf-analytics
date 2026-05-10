export interface Pan {
  id:        string
  nombre:    string
  precio:    number
  activo:    boolean
  creado_en: string
}

export type CrearPanDTO      = Omit<Pan, 'id' | 'creado_en'>
export type ActualizarPanDTO = Partial<CrearPanDTO>

// Pan con su costo calculado desde la receta
export interface PanConCosto extends Pan {
  costo:  number   // suma(cantidad × costo_insumo)
  margen: number   // precio - costo
}