'use client'

import { useState }        from 'react'
import { Button }          from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TablaPanes }      from '@/components/panes/TablaPanes'
import { FormularioPan }   from '@/components/panes/FormularioPan'
import type { PanConCosto } from '@/models/pan.model'

interface Props { panesIniciales: PanConCosto[] }

export function PanesCliente({ panesIniciales }: Props) {
  const [panes]        = useState<PanConCosto[]>(panesIniciales)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando,     setEditando]     = useState<PanConCosto | undefined>(undefined)

  function abrirCrear()              { setEditando(undefined); setModalAbierto(true) }
  function abrirEditar(p: PanConCosto) { setEditando(p);        setModalAbierto(true) }
  function alCerrar()                { setModalAbierto(false);  setEditando(undefined) }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{panes.length} panes registrados</p>
        <Button onClick={abrirCrear}>+ Nuevo Pan</Button>
      </div>

      {panes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-2">🍞</p>
          <p>No hay panes registrados.</p>
          <Button onClick={abrirCrear} className="mt-4">Registrar primer pan</Button>
        </div>
      ) : (
        <TablaPanes panes={panes} onEditar={abrirEditar} />
      )}

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editando ? '✏️ Editar Pan' : '➕ Nuevo Pan'}
            </DialogTitle>
          </DialogHeader>
          <FormularioPan panInicial={editando} onExito={alCerrar} />
        </DialogContent>
      </Dialog>
    </>
  )
}