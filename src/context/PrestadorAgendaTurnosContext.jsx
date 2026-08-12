import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getPrestadorById, getPrestadores } from '../services/agendaTurnos';
import { sleepIfLocal } from '../utils/sleepIfLocal';

const PrestadorContext = createContext();

export function PrestadorProvider({ children }) {
  const [prestadores, setPrestadores] = useState([]);
  const [prestador, setPrestador] = useState(null);
  const [loading, setLoading] = useState(false);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] =
    useState(null);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);

  useEffect(() => {
    const fetchPrestadores = async () => {
      setLoading(true);
      try {
        await sleepIfLocal(1500);
        const data = await getPrestadores();
        setPrestadores(data);
      } catch (err) {
        console.error('Error cargando lista de prestadores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestadores();
  }, []);

  const seleccionarPrestador = async (prestadorObj) => {
    setPrestador(null);
    setEspecialidadSeleccionada(null);
    setDireccionSeleccionada(null);
    if (!prestadorObj) return;

    setLoading(true);
    try {
      await sleepIfLocal(1500);
      const formatted = await getPrestadorById(prestadorObj.id);
      setPrestador(formatted);
    } catch (err) {
      console.error(
        `Error cargando info del prestador ${prestadorObj.id}:`,
        err
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrestadorContext.Provider
      value={{
        prestadores,
        prestador,
        seleccionarPrestador,
        especialidadSeleccionada,
        setEspecialidadSeleccionada,
        direccionSeleccionada,
        setDireccionSeleccionada,
        loading,
      }}
    >
      {children}
    </PrestadorContext.Provider>
  );
}

export function usePrestador() {
  return useContext(PrestadorContext);
}

PrestadorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
