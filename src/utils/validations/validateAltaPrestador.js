import {
  validateCuilCuit,
  validateNombre,
  validateTelefonos,
  validateEmails,
} from './validateContacto';

import { validateSingleDireccion } from './validateDireccion';

import {
  validateHorarioBasico,
  validateSolapamiento,
  validateSolapamientoEntreCentros,
} from './validateHorarios';

export const validateAltaPrestador = (data) => {
  let error;

  error = validateCuilCuit(data.cuilCuit);
  if (error) return error;

  error = validateNombre(data.nombre);
  if (error) return error;

  error = validateTelefonos(data.telefonos);
  if (error) return error;

  error = validateEmails(data.emails);
  if (error) return error;

  if (data.especialidades.length === 0) {
    return {
      field: 'especialidades',
      message: 'Seleccioná al menos una especialidad.',
    };
  }

  if (data.integraCentroMedico && !data.centroMedicoQueIntegra) {
    return {
      field: 'centroMedicoId',
      message: 'Seleccioná el centro médico que integra.',
    };
  }

  if (!data.centrosDeAtencion || data.centrosDeAtencion.length === 0) {
    return {
      field: 'centrosDeAtencion',
      message: 'Tenés que agregar al menos un centro de atención.',
    };
  }

  for (const centro of data.centrosDeAtencion) {
    const idPrefijo = `centro-${centro.id}`;

    error = validateSingleDireccion(centro, idPrefijo);
    if (error) return error;

    if (!centro.horarios || centro.horarios.length === 0) {
      return {
        field: `${idPrefijo}-horarios`,
        message: 'Tenés que agregar al menos un horario al centro.',
      };
    }

    for (const horario of centro.horarios) {
      error = validateHorarioBasico(horario);
      if (error) return error;

      error = validateSolapamiento(horario, centro.horarios);
      if (error) return error;
    }
  }

  error = validateSolapamientoEntreCentros(data.centrosDeAtencion);
  if (error) return error;

  return null;
};
