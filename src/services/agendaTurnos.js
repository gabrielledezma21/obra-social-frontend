import api from './api';
import { formatAgendaTurnosListado } from '../utils/formats/agendaTurnosListado';
import { formatAgendaTurnosDetalle } from '../utils/formats/agendaTurnosDetalle';
import { formatAgendaTurnosPrestador } from '../utils/formats/agendaTurnosPrestador';
import { filtrarAgendas } from '../utils/filtrosAgendas';
import {
  agendaToLegacy,
  getId,
  paginate,
  prestadorToLegacy,
  rowsToSchedule,
} from './apiAdapters';

export const createAgendaTurnos = async ({
  prestador,
  especialidad,
  direccion,
  horarios,
}) => {
  const prestadorId = getId(prestador);
  const especialidadId = getId(especialidad);
  const centroDeAtencionId = getId(direccion);

  if (!prestadorId || !especialidadId || !centroDeAtencionId) {
    throw new Error(
      'No se pudieron identificar el prestador, la especialidad o el centro de atención'
    );
  }
  const { data } = await api.post('/agendas', {
    prestadorId,
    especialidadId,
    centroDeAtencionId,
    horario: rowsToSchedule(horarios),
  });
  return { ...data, id: getId(data) };
};

export const getAgendaTurnosListado = async (
  filters = {},
  page = 0,
  limit = 10
) => {
  try {
    const { data } = await api.get('/agendas');
    const agendas = (Array.isArray(data) ? data : []).map(agendaToLegacy);
    const agendasFiltradas = filtrarAgendas(agendas, filters);
    return formatAgendaTurnosListado(
      paginate(agendasFiltradas, page, limit)
    );
  } catch (err) {
    console.error('Error al obtener listado de agendas de turnos:', err);
    throw err;
  }
};

export const getPrestadores = async () => {
  const { data } = await api.get('/prestadores');
  return (Array.isArray(data) ? data : []).map((raw) => {
    const legacy = prestadorToLegacy(raw);
    return formatAgendaTurnosPrestador(legacy);
  });
};

export const getPrestadorById = async (id) => {
  if (!id) throw new Error('Se requiere un ID de prestador');
  const { data } = await api.get(`/prestadores/${id}`);
  return formatAgendaTurnosPrestador(prestadorToLegacy(data));
};

export const getAgendaTurnoById = async (id) => {
  if (!id) throw new Error('Se requiere un ID de agenda de turnos');
  const { data } = await api.get(`/agendas/${id}`);
  return formatAgendaTurnosDetalle(agendaToLegacy(data));
};

export const updateAgendaEspecialidad = async () => {
  throw new Error(
    'La API actual no permite cambiar la especialidad de una agenda.'
  );
};

export const updateAgendaHorarios = async (id, horarios) => {
  const { data } = await api.put(`/agendas/${id}`, {
    horario: rowsToSchedule(horarios),
  });
  return formatAgendaTurnosDetalle(agendaToLegacy(data));
};

export const deleteAgendaTurnos = (id) => api.delete(`/agendas/${id}`);
