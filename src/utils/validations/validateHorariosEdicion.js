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
    const h = horarios[i];
    const inicio = dayjs(h.horaInicio || h.inicio, ['HH:mm', 'H:mm']);
    const fin = dayjs(h.horaFin || h.fin, ['HH:mm', 'H:mm']);
    const horario = { ...h, inicio, fin };

    error = validateHorarioBasico(horario);
    if (error) return { ...error, horarioId: h.id };

    error = validateDuracionVsRango(horario);
    if (error) return { ...error, horarioId: h.id };

    error = validateHorarioDentroDireccion(horario, direccion);
    if (error) return { ...error, horarioId: h.id };

    const universo = horarios
      .map((hor) => ({
        ...hor,
        inicio: dayjs(hor.horaInicio || hor.inicio, ['HH:mm', 'H:mm']),
        fin: dayjs(hor.horaFin || hor.fin, ['HH:mm', 'H:mm']),
      }))
      .filter((hor) => hor.id !== h.id);

    error = validateSolapamiento(horario, universo);
    if (error) return { ...error, horarioId: h.id };
  }

  return null;
};
