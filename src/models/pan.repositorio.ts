import { createClient } from '@/lib/supabase/server'
import type { Pan, CrearPanDTO, ActualizarPanDTO } from './pan.model'

const TABLA = 'panes'

export const PanRepositorio = {
  async obtenerTodos(): Promise<Pan[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .select('*')
      .order('nombre', { ascending: true })

    if (error) throw new Error(error.message)
    return data
  },

  async obtenerActivos(): Promise<Pan[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true })

    if (error) throw new Error(error.message)
    return data
  },

  async obtenerPorId(id: string): Promise<Pan | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  },

  async crear(dto: CrearPanDTO): Promise<Pan> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .insert(dto)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async actualizar(id: string, dto: ActualizarPanDTO): Promise<Pan> {
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