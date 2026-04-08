export type EstadoLote =
  | 'disponible'
  | 'reservado'
  | 'vendido'
  | 'donado'
  | 'desperdicio'

export interface Lote {
  id: string
  nombre: string
  categoria: string
  cantidad: number
  precio_original: number
  precio_descuento: number | null
  fecha_vencimiento: string
  estado: EstadoLote
  creado_en: string
  actualizado_en: string
}

export type CrearLoteDTO = Omit<Lote, 'id' | 'creado_en' | 'actualizado_en'>

export type ActualizarLoteDTO = Partial<CrearLoteDTO>