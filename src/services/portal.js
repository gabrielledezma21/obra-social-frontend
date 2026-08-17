import clienteApi from './api';

const CLAVE_TOKEN = 'medintegral_token';
const CLAVE_USUARIO = 'medintegral_usuario';

export const obtenerSesion = () => {
  const token = localStorage.getItem(CLAVE_TOKEN);
  const usuarioGuardado = localStorage.getItem(CLAVE_USUARIO);
  return {
    token,
    usuario: usuarioGuardado ? JSON.parse(usuarioGuardado) : null,
  };
};

export const guardarSesion = ({ token, usuario }) => {
  localStorage.setItem(CLAVE_TOKEN, token);
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
};

export const limpiarSesion = () => {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);
};

clienteApi.interceptors.request.use((configuracion) => {
  const token = localStorage.getItem(CLAVE_TOKEN);
  if (token) configuracion.headers.Authorization = `Bearer ${token}`;
  return configuracion;
});

export const iniciarSesionPortal = async (email, contrasena) => {
  const { data: datosRespuesta } = await clienteApi.post(
    '/autenticacion/iniciar-sesion',
    { email, contrasena }
  );
  guardarSesion(datosRespuesta);
  return datosRespuesta;
};

export const registrarAfiliado = async (datos) => {
  const { data: datosRespuesta } = await clienteApi.post(
    '/autenticacion/registro-afiliado',
    datos
  );
  guardarSesion(datosRespuesta);
  return datosRespuesta;
};

export const registrarPrestador = async (datos) => {
  const { data: datosRespuesta } = await clienteApi.post(
    '/autenticacion/registro-prestador',
    datos
  );
  guardarSesion(datosRespuesta);
  return datosRespuesta;
};

export const portalAfiliado = {
  obtenerPerfil: () =>
    clienteApi
      .get('/portal-afiliado/mi-perfil')
      .then((respuesta) => respuesta.data),
  obtenerResumen: () =>
    clienteApi
      .get('/portal-afiliado/resumen')
      .then((respuesta) => respuesta.data),
  obtenerCartilla: () =>
    clienteApi
      .get('/portal-afiliado/cartilla')
      .then((respuesta) => respuesta.data),
  obtenerSolicitudes: () =>
    clienteApi
      .get('/portal-afiliado/solicitudes')
      .then((respuesta) => respuesta.data),
  crearSolicitud: (datos) =>
    clienteApi
      .post('/portal-afiliado/solicitudes', datos)
      .then((respuesta) => respuesta.data),
  modificarSolicitud: (id, datos) =>
    clienteApi
      .put(`/portal-afiliado/solicitudes/${id}`, datos)
      .then((respuesta) => respuesta.data),
  eliminarSolicitud: (id) =>
    clienteApi.delete(`/portal-afiliado/solicitudes/${id}`),
  responderObservacion: (id, texto) =>
    clienteApi
      .post(`/portal-afiliado/solicitudes/${id}/responder-observacion`, {
        texto,
      })
      .then((respuesta) => respuesta.data),
  obtenerDisponibilidad: (fecha, filtros = {}) =>
    clienteApi
      .get('/portal-afiliado/disponibilidad', {
        params: { fecha, ...filtros },
      })
      .then((respuesta) => respuesta.data),
  obtenerTurnos: () =>
    clienteApi
      .get('/portal-afiliado/turnos')
      .then((respuesta) => respuesta.data),
  reservarTurno: (datos) =>
    clienteApi
      .post('/portal-afiliado/turnos', datos)
      .then((respuesta) => respuesta.data),
  cancelarTurno: (id) =>
    clienteApi
      .post(`/portal-afiliado/turnos/${id}/cancelar`)
      .then((respuesta) => respuesta.data),
};

export const portalPrestador = {
  obtenerPerfil: () =>
    clienteApi
      .get('/portal-prestador/mi-perfil')
      .then((respuesta) => respuesta.data),
  obtenerResumen: () =>
    clienteApi
      .get('/portal-prestador/resumen')
      .then((respuesta) => respuesta.data),
  obtenerSolicitudes: () =>
    clienteApi
      .get('/portal-prestador/solicitudes')
      .then((respuesta) => respuesta.data),
  cambiarEstado: (id, estado, motivo = '') =>
    clienteApi
      .post(`/portal-prestador/solicitudes/${id}/estado`, { estado, motivo })
      .then((respuesta) => respuesta.data),
  buscarAfiliados: (busqueda) =>
    clienteApi
      .get('/portal-prestador/afiliados/buscar', {
        params: { busqueda },
      })
      .then((respuesta) => respuesta.data),
  obtenerSituaciones: (afiliadoId) =>
    clienteApi
      .get(`/portal-prestador/situaciones/${afiliadoId}`)
      .then((respuesta) => respuesta.data),
  crearSituacion: (datos) =>
    clienteApi
      .post('/portal-prestador/situaciones', datos)
      .then((respuesta) => respuesta.data),
  modificarSituacion: (id, datos) =>
    clienteApi
      .put(`/portal-prestador/situaciones/${id}`, datos)
      .then((respuesta) => respuesta.data),
  obtenerTurnos: (especialidadId = '') =>
    clienteApi
      .get('/portal-prestador/turnos', {
        params: especialidadId ? { especialidadId } : {},
      })
      .then((respuesta) => respuesta.data),
  agregarNota: (id, nota) =>
    clienteApi
      .post(`/portal-prestador/turnos/${id}/nota`, { nota })
      .then((respuesta) => respuesta.data),
  obtenerHistoria: (afiliadoId, soloMias = false) =>
    clienteApi
      .get(`/portal-prestador/historia/${afiliadoId}`, {
        params: { soloMias },
      })
      .then((respuesta) => respuesta.data),
};
