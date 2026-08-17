import clienteApi from './api';

export const obtenerAltasAfiliados = (desde, hasta) =>
  clienteApi
    .get('/reportes/afiliados-altas', { params: { desde, hasta } })
    .then((respuesta) => respuesta.data);

export const obtenerAltasPrestadores = (desde, hasta) =>
  clienteApi
    .get('/reportes/prestadores-altas', { params: { desde, hasta } })
    .then((respuesta) => respuesta.data);

export const obtenerDistribucionPrestadores = () =>
  clienteApi
    .get('/reportes/prestadores-distribucion')
    .then((respuesta) => respuesta.data);

export const obtenerPrestadoresSinAgenda = () =>
  clienteApi
    .get('/reportes/prestadores-sin-agenda')
    .then((respuesta) => respuesta.data);

export const obtenerSituacionesGrupo = (afiliadoId) =>
  clienteApi
    .get(`/reportes/situaciones/${afiliadoId}`)
    .then((respuesta) => respuesta.data);

export const obtenerHorariosSinTurnos = (prestadorId) =>
  clienteApi
    .get(`/reportes/prestadores/${prestadorId}/horarios-sin-turnos`)
    .then((respuesta) => respuesta.data);
