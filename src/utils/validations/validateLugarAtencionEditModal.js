import { validateSingleDireccion } from './validateDireccion';

import {
  validateHorarioBasico,
  validateSolapamiento,
  validateSolapamientoEntreCentros,
} from './validateHorarios';

export const validateLugarAtencionEditModal = (centros) => {
  if (!centros || centros.length === 0) {
    return {
      field: 'centrosDeAtencion',
      message: 'Tenés que agregar al menos un centro de atención.',
    };
  }

  for (const centro of centros) {
    const idPrefijo = `centro-${centro.id}-`;

    const errorDireccion = validateSingleDireccion(centro.direccion, idPrefijo);
    if (errorDireccion) return errorDireccion;

    if (!centro.horarios || centro.horarios.length === 0) {
      return {
        field: `${idPrefijo}-horarios`,
        message: 'Tenés que agregar al menos un horario al centro.',
      };
    }

    for (const horario of centro.horarios) {
      const errorBasico = validateHorarioBasico(horario);
      if (errorBasico) return errorBasico;

      const errorSolap = validateSolapamiento(horario, centro.horarios);
      if (errorSolap) return errorSolap;
    }
  }

  const errorEntreCentros = validateSolapamientoEntreCentros(centros);
  if (errorEntreCentros) return errorEntreCentros;

  return null;
};
