'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { iniciarSesionAction } from '@/controllers/auth.controlador'
import { isRedirectError } from 'next/dist/client/components/redirect-error'


export function FormularioLogin() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function manejarEnvio() {
    setError(null)
    setCargando(true)

    try {
      await iniciarSesionAction(correo, contrasena)
    } catch (err) {
      if (isRedirectError(err)) throw err
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">

      <div className="flex flex-col gap-1">
        <Label>Correo electrónico</Label>
        <Input
          type="email"
          placeholder="admin@ecoshelf.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label>Contraseña</Label>
        <Input
          type="password"
          placeholder="••••••••"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          ⚠️ {error}
        </div>
      )}

      <Button
        onClick={manejarEnvio}
        disabled={cargando}
        className="w-full"
      >
        {cargando ? 'Ingresando...' : 'Ingresar'}
      </Button>

    </div>
  )
}