import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { obtenerSesion } from '../../services/portal';

export default function ProtectorRuta({ rolesPermitidos, permitirCambioPendiente }) {
  const ubicacion = useLocation();
  const { token, usuario } = obtenerSesion();

  if (!token || !usuario) {
    return <Navigate to="/portal/acceso" replace state={{ desde: ubicacion }} />;
  }

  if (!rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/403" replace />;
  }

  if (usuario.debeCambiarContrasena && !permitirCambioPendiente) {
    return <Navigate to="/cambiar-contrasena" replace />;
  }

  return <Outlet />;
}

ProtectorRuta.propTypes = {
  rolesPermitidos: PropTypes.arrayOf(PropTypes.string).isRequired,
  permitirCambioPendiente: PropTypes.bool,
};

ProtectorRuta.defaultProps = {
  permitirCambioPendiente: false,
};
