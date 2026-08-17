import api from './api';
import { formatPrestadoresListado } from '../utils/formats/prestadoresListado';
import { formatPrestadorDetalle } from '../utils/formats/prestadoresDetalle';
import {
  getId,
  paginate,
  prestadorToLegacy,
  provinceName,
  rowsToSchedule,
} from './apiAdapters';
import { filtrarPrestadores } from '../utils/filtrosListados';

const toListItem = (raw) => {
  const legacy = prestadorToLegacy(raw);
  return {
    ...raw,
    id: legacy.id,
    centrosDeAtencion: legacy.centrosDeAtencion,
  };
};

export const getPrestadoresListado = async (
  filters = {},
  page = 0,
  limit = 10
) => {
  try {
    const { data } = await api.get('/prestadores');
    const prestadores = Array.isArray(data) ? data : [];
    const filtered = filtrarPrestadores(prestadores, filters);
    return formatPrestadoresListado(
      paginate(filtered.map(toListItem), page, limit)
    );
  } catch (err) {
    console.error('Error al obtener listado de prestadores:', err);
    throw err;
  }
};

export const getPrestadorById = async (id) => {
  if (!id) throw new Error('Se requiere un ID de prestador');
  const { data } = await api.get(`/prestadores/${id}`);
  return formatPrestadorDetalle(prestadorToLegacy(data));
};

const centerPayload = (center) => ({
  direccion: {
    calle: center.calle,
    altura: Number(center.altura),
    pisoDepto: center.pisoDepto || null,
    codigoPostal: center.codigoPostal,
    localidad: center.localidad,
    provincia: provinceName(center.provincia),
  },
  horario: rowsToSchedule(center.horarios ?? []),
});

export const createPrestador = async (prestadorData) => {
  if (!prestadorData?.nombre || !prestadorData?.cuilCuit) {
    throw new Error('Faltan datos obligatorios para crear el prestador');
  }

  const payload = {
    nombre: prestadorData.nombre,
    cuilCuit: prestadorData.cuilCuit,
    emails: prestadorData.emails,
    telefonos: prestadorData.telefonos,
    especialidades: prestadorData.especialidades,
    centrosDeAtencion: (prestadorData.lugaresAtencion ?? []).map(centerPayload),
    esCentroMedico: Boolean(prestadorData.esCentroMedico),
    centroMedicoQueIntegra: prestadorData.centroMedicoQueIntegra || null,
  };
  const { data } = await api.post('/prestadores', payload);
  return { ...data, id: getId(data) };
};

export const updatePrestadorDatosPersonales = async (id, payload) => {
  const { data } = await api.put(`/prestadores/${id}`, {
    nombre: payload.nombre,
    cuilCuit: payload.cuilCuit,
    emails: payload.emails,
    telefonos: payload.telefonos,
  });
  return data;
};

export const updatePrestadorEspecialidades = async (id, especialidades) => {
  const { data } = await api.put(`/prestadores/${id}`, { especialidades });
  return data;
};

export const updatePrestadorCentroMedico = async (id, payload) => {
  const { data } = await api.put(`/prestadores/${id}`, {
    esCentroMedico: Boolean(payload.esCentroMedico),
    centroMedicoQueIntegra: payload.integraCentroMedico
      ? payload.centroMedicoQueIntegra
      : null,
  });
  return data;
};

export const updatePrestadorCentrosAtencion = async () => {
  throw new Error(
    'La API actual todavía no permite reemplazar centros de atención existentes.'
  );
};

export const deletePrestadorById = (id) => api.delete(`/prestadores/${id}`);
