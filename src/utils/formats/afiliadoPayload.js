export const formatFecha = (date) => {
  if (!date || !date.format) return null;
  return date.format('YYYY-MM-DD');
};

export const formatEmails = (emails) => {
  return emails?.map((e) => ({
    direccion: e.direccion,
  }));
};

export const formatTelefonos = (telefonos) => {
  return telefonos?.map((t) => ({
    numero: t.numero,
  }));
};

export const formatDirecciones = (direccion) => {
  return direccion?.map((d) => ({
    calle: d.calle,
    altura: d.altura,
    pisoDepto: d.pisoDepto,
    codigoPostal: d.codigoPostal,
    localidad: d.localidad,
    provinciaId: d.provincia?.id,
  }));
};

export const formatSituacionesTerapeuticas = (situaciones) => {
  return situaciones?.map((item) => ({
    situacionId: item.situacion?.id,
    fechaInicio: formatFecha(item.fechaInicio),
    fechaFin:
      item.finaliza && item.fechaFin ? formatFecha(item.fechaFin) : null,
  }));
};

export const formatAfiliadoData = (afiliadoData) => {
  return {
    tipoDocumentoId: afiliadoData.tipoDocumento?.id,
    numeroDocumento: afiliadoData.numeroDocumento,
    fechaNacimiento: formatFecha(afiliadoData.fechaNacimiento),
    nombre: afiliadoData.nombre,
    apellido: afiliadoData.apellido,
    vigenciaInicio: formatFecha(afiliadoData.vigenciaInicio),
    vigenciaFin: formatFecha(afiliadoData.vigenciaFin),
    emails: formatEmails(afiliadoData.emails),
    telefonos: formatTelefonos(afiliadoData.telefonos),
    direcciones: formatDirecciones(afiliadoData.direcciones),
    tieneSituacionTerapeutica: afiliadoData.tieneSituacionTerapeutica,
    situacionesTerapeuticas: formatSituacionesTerapeuticas(
      afiliadoData.situacionesTerapeuticas
    ),
  };
};

export const formatGrupoFamiliar = (grupoFamiliar, datosTitular = {}) => {
  return grupoFamiliar?.map((familiar) => {
    const data = {
      ...formatAfiliadoData(familiar),
      parentescoId: familiar.parentesco?.id,
      usaMismaVigenciaTitular:
        familiar.usaMismaVigenciaTitular !== undefined
          ? familiar.usaMismaVigenciaTitular
          : true,
      usaMismaDireccionTitular:
        familiar.usaMismaDireccionTitular !== undefined
          ? familiar.usaMismaDireccionTitular
          : true,
    };

    if (familiar.usaMismaVigenciaTitular) {
      data.vigenciaInicio = formatFecha(datosTitular.vigenciaInicio);
      data.vigenciaFin = formatFecha(datosTitular.vigenciaFin);
    } else {
      data.vigenciaInicio = formatFecha(familiar.vigenciaInicio);
      data.vigenciaFin = formatFecha(familiar.vigenciaFin);
    }

    if (familiar.usaMismaDireccionTitular) {
      data.direcciones = formatDirecciones(datosTitular.direcciones);
    } else {
      data.direcciones = formatDirecciones(familiar.direcciones);
    }

    return data;
  });
};
