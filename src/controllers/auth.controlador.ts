'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function iniciarSesionAction(correo: string, contrasena: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: contrasena,
  })

  if (error) {
    throw new Error('Correo o contraseña incorrectos')
  }

  revalidatePath('/', 'layout')
  redirect('/lotes')
}

export async function cerrarSesionAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}