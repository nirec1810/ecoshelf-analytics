import { Badge } from '@/components/ui/badge'
import type { Sugerencia } from '@/models/sugerencia.model'
import { monedaDecimal, proporcionTexto } from '@/lib/formatos'

interface Props { sugerencia: Sugerencia }

export function TarjetaSugerencia({ sugerencia }: Props) {
  const { pan_exceso, pan_demanda, reducir, extras, ganancia_estimada, insumos_libres } = sugerencia

  return (
    <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-lg p-4 flex flex-col gap-2">

      {/* Encabezado */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="destructive">
          ↘ {pan_exceso.nombre} · {proporcionTexto(pan_exceso.pct_desp)} desperdicio
        </Badge>
        <span className="text-gray-400 text-sm">→</span>
        <Badge className="bg-green-100 text-green-700">
          ↗ {pan_demanda.nombre} · {proporcionTexto(pan_demanda.pct_venta)} venta
        </Badge>
      </div>

      {/* Detalle */}
      <p className="text-sm text-gray-600">
        Reduce <strong>{reducir} {pan_exceso.nombre}/día</strong> para producir{' '}
        <strong>{extras} {pan_demanda.nombre} adicionales/día</strong> con los insumos liberados.
      </p>

      {/* Insumos liberados */}
      <div className="flex gap-2 flex-wrap">
        {insumos_libres.map(il => (
          <span key={il.insumo_id} className="text-xs bg-white border border-gray-200 rounded px-2 py-1 text-gray-500">
            {il.nombre}: {il.cantidad} {il.unidad}
          </span>
        ))}
      </div>

      {/* Ganancia estimada */}
      <p className="text-sm font-semibold text-green-700">
        📈 Ganancia estimada adicional: +{monedaDecimal(ganancia_estimada)}/día
        · +{monedaDecimal(ganancia_estimada * 7)}/semana
      </p>

    </div>
  )
}
