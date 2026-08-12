import { useNavigate, useLocation } from 'react-router-dom';

export const useNavigateToListado = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (status) => {
    const entity = location.pathname.split('/')[1];
    const basePath = `/${entity}/listado`;
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    navigate(`${basePath}${query}`);
  };
};

export const useNavigateToEdicion = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (id, query = {}) => {
    const entity = location.pathname.split('/')[1];
    const queryString = new URLSearchParams(query).toString();
    navigate(`/${entity}/detalle/${id}${queryString ? `?${queryString}` : ''}`);
  };
};
