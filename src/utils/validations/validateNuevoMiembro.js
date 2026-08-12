import {
  validateNombre,
  validateNumeroDocumento,
  validateTelefonos,
  validateEmails,
} from './validateContacto';

import {
  validateFechaNacimiento,
  validateFechasVigencia,
} from './validateFechas';
import { validateDireccionesArray } from './validateDireccion';
import { validateSituacionesTerapeuticasArray } from './validateSituacionesTerapeuticas';

export const validateNuevoMiembro = (miembro) => {
  if (!miembro.parentesco)
    return { field: 'parentesco', message: 'El parentesco es obligatorio.' };

  if (!miembro.tipoDocumento)
    return {
      field: 'tipoDocumento',
      message: 'El tipo de documento es obligatorio.',
    };

  let error = validateNumeroDocumento(
    miembro.numeroDocumento,
    'numeroDocumento'
  );
  if (error) return error;

  error = validateFechaNacimiento(miembro.fechaNacimiento, 'fechaNacimiento');
  if (error) return error;

  error = validateNombre(miembro.nombre, 'nombre');
  if (error) return error;

  error = validateNombre(miembro.apellido, 'apellido');
  if (error) return error;

  if (!miembro.usaMismaVigenciaTitular) {
    error = validateFechasVigencia(
      miembro.vigenciaInicio,
      miembro.vigenciaFin,
      miembro.tieneFechaBaja
    );
    if (error) return error;
  }

  if (miembro.tieneSituacionTerapeutica) {
    error = validateSituacionesTerapeuticasArray(
      miembro.situacionesTerapeuticas,
      'situacionesTerapeuticas'
    );
    if (error) return error;
  }

  error = validateTelefonos(miembro.telefonos, 'telefonos');
  if (error) return error;

  error = validateEmails(miembro.emails, 'emails');
  if (error) return error;

  if (!miembro.usaMismaDireccionTitular) {
    error = validateDireccionesArray(miembro.direcciones, '');
    if (error) return error;
  }

  if (
    miembro.tieneSituacionTerapeutica &&
    (!miembro.situacionesTerapeuticas ||
      miembro.situacionesTerapeuticas.length === 0)
  ) {
    return {
      field: 'situacionesTerapeuticas',
      message: 'Tenés que agregar al menos una situación terapéutica.',
    };
  }

  return null;
};
