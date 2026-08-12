export const validateSituacionTerapeutica = (situacion, index, prefix = '') => {
  const fieldBase = prefix
    ? `${prefix}situacionesTerapeuticas`
    : 'situacionesTerapeuticas';

  if (!situacion.situacion || !situacion.situacion.id) {
    return {
      field: `${fieldBase}-${index}-situacion`,
      message: 'La situación terapéutica es obligatoria.',
    };
  }

  if (!situacion.fechaInicio) {
    return {
      field: `${fieldBase}-${index}-fechaInicio`,
      message: 'La fecha de inicio es obligatoria.',
    };
  }

  if (new Date(situacion.fechaInicio) > new Date()) {
    return {
      field: `${fieldBase}-${index}-fechaInicio`,
      message: 'La fecha de inicio no puede ser futura.',
    };
  }

  if (situacion.finaliza && !situacion.fechaFin) {
    return {
      field: `${fieldBase}-${index}-fechaFin`,
      message: 'La fecha de fin es obligatoria cuando se marca finalización.',
    };
  }

  if (
    situacion.fechaFin &&
    situacion.fechaInicio &&
    new Date(situacion.fechaFin) < new Date(situacion.fechaInicio)
  ) {
    return {
      field: `${fieldBase}-${index}-fechaFin`,
      message: 'La fecha de fin no puede ser anterior a la de inicio.',
    };
  }

  return null;
};

export const validateSituacionesTerapeuticasArray = (
  situaciones,
  prefix = ''
) => {
  const fieldBase = prefix
    ? `${prefix}situacionesTerapeuticas`
    : 'situacionesTerapeuticas';

  if (!situaciones || situaciones.length === 0) {
    return {
      field: fieldBase,
      message: 'Debe agregar al menos una situación terapéutica.',
    };
  }

  for (let i = 0; i < situaciones.length; i++) {
    const error = validateSituacionTerapeutica(situaciones[i], i, prefix);
    if (error) return error;
  }

  return null;
};
