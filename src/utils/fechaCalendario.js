const PATRON_FECHA_CALENDARIO = /^(\d{4})-(\d{2})-(\d{2})/;

export const obtenerFechaCalendario = (valor) => {
  if (!valor) return '';

  if (typeof valor === 'string') {
    const coincidencia = valor.match(PATRON_FECHA_CALENDARIO);
    if (coincidencia) {
      return `${coincidencia[1]}-${coincidencia[2]}-${coincidencia[3]}`;
    }
  }

  if (valor?.format) {
    return valor.format('YYYY-MM-DD');
  }

  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return '';

  return `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, '0')}-${String(fecha.getUTCDate()).padStart(2, '0')}`;
};

export const formatearFechaCalendario = (valor, vacio = '—') => {
  const fecha = obtenerFechaCalendario(valor);
  if (!fecha) return vacio;

  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
};
