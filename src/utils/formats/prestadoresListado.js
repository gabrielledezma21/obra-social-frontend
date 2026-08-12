import { formatDireccion } from './formatDireccion';

export const formatPrestadoresListado = (data) => {
  try {
    if (!data || !Array.isArray(data.items)) {
      throw new Error('La respuesta no tiene el formato esperado');
    }

    const itemsFormateados = data.items.map((p) => {
      const direcciones = Array.isArray(p.centrosDeAtencion)
        ? p.centrosDeAtencion.map((d) => formatDireccion(d).trim())
        : [];

      const telefonos = p.telefonos?.map((t) => t.numero || '') || [];

      const emails = p.emails?.map((e) => e.direccion || '') || [];

      const especialidades =
        Array.isArray(p.especialidades) && p.especialidades.length
          ? p.especialidades.map((e) =>
              typeof e === 'object' ? (e.nombre ?? '') : e
            )
          : [];

      return {
        id: p.id ?? null,
        nombre: p.nombre || '',
        cuilCuit: p.cuilCuit || '',
        esCentroMedico: p.esCentroMedico ?? false,
        especialidades,
        direcciones,
        telefonos,
        emails,
        createdAt: p.createdAt || null,
        url: p.id ? `/prestadores/detalle/${p.id}` : null,
      };
    });

    return {
      ...data,
      items: itemsFormateados,
    };
  } catch (err) {
    console.error('Error al formatear prestadores:', err);
    return {
      ...data,
      items: data?.items || [],
      error: true,
      errorMessage: err.message,
    };
  }
};
