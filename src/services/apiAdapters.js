const DAY_NAMES = {
  Lunes: 'Lunes',
  Martes: 'Martes',
  Miercoles: 'Miércoles',
  Miércoles: 'Miércoles',
  Jueves: 'Jueves',
  Viernes: 'Viernes',
  Sabado: 'Sábado',
  Sábado: 'Sábado',
  Domingo: 'Domingo',
};

const API_DAY_NAMES = {
  Lunes: 'Lunes',
  Martes: 'Martes',
  Miércoles: 'Miercoles',
  Miercoles: 'Miercoles',
  Jueves: 'Jueves',
  Viernes: 'Viernes',
  Sábado: 'Sabado',
  Sabado: 'Sabado',
  Domingo: 'Domingo',
};

export const getId = (value) => value?.id ?? value?._id ?? value ?? null;

export const toTime = (value) => {
  if (typeof value === 'string' && value.includes(':')) return value;
  const minutes = Number(value);
  if (!Number.isFinite(minutes)) return '';
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
};

export const normalizeAddress = (value = {}) => {
  const address =
    value?.direccionId ?? value?.Direccion ?? value?.direccion ?? value;
  const provincia = address?.provincia ?? address?.Provincia ?? '';
  const provinciaNombre =
    typeof provincia === 'object' ? (provincia?.nombre ?? '') : provincia;

  return {
    id: getId(address),
    calle: address?.calle ?? '',
    altura: address?.altura ?? '',
    pisoDepto: address?.pisoDepto ?? '',
    codigoPostal: address?.codigoPostal ?? '',
    localidad: address?.localidad ?? '',
    provincia: provinciaNombre,
    Provincia: provinciaNombre
      ? { id: provinciaNombre, nombre: provinciaNombre }
      : null,
  };
};

export const scheduleToRows = (schedule = {}) => {
  const horario = schedule?.horarioId ?? schedule?.horario ?? schedule;
  const duration = horario?.duracionTurno ?? null;

  return Object.entries(horario?.dias ?? {}).flatMap(([day, config]) =>
    config?.atiende
      ? (config.bloques ?? []).map((block, index) => ({
          id: `${getId(horario) ?? 'horario'}-${day}-${index}`,
          dia: DAY_NAMES[day] ?? day,
          horaInicio: toTime(block.horaInicio),
          horaFin: toTime(block.horaFin),
          duracionTurno: duration,
        }))
      : []
  );
};

export const rowsToSchedule = (rows = [], duration = null) => {
  const dias = Object.values(API_DAY_NAMES).reduce((result, day) => {
    result[day] = { atiende: false, bloques: [] };
    return result;
  }, {});

  rows.forEach((row) => {
    const rowDays = row.dias ?? [row.dia?.nombre ?? row.dia];
    rowDays.filter(Boolean).forEach((dayValue) => {
      const day = typeof dayValue === 'object' ? dayValue?.nombre : dayValue;
      if (!day) return;
      const apiDay = API_DAY_NAMES[day] ?? day;
      if (!dias[apiDay]) dias[apiDay] = { atiende: false, bloques: [] };
      dias[apiDay].atiende = true;
      dias[apiDay].bloques.push({
        horaInicio: row.horaInicio ?? row.inicio?.format?.('HH:mm'),
        horaFin: row.horaFin ?? row.fin?.format?.('HH:mm'),
      });
    });
  });

  return {
    dias,
    duracionTurno:
      duration ?? rows.find((row) => row.duracion != null)?.duracion ?? null,
  };
};

export const paginate = (items, page = 0, limit = 10) => ({
  items: items.slice(page * limit, page * limit + limit),
  total: items.length,
  page: page + 1,
  limit,
});

const includes = (value, search) =>
  String(value ?? '')
    .toLocaleLowerCase('es')
    .includes(search);

export const filterByText = (items, filters = {}, fields = []) => {
  const search = String(
    filters.textInputSearch ?? filters.search ?? filters.nombre ?? ''
  )
    .trim()
    .toLocaleLowerCase('es');
  if (!search) return items;
  return items.filter((item) =>
    fields.some((field) => includes(field(item), search))
  );
};

