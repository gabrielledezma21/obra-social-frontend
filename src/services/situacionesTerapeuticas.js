import api from './api';
import { getId } from './apiAdapters';

/**
 * Obtener todas las situaciones terapeuticas.
 */
export const getSituacionesTerapeuticas = async () => {
  try {
    const { data } = await api.get('/situaciones-terapeuticas');
    if (!Array.isArray(data)) {
      throw new Error('Formato inesperado en la respuesta');
    }
    return data.map((item) => ({ ...item, id: getId(item) }));
  } catch (err) {
    console.error('Error al obtener las situaciones terapeuticas:', err);
    throw err;
  }
};
