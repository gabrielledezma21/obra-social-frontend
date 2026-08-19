import clienteApi from './api';

const CLAVE_TOKEN = 'medintegral_token';
const CLAVE_USUARIO = 'medintegral_usuario';

export const limpiarSesion = () => {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);
};

export const obtenerSesion = () => {
  const token = localStorage.getItem(CLAVE_TOKEN);
  const usuarioGuardado = localStorage.getItem(CLAVE_USUARIO);

  if (!usuarioGuardado) {
    return { token, usuario: null };
  }

  try {
    return {
      token,
      usuario: JSON.parse(usuarioGuardado),
    };
  } catch {
    limpiarSesion();
    return { token: null, usuario: null };
  }
};

export const guardarSesion = ({ token, usuario }) => {
  localStorage.setItem(CLAVE_TOKEN, token);
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
};

export const actualizarUsuarioSesion = (usuario) => {
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
};

export const iniciarSesion = async (identificador, contrasena, rol) => {
  const { data: datosRespuesta } = await clienteApi.post(
    '/autenticacion/iniciar-sesion',
    { identificador, contrasena, rol }
  );
  guardarSesion(datosRespuesta);
  return datosRespuesta;
};

export const activarCuentaAfiliado = async (dni, email) =>
  (
    await clienteApi.post('/autenticacion/activar-afiliado', {
      dni,
      email,
    })
  ).data;

export const activarCuentaPrestador = async (dni, email) =>
  (
    await clienteApi.post('/autenticacion/activar-prestador', {
      dni,
      email,
    })
  ).data;

export const cambiarContrasena = async (contrasenaActual, contrasenaNueva) => {
  const { data: datosRespuesta } = await clienteApi.post(
    '/autenticacion/cambiar-contrasena',
    { contrasenaActual, contrasenaNueva }
  );
  actualizarUsuarioSesion(datosRespuesta.usuario);
  return datosRespuesta;
};

export const autogestionTurnos = {
  consultar: (credenciales) =>
    clienteApi
      .post('/autogestion-turnos/consultar', credenciales)
      .then((respuesta) => respuesta.data),
  obtenerDisponibilidad: (credenciales, limite = 20) =>
    clienteApi
      .post('/autogestion-turnos/disponibilidad', {
        ...credenciales,
        limite,
      })
      .then((respuesta) => respuesta.data),
  cancelar: (credenciales, motivo = '') =>
    clienteApi
      .post('/autogestion-turnos/cancelar', {
        ...credenciales,
        motivo,
      })
      .then((respuesta) => respuesta.data),
  reagendar: (credenciales, horario, motivo = '') =>
    clienteApi
      .post('/autogestion-turnos/reagendar', {
        ...credenciales,
        fecha: horario.fecha,
        hora: horario.hora,
        motivo,
      })
      .then((respuesta) => respuesta.data),
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
  buscarPrestadores: (busqueda) =>
    clienteApi
      .get('/portal-afiliado/prestadores/buscar', {
        params: { busqueda },
      })
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
  obtenerDisponibilidad: (filtros = {}) =>
    clienteApi
      .get('/portal-afiliado/disponibilidad', {
        params: filtros,
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
  reagendarTurno: (id, datos) =>
    clienteApi
      .post(`/portal-afiliado/turnos/${id}/reagendar`, datos)
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
  obtenerCatalogoSituaciones: () =>
    clienteApi
      .get('/portal-prestador/situaciones-terapeuticas')
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
