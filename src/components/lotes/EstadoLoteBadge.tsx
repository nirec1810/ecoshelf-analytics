import { Badge } from '@/components/ui/badge'
import type { EstadoLote } from '@/models/lote.model'

const configuracionEstados: Record<EstadoLote, { etiqueta: string; variante: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  disponible:  { etiqueta: 'Disponible',   variante: 'default' },
  reservado:   { etiqueta: 'Reservado',    variante: 'secondary' },
  vendido:     { etiqueta: 'Vendido',      variante: 'outline' },
  donado:      { etiqueta: 'Donado',       variante: 'secondary' },
  desperdicio: { etiqueta: 'Desperdicio',  variante: 'destructive' },
}

interface Props {
  estado: EstadoLote
}

export function EstadoLoteBadge({ estado }: Props) {
  const { etiqueta, variante } = configuracionEstados[estado]
  return <Badge variant={variante}>{etiqueta}</Badge>
}