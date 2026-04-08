'use client'

import { useState } from 'react'
import { TablaLotes } from '@/components/lotes/TablaLotes'
import { FormularioLote } from '@/components/lotes/FormularioLote'
import type { Lote } from '@/models/lote.model'

interface Props {
  lotesIniciales: Lote[]
}

export function LotesCliente({ lotesIniciales }: Props) {
  const [lotes] = useState<Lote[]>(lotesIniciales)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [loteEditando, setLoteEditando] = useState<Lote | undefined>(undefined)

  const abrirCrear = () => { setLoteEditando(undefined); setModalAbierto(true); }
  const abrirEditar = (lote: Lote) => { setLoteEditando(lote); setModalAbierto(true); }
  const alCerrar = () => { setModalAbierto(false); setLoteEditando(undefined); }

  return (
    <div>
      {/* Header funcional */}
      <div>
        <span>{lotes.length} lotes registrados</span>
        <button onClick={abrirCrear}>+ Nuevo Lote</button>
      </div>

      {lotes.length === 0 ? (
        <div>
          <p>No hay lotes registrados aún.</p>
          <button onClick={abrirCrear}>Registrar primer lote</button>
        </div>
      ) : (
        <TablaLotes lotes={lotes} onEditar={abrirEditar} />
      )}

      {modalAbierto && (
        <div style={{ border: '1px solid black', padding: '20px', marginTop: '20px' }}>
          <h3>{loteEditando ? 'Editar Lote' : 'Nuevo Lote'}</h3>
          <FormularioLote
            loteInicial={loteEditando}
            onExito={alCerrar}
          />
          <button onClick={alCerrar}>Cerrar</button>
        </div>
      )}
    </div>
  )
}