export const prestadorToLegacy = (raw = {}) => {
  const centros = (raw.centrosDeAtencion ?? []).map((center) => {
    const address = normalizeAddress(center);
    return {
      id: getId(center),
      Direccion: address,
      Horarios: scheduleToRows(center.horarioId),
    };
  });

  return {
    ...raw,
    id: getId(raw),
    integraCentroMedico: Boolean(raw.centroMedicoQueIntegra),
    centroMedicoId: getId(raw.centroMedicoQueIntegra),
    CentroMedico:
      typeof raw.centroMedicoQueIntegra === 'object'
        ? raw.centroMedicoQueIntegra
        : null,
    Emails: raw.emails ?? [],
    Telefonos: raw.telefonos ?? [],
    Especialidad: (raw.especialidades ?? []).map((item) => ({
      ...item,
      id: getId(item),
      nombre: item?.nombre ?? String(item ?? ''),
    })),
    CentroDeAtencion: centros,
    centrosDeAtencion: centros.map((center) => ({
      ...center.Direccion,
      id: center.id,
      horarios: center.Horarios,
    })),
  };
};

export const agendaToLegacy = (raw = {}) => {
  const provider = raw.prestadorId ?? raw.prestador ?? {};
  const specialty = raw.especialidadId ?? raw.especialidad ?? {};
  const center = raw.centroDeAtencionId ?? {};
  return {
    ...raw,
    id: getId(raw),
    prestador: {
      id: getId(provider),
      nombre: provider?.nombre ?? '',
      especialidades: (provider?.especialidades ?? []).map((item) => ({
        ...item,
        id: getId(item),
      })),
      horarios: scheduleToRows(center?.horarioId),
    },
    especialidad: {
      id: getId(specialty),
      nombre: specialty?.nombre ?? String(specialty ?? ''),
    },
    direccion: normalizeAddress(center),
    horariosAtencion: scheduleToRows(raw.horario),
  };
};

const separarFechaHora = (valor) => {
  if (!valor) return { fecha: null, hora: null };
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return { fecha: null, hora: null };
  return {
    fecha: fecha.toLocaleDateString('es-AR'),
    hora: fecha.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};

export const afiliadoToLegacy = (raw = {}) => {
  const relatives = raw.familiares ?? [];
  const direccionesCrudas = raw.direccionesIds?.length
    ? raw.direccionesIds
    : [raw.direccionId].filter(Boolean);
  const domicilios = direccionesCrudas.map((direccion) => ({
    id: getId(direccion),
    Direccion: normalizeAddress(direccion),
  }));
  const dependientes = relatives.map(afiliadoToLegacy);
  const creado = separarFechaHora(raw.creadoEn ?? raw.createdAt);
  const actualizado = separarFechaHora(raw.actualizadoEn ?? raw.updatedAt);

  return {
    ...raw,
    id: getId(raw),
    credencial:
      raw.credencial ??
      `${String(raw.numeroAfiliado ?? '').padStart(7, '0')}-${String(
        raw.numeroIntegrante ?? ''
      ).padStart(2, '0')}`,
    parentesco: {
      id: raw.parentesco,
      relacion: raw.parentesco ?? 'Titular',
    },
    tipoDocumento: {
      id: raw.tipoDocumento,
      tipo: raw.tipoDocumento ?? '',
    },
    numeroDocumento: raw.dni != null ? String(raw.dni) : '',
    vigenciaInicio: raw.fechaAlta ?? null,
    vigenciaFin: raw.fechaBaja ?? null,
    tieneFechaBaja: Boolean(raw.fechaBaja),
    Contrato: {
      nAfiliado: raw.numeroAfiliado,
      plan: { id: raw.plan, plan: raw.plan ?? '' },
    },
    domicilios,
    situacionesTerapeuticas: (raw.situacionesTerapeuticas ?? []).map(
      (item) => ({
        id: getId(item),
        nombre: item?.nombre ?? '',
        fechaInicio: item?.fechaInicio ?? null,
        fechaFin: item?.fechaFin ?? null,
        AfiliadoSituaciones: item?.AfiliadoSituaciones ?? {
          fechaInicio: item?.fechaInicio ?? null,
          fechaFin: item?.fechaFin ?? null,
        },
        situacion: { id: getId(item), nombre: item?.nombre ?? '' },
      })
    ),
    grupoFamiliar: dependientes,
    dependientes,
    createdAtFecha: creado.fecha,
    createdAtHora: creado.hora,
    updatedAtFecha: actualizado.fecha,
    updatedAtHora: actualizado.hora,
  };
};

export const provinceName = (value) =>
  typeof value === 'object'
    ? (value?.nombre ?? value?.id ?? '')
    : (value ?? '');
