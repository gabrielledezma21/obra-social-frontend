const normalizarTexto = (valor) =>
  String(valor ?? '')
    .trim()
    .toLocaleLowerCase('es');

const obtenerValorFiltro = (valor) =>
  valor?.value ?? valor?.id ?? valor?.nombre ?? valor?.label ?? valor ?? '';

const contiene = (valor, buscado) =>
  normalizarTexto(valor).includes(normalizarTexto(buscado));

const obtenerFecha = (valor) => {
  if (!valor) return null;
  if (valor instanceof Date) {
    return Number.isNaN(valor.getTime()) ? null : valor;
  }

  const texto = String(valor);
  const fecha = /^\d{4}-\d{2}-\d{2}$/.test(texto)
    ? new Date(`${texto}T00:00:00.000Z`)
    : new Date(texto);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
};

const obtenerFechaDesdeId = (id) => {
  const texto = String(id ?? '');
  if (!/^[a-f\d]{24}$/i.test(texto)) return null;
  return new Date(Number.parseInt(texto.slice(0, 8), 16) * 1000);
};

const estaEnRango = (valor, desde, hasta) => {
  if (!desde && !hasta) return true;
  const fecha = obtenerFecha(valor);
  if (!fecha) return false;

  if (desde) {
    const fechaDesde = obtenerFecha(desde);
    if (fechaDesde && fecha < fechaDesde) return false;
  }

  if (hasta) {
    const fechaHasta = obtenerFecha(hasta);
    if (fechaHasta) {
      fechaHasta.setUTCHours(23, 59, 59, 999);
      if (fecha > fechaHasta) return false;
    }
  }

  return true;
};

const coincideEntidad = (entidad, filtro) => {
  if (!filtro) return true;

  const idFiltro = String(filtro?.value ?? filtro?.id ?? '');
  const nombreFiltro = normalizarTexto(filtro?.label ?? filtro?.nombre ?? filtro);
  const idEntidad = String(entidad?.id ?? entidad?._id ?? '');
  const nombreEntidad = normalizarTexto(entidad?.nombre ?? entidad);

  return (
    (idFiltro && idEntidad === idFiltro) ||
    (nombreFiltro && nombreEntidad === nombreFiltro)
  );
};

const coincideHorario = (horario, filtros) => {
  const dia = normalizarTexto(obtenerValorFiltro(filtros.dia));
  const duracion = Number(obtenerValorFiltro(filtros.duracion));
  const horaInicio = String(filtros.horaInicio ?? '').trim();
  const horaFin = String(filtros.horaFin ?? '').trim();

  if (dia && normalizarTexto(horario?.dia) !== dia) return false;
  if (
    Number.isFinite(duracion) &&
    duracion > 0 &&
    Number(horario?.duracionTurno) !== duracion
  ) {
    return false;
  }
  if (horaInicio && String(horario?.horaInicio ?? '') !== horaInicio) return false;
  if (horaFin && String(horario?.horaFin ?? '') !== horaFin) return false;

  return true;
};

export const filtrarAgendas = (agendas = [], filtros = {}) => {
  const texto = normalizarTexto(filtros.textInputSearch);
  const provincia = normalizarTexto(obtenerValorFiltro(filtros.provincia));
  const localidad = normalizarTexto(obtenerValorFiltro(filtros.localidad));
  const requiereHorario = Boolean(
    filtros.dia || filtros.duracion || filtros.horaInicio || filtros.horaFin
  );

  return agendas.filter((agenda) => {
    if (
      texto &&
      ![
        agenda?.prestador?.nombre,
        agenda?.especialidad?.nombre,
        agenda?.direccion?.localidad,
        agenda?.direccion?.provincia,
        agenda?.direccion?.codigoPostal,
      ].some((valor) => contiene(valor, texto))
    ) {
      return false;
    }

    if (!coincideEntidad(agenda?.prestador, filtros.prestador)) return false;
    if (!coincideEntidad(agenda?.especialidad, filtros.especialidad)) return false;

    if (provincia && !contiene(agenda?.direccion?.provincia, provincia)) {
      return false;
    }

    if (localidad && !contiene(agenda?.direccion?.localidad, localidad)) {
      return false;
    }

    if (
      requiereHorario &&
      !(agenda?.horariosAtencion ?? []).some((horario) =>
        coincideHorario(horario, filtros)
      )
    ) {
      return false;
    }

    const fechaCreacion =
      agenda?.creadoEn ??
      agenda?.createdAt ??
      obtenerFechaDesdeId(agenda?._id ?? agenda?.id);
    if (
      !estaEnRango(fechaCreacion, filtros.creacionDesde, filtros.creacionHasta)
    ) {
      return false;
    }

    return true;
  });
};
