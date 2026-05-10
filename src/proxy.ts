import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const RUTAS_PUBLICAS   = ['/']
const RUTA_LOGIN       = '/'
const RUTAS_PRIVADAS   = ['/dashboard', '/insumos', '/panes', '/produccion', '/sugerencias']

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

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

  const { data: { user } } = await supabase.auth.getUser()
  const ruta = request.nextUrl.pathname

  const esPrivada = RUTAS_PRIVADAS.some(r => ruta.startsWith(r))
  const esPublica = RUTAS_PUBLICAS.includes(ruta)

  // Sin sesión intentando entrar a ruta privada → login
  if (!user && esPrivada) {
    return NextResponse.redirect(new URL(RUTA_LOGIN, request.url))
  }

  // Con sesión intentando ir al login → dashboard
  if (user && esPublica) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}