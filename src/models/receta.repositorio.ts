import { createClient } from '@/lib/supabase/server'
import type { Receta, CrearRecetaDTO, ActualizarRecetaDTO, RecetaConInsumo } from './receta.model'

const TABLA = 'recetas'

export const RecetaRepositorio = {
  // Obtiene la receta completa de un pan con datos del insumo
  async obtenerPorPan(pan_id: string): Promise<RecetaConInsumo[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .select(`
        id,
        pan_id,
        insumo_id,
        cantidad,
        insumo:insumos (
          nombre,
          unidad,
          costo
        )
      `)
      .eq('pan_id', pan_id)

    if (error) throw new Error(error.message)
    return data as unknown as RecetaConInsumo[]
  },

  async agregar(dto: CrearRecetaDTO): Promise<Receta> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLA)
      .insert(dto)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async actualizar(id: string, dto: ActualizarRecetaDTO): Promise<Receta> {
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