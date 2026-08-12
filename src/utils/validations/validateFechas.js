import dayjs from 'dayjs';

/**
 * Valida fecha de nacimiento
 * - No puede ser futura
 * - SIN restricciones de edad (pueden ser titulares de cualquier edad)
 */
export const validateFechaNacimiento = (
  fechaNacimiento,
  fieldName = 'fechaNacimiento'
) => {
  if (!fechaNacimiento) {
    return {
      field: fieldName,
      message: 'La fecha de nacimiento es obligatoria.',
    };
  }

  const fechaNac = new Date(fechaNacimiento);
  const hoy = new Date();

  // Solo validar que no sea futura
  if (fechaNac > hoy) {
    return {
      field: fieldName,
      message: 'La fecha de nacimiento no puede ser futura.',
    };
  }

  return null;
};

/**
 * Valida fechas de vigencia
 * - vigenciaInicio puede ser futura
 * - Si tieneFechaBaja: vigenciaFin no puede ser anterior a vigenciaInicio
 * - vigenciaFin no puede ser igual a vigenciaInicio
 * - Mínimo 30 días entre vigenciaInicio y vigenciaFin
 */
export const validateFechasVigencia = (
  vigenciaInicio,
  vigenciaFin,
  tieneFechaBaja,
  fieldPrefix = ''
) => {
  const inicioField = fieldPrefix
    ? `${fieldPrefix}vigenciaInicio`
    : 'vigenciaInicio';
  const finField = fieldPrefix ? `${fieldPrefix}vigenciaFin` : 'vigenciaFin';

  if (!vigenciaInicio) {
    return {
      field: inicioField,
      message: 'La fecha de inicio de vigencia es obligatoria.',
    };
  }

  const inicio = dayjs(vigenciaInicio);
  const fin = vigenciaFin ? dayjs(vigenciaFin) : null;

  if (tieneFechaBaja) {
    if (!vigenciaFin) {
      return {
        field: finField,
        message:
          'La fecha de fin de vigencia es obligatoria cuando se marca fecha de baja.',
      };
    }

    if (fin.isBefore(inicio)) {
      return {
        field: finField,
        message:
          'La fecha de fin de vigencia no puede ser anterior a la de inicio.',
      };
    }

    if (fin.isSame(inicio)) {
      return {
        field: finField,
        message:
          'La fecha de fin de vigencia no puede ser igual a la de inicio.',
      };
    }

    if (fin.diff(inicio, 'day') < 30) {
      return {
        field: finField,
        message:
          'La fecha de fin debe ser al menos 30 días después de la fecha de inicio.',
      };
    }

    if (fin.diff(inicio, 'day') < 30) {
      return {
        field: inicioField,
        message:
          'La fecha de inicio no puede modificarse a una fecha que deje menos de 30 días con la fecha de fin.',
      };
    }
  }

  return null;
};
