import { formatDireccion } from './formatDireccion';
import { formatFecha, formatHora } from './formatFechaHora';
import { DIA_ENUM } from './diaEnum';
import { groupHorariosSimpleDetalle, mergeHorarios } from './horarioGrouping';
import { formatDias } from './formatDias';

export const formatAgendaTurnosDetalle = (data) => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('La respuesta no tiene el formato esperado');
    }

    const prestador = data.prestador
      ? (() => {
          const horariosRaw = Array.isArray(data.prestador.horarios)
            ? data.prestador.horarios.map((h) => {
                const diaNombre = h.dia;
                const diaId = DIA_ENUM[diaNombre] ?? null;

                return {
                  id: h.id,
                  dia: { id: diaId, nombre: diaNombre },
                  horaInicio: h.horaInicio ?? '',
                  horaFin: h.horaFin ?? '',
                };
              })
            : [];

          const horariosOrdenados = horariosRaw.sort(
            (a, b) => (a.dia?.id ?? 999) - (b.dia?.id ?? 999)
          );
          const horariosMergeados = mergeHorarios(horariosOrdenados);

          return {
            id: data.prestador.id ?? null,
            nombre: data.prestador.nombre ?? '',
            especialidades: Array.isArray(data.prestador.especialidades)
              ? data.prestador.especialidades.map((e) => ({
                  id: e.id ?? null,
                  nombre: e.nombre ?? '',
                }))
              : [],
            horarios: horariosMergeados,
          };
        })()
      : null;

    const horariosAtencion = Array.isArray(data.horariosAtencion)
      ? data.horariosAtencion.map((h) => {
          const diaNombre = h.dia;
          const diaId = DIA_ENUM[diaNombre] ?? null;
          return {
            id: h.id,
            dia: { id: diaId, nombre: diaNombre },
            horaInicio: h.horaInicio ?? '',
            horaFin: h.horaFin ?? '',
            duracion: Number(h.duracionTurno) || null,
          };
        })
      : [];

    const horariosAtencionGrouped = groupHorariosSimpleDetalle(
      horariosAtencion
    ).map((g) => ({
      ...g,
      dias: formatDias(g.dias.map((d) => d.nombre)),
    }));

    return {
      id: data.id ?? null,
      prestador,
      especialidad: data.especialidad
        ? typeof data.especialidad === 'object'
          ? {
              id: data.especialidad.id ?? null,
              nombre: data.especialidad.nombre ?? '',
            }
          : { id: null, nombre: String(data.especialidad) }
        : { id: null, nombre: '' },
      direccion: formatDireccion(data.direccion),
      horariosAtencion,
      horariosAtencionGrouped,
      createdAtFecha: formatFecha(data.createdAt),
      createdAtHora: formatHora(data.createdAt),
      updatedAtFecha: formatFecha(data.updatedAt),
      updatedAtHora: formatHora(data.updatedAt),
    };
  } catch (err) {
    console.error('Error al formatear detalle de agenda:', err);

    return {
      id: null,
      prestador: {
        id: null,
        nombre: '',
        especialidades: [],
        horarios: [],
      },
      especialidad: { id: null, nombre: '' },
      direccion: '',
      horariosAtencion: [],
      horariosAtencionGrouped: [],
      createdAtFecha: '',
      createdAtHora: '',
      updatedAtFecha: '',
      updatedAtHora: '',
      error: true,
      errorMessage: err.message,
    };
  }
};
