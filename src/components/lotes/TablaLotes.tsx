'use client'

import { eliminarLoteAction } from '@/controllers/lote.controlador'
import type { Lote } from '@/models/lote.model'

interface Props {
  lotes: Lote[]
  onEditar: (lote: Lote) => void
}

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-EC', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency', currency: 'USD',
  }).format(precio)
}

function esCritico(fechaVencimiento: string): boolean {
  const horasRestantes =
    (new Date(fechaVencimiento).getTime() - Date.now()) / (1000 * 60 * 60)
  return horasRestantes <= 24 && horasRestantes > 0
}

export function TablaLotes({ lotes, onEditar }: Props) {
  async function manejarEliminar(id: string) {
    if (!confirm('¿Estás seguro de eliminar este lote?')) return
    await eliminarLoteAction(id)
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '1px solid black' }}>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Cantidad</th>
          <th>Precio Original</th>
          <th>Precio Descuento</th>
          <th>Vence</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {lotes.map((lote) => {
          const critico = esCritico(lote.fecha_vencimiento)
          
          return (
            <tr 
              key={lote.id} 
              style={{ 
                borderBottom: '1px solid #ccc',
                backgroundColor: critico ? '#fee2e2' : 'transparent' 
              }}
            >
              <td>
                {lote.nombre}
                {critico && <strong style={{ color: 'red', marginLeft: '5px' }}>⚠️ CRÍTICO</strong>}
              </td>
              <td>{lote.categoria}</td>
              <td>{lote.cantidad}</td>
              <td>{formatearPrecio(lote.precio_original)}</td>
              <td>
                {lote.precio_descuento
                  ? formatearPrecio(lote.precio_descuento)
                  : 'Sin descuento'
                }
              </td>
              <td>{formatearFecha(lote.fecha_vencimiento)}</td>
              <td>{lote.estado}</td>
              <td>
                <button onClick={() => onEditar(lote)}>Editar</button>
                <button 
                  onClick={() => manejarEliminar(lote.id)}
                  style={{ marginLeft: '5px', color: 'red' }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}