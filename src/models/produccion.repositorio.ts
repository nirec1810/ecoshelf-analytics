import { createClient } from '@/lib/supabase/server'
import type { Produccion, ProduccionConPan } from './produccion.model'

const TABLA = 'produccion'

export const ProduccionRepositorio = {
  async obtenerPorFecha(fecha: string): Promise<ProduccionConPan[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .select(`
        *,
        pan:panes ( nombre, precio )
      `)
      .eq('fecha', fecha)
      .order('creado_en', { ascending: true })

    if (error) throw new Error(error.message)
    return data as ProduccionConPan[]
  },

  async obtenerPorRango(inicio: string, fin: string): Promise<ProduccionConPan[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .select(`
        *,
        pan:panes ( nombre, precio )
      `)
      .gte('fecha', inicio)
      .lte('fecha', fin)
      .order('fecha', { ascending: false })

    if (error) throw new Error(error.message)
    return data as ProduccionConPan[]
  },

  // Para el motor de sugerencias — agrupa por pan en un rango
  async obtenerAgrupado(inicio: string, fin: string): Promise<{
    pan_id:      string
    producido:   number
    vendido:     number
    desperdicio: number
  }[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .select('pan_id, producido, vendido, desperdicio')
      .gte('fecha', inicio)
      .lte('fecha', fin)

    if (error) throw new Error(error.message)

    // Agrupa en TypeScript sumando por pan_id
    const mapa = new Map<string, { pan_id: string; producido: number; vendido: number; desperdicio: number }>()

    for (const fila of data) {
      const actual = mapa.get(fila.pan_id) ?? { pan_id: fila.pan_id, producido: 0, vendido: 0, desperdicio: 0 }
      mapa.set(fila.pan_id, {
        pan_id:      fila.pan_id,
        producido:   actual.producido   + fila.producido,
        vendido:     actual.vendido     + fila.vendido,
        desperdicio: actual.desperdicio + fila.desperdicio,
      })
    }

    return Array.from(mapa.values())
  },

  async guardar(registro: Omit<Produccion, 'id' | 'creado_en'>): Promise<Produccion> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .upsert(registro, { onConflict: 'pan_id,fecha' })  // actualiza si ya existe
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },
}