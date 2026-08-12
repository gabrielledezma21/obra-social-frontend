import { validatePrestador } from './validatePrestador';
import { validateEspecialidad } from './validateEspecialidad';
import { validateDireccion } from './validateDireccion';
import {
  validateHorarioBasico,
  validateHorarioDentroDireccion,
  validateDuracionVsRango,
  validateSolapamiento,
} from './validateHorarios';

export const validateAltaTurnos = ({
  prestador,
  especialidad,
  direccion,
  horarios,
}) => {
  let error;

  error = validatePrestador(prestador);
  if (error) return error;

  error = validateEspecialidad(especialidad);
  if (error) return error;

  error = validateDireccion(direccion);
  if (error) return error;

  if (!horarios || horarios.length === 0) {
    return {
      field: 'horarios',
      message: 'Tenés que agregar al menos un horario',
    };
  }

  for (let i = 0; i < horarios.length; i++) {
    const h = { ...horarios[i], id: i };

    error = validateHorarioBasico(h);
    if (error)
      return {
        ...error,
        field: error.field.replace(`${h.id}`, `${i}`),
      };

    error = validateHorarioDentroDireccion(h, direccion);
    if (error)
      return {
        ...error,
        field: error.field.replace(`${h.id}`, `${i}`),
      };

    if (!h.duracion || h.duracion <= 0) {
      return {
        field: `horario-${i}-duracion`,
        message: 'La duración del turno es obligatoria',
      };
    }

    error = validateDuracionVsRango(h);
    if (error)
      return {
        ...error,
        field: error.field.replace(`${h.id}`, `${i}`),
      };

    const universo = horarios.map((x, idx) => ({ ...x, id: idx }));

    error = validateSolapamiento(h, universo);
    if (error)
      return {
        ...error,
        field: error.field.replace(`${h.id}`, `${i}`),
      };
  }

  return null;
};
