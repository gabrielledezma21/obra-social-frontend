import PropTypes from 'prop-types';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  getAfiliadosTotales,
  getPrestadoresTotales,
  getAgendasTotales,
  getCantidadEspecialidades,
  getPrestadoresPorLocalidad,
  getPrestadoresPorEspecialidad,
  getAfiliadosConBaja,
  getPrestadoresSinAgenda,
  getPlanesMedicosPorMes,
} from '../services/dashboard';

const DashboardContext = createContext({
  stats: [],
  prestadoresPorLocalidad: [],
  prestadoresPorEspecialidad: [],
  afiliadosConBaja: [],
  prestadoresSinAgenda: [],
  planesMedicosPorMes: [],
  loading: true,
  error: null,
  refreshDashboard: () => {},
});

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState([]);
  const [prestadoresPorLocalidad, setPrestadoresPorLocalidad] = useState([]);
  const [prestadoresPorEspecialidad, setPrestadoresPorEspecialidad] = useState(
    []
  );
  const [afiliadosConBaja, setAfiliadosConBaja] = useState([]);
  const [prestadoresSinAgenda, setPrestadoresSinAgenda] = useState([]);
  const [planesMedicosPorMes, setPlanesMedicosPorMes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        afiliados,
        prestadores,
        agendas,
        especialidades,
        localidades,
        especialidadesData,
        afiliadosBaja,
        prestadoresAgenda,
        planesMedicos,
      ] = await Promise.all([
        getAfiliadosTotales(),
        getPrestadoresTotales(),
        getAgendasTotales(),
        getCantidadEspecialidades(),
        getPrestadoresPorLocalidad(),
        getPrestadoresPorEspecialidad(),
        getAfiliadosConBaja(),
        getPrestadoresSinAgenda(),
        getPlanesMedicosPorMes(),
      ]);

      setStats([
        {
          title: 'Afiliados totales',
          value: afiliados,
          color: 'linear-gradient(360deg, #0077C8 0%, #00B1EA 100%)',
          textColor: '#fff',
          link: '/afiliados/listado',
        },
        {
          title: 'Prestadores totales',
          value: prestadores,
          color: '#fff',
          textColor: '#000',
          link: '/prestadores/listado',
        },
        {
          title: 'Agendas de turnos totales',
          value: agendas,
          color: '#fff',
          textColor: '#000',
          link: '/agenda-turnos/listado',
        },
        {
          title: 'Especialidades',
          value: especialidades,
          color: '#fff',
          textColor: '#000',
          link: null,
        },
      ]);

      setPrestadoresPorLocalidad(localidades);
      setPrestadoresPorEspecialidad(especialidadesData);
      setAfiliadosConBaja(afiliadosBaja);
      setPrestadoresSinAgenda(prestadoresAgenda);
      setPlanesMedicosPorMes(planesMedicos);
    } catch (err) {
      console.error('Error al cargar dashboard:', err);
      setError('No se pudo cargar el dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <DashboardContext.Provider
      value={{
        stats,
        prestadoresPorLocalidad,
        prestadoresPorEspecialidad,
        afiliadosConBaja,
        prestadoresSinAgenda,
        planesMedicosPorMes,
        loading,
        error,
        refreshDashboard: fetchDashboardData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useDashboard = () => useContext(DashboardContext);
