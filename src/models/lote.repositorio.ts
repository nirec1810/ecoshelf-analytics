import { createClient } from '@/lib/supabase/server'
import type { Lote, CrearLoteDTO, ActualizarLoteDTO } from './lote.model'

const TABLA = 'lotes'

export const LoteRepositorio = {
  async obtenerTodos(): Promise<Lote[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .select('*')
      .order('fecha_vencimiento', { ascending: true })

    if (error) throw new Error(error.message)
    return data
  },

  async obtenerPorId(id: string): Promise<Lote | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  },

  async crear(dto: CrearLoteDTO): Promise<Lote> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .insert(dto)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async actualizar(id: string, dto: ActualizarLoteDTO): Promise<Lote> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .update(dto)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async eliminar(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from(TABLA)
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  },
}