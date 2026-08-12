import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import {
  validateHorarioBasico,
  validateHorarioDentroDireccion,
  validateDuracionVsRango,
  validateSolapamiento,
} from './validateHorarios';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const validateHorarios = (horarios, ventanasPrestador = []) => {
  let error;

  if (!Array.isArray(horarios) || horarios.length === 0) {
    return {
      field: 'horarios',
      message: 'Tenés que definir al menos un horario de atención',
    };
  }

  const direccion = {
    horarios: Array.isArray(ventanasPrestador)
      ? ventanasPrestador.map((h) => ({
          diaId: h?.dia?.id ?? null,
          dia: h?.dia?.nombre ?? '',
          horaInicio: h?.horaInicio ?? '',
          horaFin: h?.horaFin ?? '',
        }))
      : [],
  };

  for (let i = 0; i < horarios.length; i++) {
    const hOriginal = horarios[i];
    const h = { ...hOriginal, id: i };

    const inicio = dayjs(h.horaInicio || h.inicio, ['HH:mm', 'H:mm']);
    const fin = dayjs(h.horaFin || h.fin, ['HH:mm', 'H:mm']);

    const horario = { ...h, inicio, fin };

    error = validateHorarioBasico(horario);
    if (error) {
      return {
        ...error,
        field: error.field.replace(`${hOriginal.id}`, `${i}`),
        horarioId: i,
      };
    }

    if (!h.duracion || h.duracion <= 0) {
      return {
        field: `horario-${i}-duracion`,
        message: 'La duración del turno es obligatoria',
        horarioId: i,
      };
    }

    error = validateDuracionVsRango(horario);
    if (error) {
      return {
        ...error,
        field: error.field.replace(`${hOriginal.id}`, `${i}`),
        horarioId: i,
      };
    }

    error = validateHorarioDentroDireccion(horario, direccion);
    if (error) {
      return {
        ...error,
        field: error.field.replace(`${hOriginal.id}`, `${i}`),
        horarioId: i,
      };
    }

    const universo = horarios.slice(0, i).map((x, idx) => ({
      ...x,
      id: idx,
      inicio: dayjs(x.horaInicio || x.inicio, ['HH:mm', 'H:mm']),
      fin: dayjs(x.horaFin || x.fin, ['HH:mm', 'H:mm']),
    }));

    if (universo.length) {
      error = validateSolapamiento(horario, universo);
      if (error) {
        return {
          ...error,
          field: error.field.replace(/horario-\d+-/, `horario-${i}-`),
          horarioId: i,
        };
      }
    }
  }

  return null;
};
