'use client'

import Link                  from 'next/link'
import { usePathname }       from 'next/navigation'
import { Button }            from '@/components/ui/button'
import { cerrarSesionAction } from '@/controllers/auth.controlador'
import { isRedirectError }   from 'next/dist/client/components/redirect-error'

const ENLACES = [
  { href: '/dashboard',  label: 'Dashboard' },
  { href: '/insumos',    label: 'Insumos' },
  { href: '/panes',      label: 'Panes' },
  { href: '/produccion', label: 'Producción' },
  { href: '/sugerencias',label: 'Sugerencias' },
]

export function Navbar() {
  const pathname = usePathname()

  async function manejarCerrarSesion() {
    try {
      await cerrarSesionAction()
    } catch (err) {
      if (isRedirectError(err)) throw err
    }
  }

  return (
    <nav className="bg-yellow-800 text-white px-6 h-12 flex items-center gap-6 sticky top-0 z-50">
      <span className="font-bold text-base mr-2">EcoshelfAnalytics</span>

      <div className="flex items-center gap-1 flex-1">
        {ENLACES.map(({ href, label }) => {
          const activo = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`
                px-3 py-1 rounded text-sm transition-colors
                ${activo
                  ? 'bg-yellow-900 text-white font-semibold'
                  : 'text-white-200 hover:text-white hover:bg-yellow-900'
                }
              `}
            >
              {label}
            </Link>
          )
        })}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={manejarCerrarSesion}
        className="text-gray-200 hover:text-white hover:bg-yellow-900 text-xs"
      >
        Cerrar sesión
      </Button>
    </nav>
  )
}