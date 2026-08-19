const normalizarValor = (valor) => {
  if (Array.isArray(valor)) return valor.join(' ');
  if (typeof valor === 'boolean') return valor ? '1' : '0';
  if (valor == null) return '';
  return valor;
};

const obtenerValor = (fila, campo) => {
  const valoresEspeciales = {
    prestador: fila.nombre ?? fila.prestador ?? fila.afiliado,
    tipoPrestador: fila.esCentroMedico ? 'Centro médico' : 'Médico',
    documento: fila.documento,
    planMedico: fila.planMedico,
    especialidades: fila.especialidades,
    direcciones: fila.direcciones ?? fila.direccion,
    telefonos: fila.telefonos,
    emails: fila.emails,
    horarios: fila.horarios,
    especialidad: fila.especialidad,
    direccion: fila.direccion,
    parentesco: fila.parentesco,
    afiliado: fila.afiliado,
  };

  return normalizarValor(valoresEspeciales[campo] ?? fila[campo]);
};

export const ordenarFilas = (filas = [], campo, direccion = 'asc') => {
  const factor = direccion === 'desc' ? -1 : 1;

  return [...filas].sort((primera, segunda) => {
    const valorA = obtenerValor(primera, campo);
    const valorB = obtenerValor(segunda, campo);

    const numeroA = Number(valorA);
    const numeroB = Number(valorB);
    if (
      valorA !== '' &&
      valorB !== '' &&
      Number.isFinite(numeroA) &&
      Number.isFinite(numeroB)
    ) {
      return (numeroA - numeroB) * factor;
    }

    return (
      String(valorA).localeCompare(String(valorB), 'es', {
        numeric: true,
        sensitivity: 'base',
      }) * factor
    );
  });
};
