import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  getAgendaTurnoById,
  updateAgendaEspecialidad,
  updateAgendaHorarios,
  deleteAgendaTurnos,
} from '../services/agendaTurnos';
import SuccessSnackbar from '../components/common/SuccessSnackbar';
import ErrorSnackbar from '../components/common/ErrorSnackbar';
import { Backdrop, CircularProgress } from '@mui/material';
import { sleepIfLocal } from '../utils/sleepIfLocal';

const AgendaContext = createContext();

export function AgendaProvider({ idAgenda, children }) {
  const [agenda, setAgenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchAgenda = useCallback(async () => {
    try {
      const data = await getAgendaTurnoById(idAgenda);
      setAgenda(data);
      return data;
    } catch {
      setError('No se pudo cargar la agenda.');
      throw new Error();
    } finally {
      setLoading(false);
    }
  }, [idAgenda]);

  useEffect(() => {
    fetchAgenda();
  }, [fetchAgenda]);

  const finishWithMessage = ({ success, error }) => {
    if (success) setSuccessMessage(success);
    if (error) setError(error);
    setGlobalLoading(false);
  };

  const updateEspecialidad = async (especialidad) => {
    if (!agenda?.id || !especialidad?.id) return;

    const currentId = agenda?.especialidad?.id ?? null;
    if (currentId === especialidad.id) {
      finishWithMessage({ success: 'La especialidad ya está seleccionada' });
      return agenda;
    }

    setGlobalLoading(true);
    try {
      await updateAgendaEspecialidad(
        agenda.id,
        agenda.prestador.id,
        especialidad.id
      );
      await sleepIfLocal(600);
      const updated = await fetchAgenda();
      finishWithMessage({ success: 'Especialidad actualizada con éxito' });
      return updated;
    } catch (err) {
      const msg = err?.response?.data || '';

      if (/#\d+#/.test(msg)) {
        setGlobalLoading(false);
        throw err;
      }

      finishWithMessage({ error: 'No se pudo actualizar la especialidad.' });
    }
  };

  const updateHorarios = async (horarios) => {
    if (!agenda?.id || !Array.isArray(horarios)) return;

    const normalize = (h) => ({
      dias: (h.dias || []).map((d) => d.nombre).sort(),
      horaInicio: h.horaInicio,
      horaFin: h.horaFin,
      duracion: h.duracion ?? null,
    });

    const currentNormalized = (agenda?.horariosAtencion || []).map(normalize);
    const newNormalized = horarios.map(normalize);

    if (JSON.stringify(currentNormalized) === JSON.stringify(newNormalized)) {
      finishWithMessage({ success: 'Horarios ya actualizados' });
      return agenda;
    }

    setGlobalLoading(true);
    try {
      await updateAgendaHorarios(agenda.id, newNormalized);
      const updated = await fetchAgenda();
      finishWithMessage({ success: 'Horarios actualizados con éxito' });
      return updated;
    } catch {
      finishWithMessage({ error: 'No se pudieron actualizar los horarios.' });
    }
  };

  const deleteAgenda = async () => {
    if (!agenda?.id) return false;

    setGlobalLoading(true);
    try {
      await deleteAgendaTurnos(agenda.id);
      finishWithMessage({ success: 'Agenda eliminada con éxito' });
      return true;
    } catch {
      finishWithMessage({ error: 'No se pudo eliminar la agenda.' });
      return false;
    }
  };

  return (
    <AgendaContext.Provider
      value={{
        agenda,
        loading,
        error,
        globalLoading,
        successMessage,
        setSuccessMessage,
        updateEspecialidad,
        updateHorarios,
        deleteAgenda,
        refetchAgenda: fetchAgenda,
        clearError: () => setError(null),
      }}
    >
      {children}

      <Backdrop open={globalLoading} sx={{ zIndex: 2000, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <SuccessSnackbar
        autoHideDuration={4000}
        open={!!successMessage}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />

      <ErrorSnackbar
        autoHideDuration={4000}
        open={!!error}
        onClose={() => setError(null)}
        message={error}
      />
    </AgendaContext.Provider>
  );
}

AgendaProvider.propTypes = {
  idAgenda: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  children: PropTypes.node.isRequired,
};

export const useAgenda = () => useContext(AgendaContext);
