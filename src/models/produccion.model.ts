export interface Produccion {
  id:          string
  pan_id:      string
  fecha:       string
  producido:   number
  vendido:     number
  desperdicio: number  // calculado: producido - vendido
  costo:       number  // calculado: receta × costo insumos
  ganancia:    number  // calculado: vendido × precio - costo
  creado_en:   string
}

export type CrearProduccionDTO = {
  pan_id:    string
  fecha:     string
  producido: number
  vendido:   number
}

// Lo que llega desde la UI para registrar el día
export type RegistroDiario = {
  pan_id:    string
  producido: number
  vendido:   number
}

// Producción con el nombre del pan para mostrar en tablas
export interface ProduccionConPan extends Produccion {
  pan: { nombre: string; precio: number }
}