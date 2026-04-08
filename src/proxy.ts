// Proxy de Next.js para proteger rutas con autenticación de Supabase

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rutas accesibles sin autenticación
const RUTAS_PUBLICAS = ['/', '/auth/error']

// Ruta a la que se redirige para login
const RUTA_LOGIN = '/'

// Prefijo de rutas privadas que requieren autenticación
const RUTA_PRIVADA_BASE = '/lotes'

export async function proxy(request: NextRequest) {
  // Inicializa la respuesta permitiendo que la petición continúe
  let response = NextResponse.next({ request })

  // Se crea un cliente de Supabase en modo servidor
  // Se configuran cookies para mantener la sesión del usuario en SSR
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Obtiene el usuario autenticado desde Supabase
  // Si no existe, significa que no hay sesión activa
  const { data: { user } } = await supabase.auth.getUser()

  const ruta = request.nextUrl.pathname

  // Verifica si la ruta es pública
  const esRutaPublica = RUTAS_PUBLICAS.includes(ruta)

  // Si ya hay autenticacion y quiere ir al login → redirige a /lotes
  if (!user && ruta.startsWith(RUTA_PRIVADA_BASE)) {
    return NextResponse.redirect(new URL(RUTA_LOGIN, request.url))
  }

  // Si ya hay autenticacion y quiere ir al login → redirige a /lotes
  if (user && esRutaPublica) {
    return NextResponse.redirect(new URL(RUTA_PRIVADA_BASE, request.url))
  }

  return response
}

// Configuración del middleware:
// Se excluyen recursos innecesarios
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
