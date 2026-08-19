import clienteApi from './api';

const publicar = (ruta, datos) =>
  clienteApi.post(`/publico/turnos/${ruta}`, datos).then((respuesta) => respuesta.data);

export const consultarTurnoPublico = (codigoReserva, tokenGestion) =>
  publicar('consultar', { codigoReserva, tokenGestion });

export const obtenerDisponibilidadTurnoPublico = (
  codigoReserva,
  tokenGestion,
  limite = 30
) => publicar('disponibilidad', { codigoReserva, tokenGestion, limite });

export const reagendarTurnoPublico = (
  codigoReserva,
  tokenGestion,
  fecha,
  hora
) => publicar('reagendar', { codigoReserva, tokenGestion, fecha, hora });

export const cancelarTurnoPublico = (codigoReserva, tokenGestion) =>
  publicar('cancelar', { codigoReserva, tokenGestion });
