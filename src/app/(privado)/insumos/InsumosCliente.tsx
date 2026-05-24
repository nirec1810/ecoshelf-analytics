'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TablaInsumos } from '@/components/insumos/TablaInsumos'
import { FormularioInsumo } from '@/components/insumos/FormularioInsumo'
import type { Insumo } from '@/models/insumo.model'

interface Props { insumosIniciales: Insumo[] }

export function InsumosCliente({ insumosIniciales }: Props) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Insumo | undefined>(undefined)

  function abrirCrear() {
    setEditando(undefined)
    setModalAbierto(true)
  }

  function abrirEditar(insumo: Insumo) {
    setEditando(insumo)
    setModalAbierto(true)
  }

  function alCerrar() {
    setModalAbierto(false)
    setEditando(undefined)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{insumosIniciales.length} insumos registrados</p>
        <Button onClick={abrirCrear}>+ Nuevo Insumo</Button>
      </div>

      {insumosIniciales.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>No hay insumos registrados.</p>
          <Button onClick={abrirCrear} className="mt-4">Registrar primer insumo</Button>
        </div>
      ) : (
        <TablaInsumos insumos={insumosIniciales} onEditar={abrirEditar} />
      )}

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editando ? 'Editar Insumo' : 'Nuevo Insumo'}
            </DialogTitle>
          </DialogHeader>
          <FormularioInsumo insumoInicial={editando} onExito={alCerrar} />
        </DialogContent>
      </Dialog>
    </>
  )
}
