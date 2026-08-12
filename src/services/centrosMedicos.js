import api from './api';

export const getCentrosMedicos = async () => {
  try {
    const { data } = await api.get('/prestadores');
    if (!Array.isArray(data)) {
      throw new Error('Formato inesperado en la respuesta de centros medicos');
    }
    return data
      .filter((item) => item.esCentroMedico)
      .map((item) => ({ ...item, id: item.id ?? item._id }));
  } catch (err) {
    console.error('Error al obtener centros medicos:', err);
    throw err;
  }
};
