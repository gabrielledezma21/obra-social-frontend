export const formatHorarios = (horariosAtencion = []) => {
  if (!Array.isArray(horariosAtencion)) return [];

  return horariosAtencion.map((h) => {
    const horaInicio = h.horaInicio || '?';
    const horaFin = h.horaFin || '?';
    const duracion = h.duracion ?? '?';

    return `${horaInicio} a ${horaFin} hs — Duración por turno: ${duracion} min`;
  });
};
