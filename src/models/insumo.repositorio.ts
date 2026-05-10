import { createClient } from '@/lib/supabase/server'
import type { Insumo, CrearInsumoDTO, ActualizarInsumoDTO } from './insumo.model'

const TABLA = 'insumos'

export const InsumoRepositorio = {
  async obtenerTodos(): Promise<Insumo[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .select('*')
      .order('nombre', { ascending: true })

    if (error) throw new Error(error.message)
    return data
  },

  async obtenerPorId(id: string): Promise<Insumo | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  },

  async crear(dto: CrearInsumoDTO): Promise<Insumo> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .insert(dto)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async actualizar(id: string, dto: ActualizarInsumoDTO): Promise<Insumo> {
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