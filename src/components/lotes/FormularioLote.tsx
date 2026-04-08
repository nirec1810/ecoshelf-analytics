'use client'

import { useState } from 'react'
import { crearLoteAction, actualizarLoteAction } from '@/controllers/lote.controlador'
import type { Lote, CrearLoteDTO, EstadoLote } from '@/models/lote.model'

interface Props {
  loteInicial?: Lote
  onExito: () => void
}

const estadosDisponibles: EstadoLote[] = [
  'disponible', 'reservado', 'vendido', 'donado', 'desperdicio',
]

const categorias = [
  'Lácteos', 'Panadería', 'Frutas y Verduras',
  'Carnes', 'Bebidas', 'Congelados', 'Otros',
]

export function FormularioLote({ loteInicial, onExito }: Props) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [campos, setCampos] = useState<CrearLoteDTO>({
    nombre:            loteInicial?.nombre             ?? '',
    categoria:         loteInicial?.categoria          ?? '',
    cantidad:          loteInicial?.cantidad           ?? 1,
    precio_original:   loteInicial?.precio_original    ?? 0,
    precio_descuento:  loteInicial?.precio_descuento   ?? null,
    fecha_vencimiento: loteInicial?.fecha_vencimiento
      ? new Date(loteInicial.fecha_vencimiento).toISOString().slice(0, 16)
      : '',
    estado:            loteInicial?.estado             ?? 'disponible',
  })

  function actualizarCampo<K extends keyof CrearLoteDTO>(clave: K, valor: CrearLoteDTO[K]) {
    setCampos((prev) => ({ ...prev, [clave]: valor }))
  }

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault() // Evita recarga de página
    setError(null)
    setCargando(true)

    try {
      if (loteInicial) {
        await actualizarLoteAction(loteInicial.id, campos)
      } else {
        await crearLoteAction(campos)
      }
      onExito()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error')
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={manejarEnvio}>
      {/* Nombre */}
      <div>
        <label>Nombre del producto:</label>
        <input
          type="text"
          value={campos.nombre}
          onChange={(e) => actualizarCampo('nombre', e.target.value)}
          required
        />
      </div>

      {/* Categoría */}
      <div>
        <label>Categoría:</label>
        <select 
          value={campos.categoria} 
          onChange={(e) => actualizarCampo('categoria', e.target.value)}
          required
        >
          <option value="">Selecciona...</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Cantidad */}
      <div>
        <label>Cantidad:</label>
        <input
          type="number"
          min={1}
          value={campos.cantidad}
          onChange={(e) => actualizarCampo('cantidad', Number(e.target.value))}
        />
      </div>

      {/* Precio Original */}
      <div>
        <label>Precio original ($):</label>
        <input
          type="number"
          min={0}
          step="0.01"
          value={campos.precio_original}
          onChange={(e) => actualizarCampo('precio_original', Number(e.target.value))}
        />
      </div>

      {/* Precio Descuento */}
      <div>
        <label>Precio descuento ($):</label>
        <input
          type="number"
          min={0}
          step="0.01"
          value={campos.precio_descuento ?? ''}
          onChange={(e) =>
            actualizarCampo('precio_descuento', e.target.value ? Number(e.target.value) : null)
          }
        />
      </div>

      {/* Fecha Vencimiento */}
      <div>
        <label>Vencimiento:</label>
        <input
          type="datetime-local"
          value={campos.fecha_vencimiento}
          onChange={(e) => actualizarCampo('fecha_vencimiento', e.target.value)}
          required
        />
      </div>

      {/* Estado */}
      <div>
        <label>Estado:</label>
        <select 
          value={campos.estado} 
          onChange={(e) => actualizarCampo('estado', e.target.value as EstadoLote)}
        >
          {estadosDisponibles.map((est) => (
            <option key={est} value={est}>{est}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Botón de envío */}
      <div style={{ marginTop: '1rem' }}>
        <button type="submit" disabled={cargando}>
          {cargando ? 'Guardando...' : loteInicial ? 'Actualizar Lote' : 'Crear Lote'}
        </button>
      </div>
    </form>
  )
}