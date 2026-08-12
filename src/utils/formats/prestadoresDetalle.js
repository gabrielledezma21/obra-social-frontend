import { formatDireccion } from './formatDireccion';
import { formatFecha, formatHora } from './formatFechaHora';
import { DIA_ENUM } from './diaEnum';

export const formatPrestadorDetalle = (data) => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('La respuesta no tiene el formato esperado');
    }

    const emails = Array.isArray(data.Emails)
      ? data.Emails.map((e) => ({
          id: e.id ?? null,
          direccion: e.direccion ?? '',
        }))
      : [];

    const telefonos = Array.isArray(data.Telefonos)
      ? data.Telefonos.map((t) => ({
          id: t.id ?? null,
          numero: t.numero ?? '',
        }))
      : [];

    const especialidades = Array.isArray(data.Especialidad)
      ? data.Especialidad.map((e) => ({
          id: e.id ?? null,
          nombre: e.nombre ?? '',
        }))
      : [];
    const centrosAtencion = Array.isArray(data.CentroDeAtencion)
      ? data.CentroDeAtencion.map((ca) => ({
          id: ca.id ?? null,
          direccion: {
            calle: ca.Direccion.calle ?? '',
            altura: ca.Direccion.altura ?? '',
            codigoPostal: ca.Direccion.codigoPostal ?? '',
            pisoDepto: ca.Direccion.pisoDepto ?? '',
            localidad: ca.Direccion.localidad ?? '',
            provincia: ca.Direccion.Provincia ?? null,
          },
          direccionTexto: formatDireccion(ca.Direccion),
          horarios: Array.isArray(ca.Horarios)
            ? ca.Horarios.map((h) => {
                const diaNombre = h.dia;
                return {
                  id: h.id,
                  dia: {
                    id: DIA_ENUM[diaNombre] ?? null,
                    nombre: diaNombre,
                  },
                  horaInicio: h.horaInicio ?? '',
                  horaFin: h.horaFin ?? '',
                  createdAtFecha: formatFecha(h.createdAt),
                  createdAtHora: formatHora(h.createdAt),
                  updatedAtFecha: formatFecha(h.updatedAt),
                  updatedAtHora: formatHora(h.updatedAt),
                };
              }).sort((a, b) => (a.dia?.id ?? 999) - (b.dia?.id ?? 999))
            : [],
        }))
      : [];

    return {
      id: data.id ?? null,
      nombre: data.nombre ?? '',
      cuilCuit: data.cuilCuit ?? '',
      esCentroMedico: Boolean(data.esCentroMedico),
      integraCentroMedico: Boolean(data.integraCentroMedico),
      centroMedicoId: data.centroMedicoId ?? null,
      centroMedicoNombre: data.CentroMedico?.nombre ?? null,

      emails,
      telefonos,
      especialidades,
      centrosAtencion,

      createdAtFecha: formatFecha(data.createdAt),
      createdAtHora: formatHora(data.createdAt),
      updatedAtFecha: formatFecha(data.updatedAt),
      updatedAtHora: formatHora(data.updatedAt),
    };
  } catch (err) {
    console.error('Error al formatear detalle del prestador:', err);

    return {
      id: null,
      nombre: '',
      cuilCuit: '',
      esCentroMedico: false,
      integraCentroMedico: false,
      centroMedicoId: null,
      emails: [],
      telefonos: [],
      especialidades: [],
      centrosAtencion: [],
      createdAtFecha: '',
      createdAtHora: '',
      updatedAtFecha: '',
      updatedAtHora: '',
      error: true,
      errorMessage: err.message,
    };
  }
};
