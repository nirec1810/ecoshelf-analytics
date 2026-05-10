export interface Receta {
  id:        string
  pan_id:    string
  insumo_id: string
  cantidad:  number
}

export type CrearRecetaDTO      = Omit<Receta, 'id'>
export type ActualizarRecetaDTO = Pick<Receta, 'cantidad'>

// Receta con datos del insumo para mostrar en la UI
export interface RecetaConInsumo extends Receta {
  insumo: {
    nombre: string
    unidad: string
    costo:  number
  }
}