import api from './api';
import { getId } from './apiAdapters';

/**
 * Obtener todos las especialidades
 */
export const getEspecialidades = async () => {
  try {
    const { data } = await api.get('/especialidades');
    if (!Array.isArray(data)) {
      throw new Error('Formato inesperado en la respuesta de especialidades');
    }
    return data.map((item) => ({ ...item, id: getId(item) }));
  } catch (err) {
    console.error('Error al obtener especialidades:', err);
    throw err;
  }
};

/**
 * Obtener un especialidad por ID
 */
export const getEspecialidadById = async (id) => {
  if (!id) {
    throw new Error('Se requiere un ID de especialidad');
  }

  try {
    const especialidades = await getEspecialidades();
    const data = especialidades.find((item) => getId(item) === id);
    if (!data) {
      throw new Error(
        `Especialidad con ID ${id} no encontrado o formato inválido`
      );
    }
    return data;
  } catch (err) {
    console.error(`Error al obtener especialidad con ID ${id}:`, err);
    throw err;
  }
};
