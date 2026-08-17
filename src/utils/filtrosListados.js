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
  if (valor instanceof Date) return Number.isNaN(valor.getTime()) ? null : valor;

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

const mismaFecha = (valor, filtro) => {
  if (!filtro) return true;
  const fecha = obtenerFecha(valor);
  const fechaFiltro = obtenerFecha(filtro);
  if (!fecha || !fechaFiltro) return false;
  return fecha.toISOString().slice(0, 10) === fechaFiltro.toISOString().slice(0, 10);
};

const obtenerDireccionesAfiliado = (afiliado) => {
  const direcciones = [
    afiliado?.direccionId,
    ...(Array.isArray(afiliado?.direccionesIds) ? afiliado.direccionesIds : []),
  ].filter((direccion) => direccion && typeof direccion === 'object');

  return direcciones.filter(
    (direccion, indice) =>
      direcciones.findIndex(
        (otra) => String(otra?._id ?? otra?.id) === String(direccion?._id ?? direccion?.id)
      ) === indice
  );
};

const obtenerDireccionesPrestador = (prestador) =>
  (prestador?.centrosDeAtencion ?? [])
    .map((centro) => centro?.direccionId ?? centro?.direccion ?? centro)
    .filter((direccion) => direccion && typeof direccion === 'object');

const obtenerCredencial = (afiliado) =>
  afiliado?.credencial ??
  `${String(afiliado?.numeroAfiliado ?? '').padStart(7, '0')}-${String(
    afiliado?.numeroIntegrante ?? ''
  ).padStart(2, '0')}`;

const normalizarTipoDocumento = (valor) => {
  const equivalencias = {
    pasaporte: 'ce',
    'libreta cívica': 'lc',
    'libreta civica': 'lc',
  };
  const normalizado = normalizarTexto(obtenerValorFiltro(valor));
  return equivalencias[normalizado] ?? normalizado;
};

export const filtrarAfiliados = (afiliados = [], filtros = {}, ahora = new Date()) => {
  const texto = normalizarTexto(filtros.textInputSearch);
  const estado = String(obtenerValorFiltro(filtros.estado));
  const nroAfiliado = normalizarTexto(filtros.nroAfiliado);
  const tipoDocumento = normalizarTipoDocumento(filtros.tipoDocumento);
  const plan = normalizarTexto(obtenerValorFiltro(filtros.planMedico));
  const provincia = normalizarTexto(obtenerValorFiltro(filtros.provincia));
  const localidad = normalizarTexto(obtenerValorFiltro(filtros.localidad));
  const telefono = normalizarTexto(filtros.telefono);
  const email = normalizarTexto(filtros.email);

  return afiliados.filter((afiliado) => {
    if (
      texto &&
      ![
        `${afiliado?.nombre ?? ''} ${afiliado?.apellido ?? ''}`,
        afiliado?.dni,
        afiliado?.numeroAfiliado,
        obtenerCredencial(afiliado),
      ].some((valor) => contiene(valor, texto))
    ) {
      return false;
    }

    const fechaAlta = obtenerFecha(afiliado?.fechaAlta);
    const fechaBaja = obtenerFecha(afiliado?.fechaBaja);
    if (estado === 'Vigentes') {
      if (!fechaAlta || fechaAlta > ahora || (fechaBaja && fechaBaja <= ahora)) {
        return false;
      }
    } else if (estado === 'Bajas') {
      if (!fechaBaja || fechaBaja > ahora) return false;
    } else if (estado === 'Vigencia futura') {
      if (!fechaAlta || fechaAlta <= ahora) return false;
    }

    if (
      nroAfiliado &&
      !contiene(afiliado?.numeroAfiliado, nroAfiliado) &&
      !contiene(obtenerCredencial(afiliado), nroAfiliado)
    ) {
      return false;
    }

    if (
      tipoDocumento &&
      normalizarTipoDocumento(afiliado?.tipoDocumento) !== tipoDocumento
    ) {
      return false;
    }

    if (plan && normalizarTexto(afiliado?.plan) !== plan) return false;

    const direcciones = obtenerDireccionesAfiliado(afiliado);
    if (
      provincia &&
      !direcciones.some((direccion) => contiene(direccion?.provincia, provincia))
    ) {
      return false;
    }
    if (
      localidad &&
      !direcciones.some((direccion) => contiene(direccion?.localidad, localidad))
    ) {
      return false;
    }

    if (
      !estaEnRango(
        afiliado?.fechaAlta,
        filtros.vigenciaDesde,
        filtros.vigenciaHasta
      )
    ) {
      return false;
    }

    if (
      !estaEnRango(
        afiliado?.creadoEn ?? afiliado?.createdAt,
        filtros.creacionDesde,
        filtros.creacionHasta
      )
    ) {
      return false;
    }

    if (!mismaFecha(afiliado?.fechaNacimiento, filtros.fechaNacimiento)) {
      return false;
    }

    if (
      telefono &&
      !(afiliado?.telefonos ?? []).some((item) => contiene(item?.numero, telefono))
    ) {
      return false;
    }

    if (
      email &&
      !(afiliado?.emails ?? []).some((item) => contiene(item?.direccion, email))
    ) {
      return false;
    }

    return true;
  });
};

export const filtrarPrestadores = (prestadores = [], filtros = {}) => {
  const texto = normalizarTexto(filtros.textInputSearch);
  const tipoPrestador = obtenerValorFiltro(filtros.tipoPrestador);
  const especialidad = filtros.especialidad;
  const idEspecialidad = String(especialidad?.value ?? especialidad?.id ?? '');
  const nombreEspecialidad = normalizarTexto(especialidad?.label ?? especialidad?.nombre);
  const provincia = normalizarTexto(obtenerValorFiltro(filtros.provincia));
  const localidad = normalizarTexto(obtenerValorFiltro(filtros.localidad));

  return prestadores.filter((prestador) => {
    const especialidades = prestador?.especialidades ?? [];
    const direcciones = obtenerDireccionesPrestador(prestador);

    if (
      texto &&
      ![
        prestador?.nombre,
        prestador?.cuilCuit,
        especialidades.map((item) => item?.nombre).join(' '),
        direcciones.map((item) => item?.codigoPostal).join(' '),
      ].some((valor) => contiene(valor, texto))
    ) {
      return false;
    }

    if (tipoPrestador !== '' && tipoPrestador !== null && tipoPrestador !== undefined) {
      const esperado = String(tipoPrestador) === 'true';
      if (Boolean(prestador?.esCentroMedico) !== esperado) return false;
    }

    if (idEspecialidad || nombreEspecialidad) {
      const coincideEspecialidad = especialidades.some((item) => {
        const id = String(item?._id ?? item?.id ?? item ?? '');
        const nombre = normalizarTexto(item?.nombre);
        return (
          (idEspecialidad && id === idEspecialidad) ||
          (nombreEspecialidad && nombre === nombreEspecialidad)
        );
      });
      if (!coincideEspecialidad) return false;
    }

    if (
      provincia &&
      !direcciones.some((direccion) => contiene(direccion?.provincia, provincia))
    ) {
      return false;
    }

    if (
      localidad &&
      !direcciones.some((direccion) => contiene(direccion?.localidad, localidad))
    ) {
      return false;
    }

    const fechaCreacion =
      prestador?.creadoEn ??
      prestador?.createdAt ??
      obtenerFechaDesdeId(prestador?._id ?? prestador?.id);
    if (!estaEnRango(fechaCreacion, filtros.creacionDesde, filtros.creacionHasta)) {
      return false;
    }

    return true;
  });
};
