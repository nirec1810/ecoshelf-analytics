'use client'

import { useState }          from 'react'
import { Button }            from '@/components/ui/button'
import { Input }             from '@/components/ui/input'
import { Label }             from '@/components/ui/label'
import { TablaHistorial }    from '@/components/produccion/TablaHistorial'
import { obtenerHistorialAction } from '@/controllers/produccion.controlador'
import type { ProduccionConPan }  from '@/models/produccion.model'

interface Props {
  inicioDefault: string
  finDefault:    string
}

export function HistorialCliente({ inicioDefault, finDefault }: Props) {
  const [inicio,    setInicio]    = useState(inicioDefault)
  const [fin,       setFin]       = useState(finDefault)
  const [registros, setRegistros] = useState<ProduccionConPan[]>([])
  const [cargando,  setCargando]  = useState(false)
  const [buscado,   setBuscado]   = useState(false)

  async function manejarBuscar() {
    setCargando(true)
    try {
      const data = await obtenerHistorialAction(inicio, fin)
      setRegistros(data)
      setBuscado(true)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex gap-4 items-end flex-wrap">
          <div className="flex flex-col gap-1">
            <Label>Fecha inicio</Label>
            <Input
              type="date"
              value={inicio}
              onChange={e => setInicio(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Fecha fin</Label>
            <Input
              type="date"
              value={fin}
              onChange={e => setFin(e.target.value)}
              className="w-40"
            />
          </div>
          <Button onClick={manejarBuscar} disabled={cargando}>
            {cargando ? 'Buscando...' : 'Filtrar'}
          </Button>
        </div>
      </div>

      {buscado && (
        <div className="bg-white border border-gray-200 rounded-xl p-2">
          <TablaHistorial registros={registros} />
        </div>
      )}
    </div>
  )
}