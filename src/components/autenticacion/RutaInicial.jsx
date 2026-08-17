import { Navigate } from 'react-router-dom';
import { obtenerSesion } from '../../services/portal';

const obtenerRutaPorRol = (rol) => {
  if (rol === 'ADMIN') return '/administracion';
  if (rol === 'AFILIADO') return '/portal/afiliado';
  if (rol === 'PRESTADOR') return '/portal/prestador';
  return '/portal/acceso';
};

export default function RutaInicial() {
  const { token, usuario } = obtenerSesion();

  if (!token || !usuario) {
    return <Navigate to="/portal/acceso" replace />;
  }

  if (usuario.debeCambiarContrasena) {
    return <Navigate to="/cambiar-contrasena" replace />;
  }

  return <Navigate to={obtenerRutaPorRol(usuario.rol)} replace />;
}
