const DESPLAZAMIENTO_ARGENTINA = '-03:00';

export const obtenerFechaTextoTurno = (valor) =>
  String(valor || '').slice(0, 10);

export const obtenerMomentoTurno = (turno) => {
  const fecha = obtenerFechaTextoTurno(turno?.fecha);
  const hora = String(turno?.hora || '');

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^\d{2}:\d{2}$/.test(hora)) {
    return null;
  }

  const momento = new Date(`${fecha}T${hora}:00${DESPLAZAMIENTO_ARGENTINA}`);
  return Number.isNaN(momento.getTime()) ? null : momento;
};

export const formatearFechaTurno = (valor) => {
  const fecha = obtenerFechaTextoTurno(valor);
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  if (!coincidencia) return fecha || 'Fecha sin informar';

  return `${coincidencia[3]}/${coincidencia[2]}/${coincidencia[1]}`;
};

const ordenarAscendente = (turnos) =>
  turnos.sort((primero, segundo) => {
    const momentoPrimero = obtenerMomentoTurno(primero)?.getTime() ?? Infinity;
    const momentoSegundo = obtenerMomentoTurno(segundo)?.getTime() ?? Infinity;
    return momentoPrimero - momentoSegundo;
  });

const ordenarDescendente = (turnos) =>
  turnos.sort((primero, segundo) => {
    const momentoPrimero = obtenerMomentoTurno(primero)?.getTime() ?? 0;
    const momentoSegundo = obtenerMomentoTurno(segundo)?.getTime() ?? 0;
    return momentoSegundo - momentoPrimero;
  });

export const separarTurnosAfiliado = (turnos, ahora = Date.now()) => {
  const proximos = [];
  const anteriores = [];
  const cancelados = [];

  turnos.forEach((turno) => {
    if (turno.estado === 'CANCELADO') {
      cancelados.push(turno);
      return;
    }

    const momento = obtenerMomentoTurno(turno);
    const esProximo =
      turno.estado === 'RESERVADO' &&
      momento !== null &&
      momento.getTime() >= ahora;

    if (esProximo) proximos.push(turno);
    else anteriores.push(turno);
  });

  ordenarAscendente(proximos);
  ordenarDescendente(anteriores);
  ordenarDescendente(cancelados);

  return { proximos, anteriores, cancelados };
};

export const obtenerEstadoVisualTurno = (turno, ahora = Date.now()) => {
  if (turno.estado === 'CANCELADO') return 'Cancelado';
  if (turno.estado === 'ATENDIDO') return 'Atendido';

  const momento = obtenerMomentoTurno(turno);
  if (turno.estado === 'RESERVADO' && momento?.getTime() < ahora) {
    return 'Pasado';
  }

  return 'Reservado';
};
