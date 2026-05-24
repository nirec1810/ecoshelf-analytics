export function fechaISO(fecha: Date = new Date()): string {
  return fecha.toISOString().split('T')[0]
}

export function rangoUltimosDias(dias: number, base: Date = new Date()) {
  const inicio = new Date(base)
  inicio.setDate(base.getDate() - (dias - 1))

  return {
    inicio: fechaISO(inicio),
    fin: fechaISO(base),
  }
}

export function semanaAnterior(base: Date = new Date()) {
  const lunes = new Date(base)
  lunes.setDate(base.getDate() - base.getDay() - 6)

  const domingo = new Date(lunes)
  domingo.setDate(lunes.getDate() + 6)

  return {
    inicio: fechaISO(lunes),
    fin: fechaISO(domingo),
  }
}
