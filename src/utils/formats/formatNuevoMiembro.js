import dayjs from 'dayjs';

// Helpers
const fmt = (d) => (d ? dayjs(d).format('YYYY-MM-DD') : null);

const formatEmails = (emails) =>
  emails?.map((e) => ({ direccion: e.direccion || '' })) || [];

const formatTelefonos = (telefonos) =>
  telefonos?.map((t) => ({ numero: t.numero?.replace(/\D/g, '') || '' })) || [];

/**
 * Normalización de direcciones backend
 */
export const formatDireccionesTitular = (domicilios, provincias) => {
  return (domicilios || []).map((dom) => {
    const nombreProvincia = dom.Direccion.Provincia?.nombre;
    const provMatch = provincias.find((p) => p.nombre === nombreProvincia);

    return {
      calle: dom.Direccion.calle || '',
      altura: String(dom.Direccion.altura ?? ''),
      pisoDepto: dom.Direccion.pisoDepto || '',
      codigoPostal: dom.Direccion.codigoPostal || '',
      localidad: dom.Direccion.localidad || '',
      provinciaId: provMatch?.id ?? null,
    };
  });
};

/**
 * Normalización de direcciones ingresadas (miembro)
 */
export const formatDireccionesMiembro = (dirs) => {
  return (dirs || []).map((d) => ({
    calle: d.calle || '',
    altura: String(d.altura ?? ''),
    pisoDepto: d.pisoDepto || '',
    codigoPostal: d.codigoPostal || '',
    localidad: d.localidad || '',
    provinciaId: Number(d.provinciaId ?? d.provincia?.id ?? 0) || null,
  }));
};

/**
 * Normalización de situaciones terapéuticas
 */
export const formatSituacionesTerapeuticas = (situaciones) =>
  situaciones?.map((item) => ({
    situacionId: item.situacion?.id,
    fechaInicio: fmt(item.fechaInicio),
    fechaFin: item.finaliza ? fmt(item.fechaFin) : null,
  })) || [];

/**
 * payload del nuevo miembro familiar
 */
export const formatNuevoMiembro = (miembro, afiliado, provincias) => {
  const usaVigTit = miembro.usaMismaVigenciaTitular ?? true;
  const usaDirTit = miembro.usaMismaDireccionTitular ?? true;

  return {
    tipoDocumentoId: miembro.tipoDocumento?.id,
    numeroDocumento: miembro.numeroDocumento,
    fechaNacimiento: fmt(miembro.fechaNacimiento),
    nombre: miembro.nombre,
    apellido: miembro.apellido,

    parentescoId: miembro.parentesco?.id,

    usaMismaVigenciaTitular: usaVigTit,
    usaMismaDireccionTitular: usaDirTit,

    vigenciaInicio: usaVigTit
      ? fmt(afiliado.vigenciaInicio)
      : fmt(miembro.vigenciaInicio),

    vigenciaFin: usaVigTit
      ? afiliado.vigenciaFin
        ? fmt(afiliado.vigenciaFin)
        : null
      : fmt(miembro.vigenciaFin),

    emails: formatEmails(miembro.emails),
    telefonos: formatTelefonos(miembro.telefonos),

    direcciones: usaDirTit
      ? formatDireccionesTitular(afiliado.domicilios, provincias)
      : formatDireccionesMiembro(miembro.direcciones),

    tieneSituacionTerapeutica: miembro.tieneSituacionTerapeutica,
    situacionesTerapeuticas: formatSituacionesTerapeuticas(
      miembro.situacionesTerapeuticas
    ),
  };
};
