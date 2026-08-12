import { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Divider, Alert, Link, Typography } from '@mui/material';
import PrestadorSection from './PrestadorSection';
import HorariosSection from './HorariosSection';
import ButtonsSection from '../common/forms/FormActions';
import AgregarButton from '../common/forms/AgregarButton';
import { AnimatePresence } from 'framer-motion';
import { usePrestador } from '../../context/PrestadorAgendaTurnosContext';
import { useHorarios } from '../../context/HorariosContext';
import LoadingOverlay from '../common/LoadingOverlay';
import { useFormValidation } from '../../hooks/useFormValidation';
import { validateAltaTurnos } from '../../utils/validations';
import { createAgendaTurnos } from '../../services/agendaTurnos';
import FadeSlide from '../common/animations/FadeSlide';
import {
  useNavigateToListado,
  useNavigateToEdicion,
} from '../../hooks/navigation';
import { sleepIfLocal } from '../../utils/sleepIfLocal';
import ErrorSnackbar from '../common/ErrorSnackbar';
import { Link as RouterLink } from 'react-router-dom';

export default function AltaTurnosForm() {
  const navigateToListado = useNavigateToListado();
  const navigateToEdicion = useNavigateToEdicion();

  const {
    loading,
    direccionSeleccionada,
    prestador,
    especialidadSeleccionada,
  } = usePrestador();

  const { horarios, agregarHorario, eliminarHorario, actualizarHorario } =
    useHorarios();

  const [saving, setSaving] = useState(false);
  const [showError, setShowError] = useState(false);
  const [agendaExistenteId, setAgendaExistenteId] = useState(null);

  const { validateBeforeSave } = useFormValidation(validateAltaTurnos);

  const alertRef = useRef(null);

  useEffect(() => {
    if (agendaExistenteId && alertRef.current) {
      alertRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [agendaExistenteId]);

  const handleChangeHorario = useCallback(
    (index, field, value) => actualizarHorario(index, field, value),
    [actualizarHorario]
  );

  const handleEliminarHorario = useCallback(
    (id) => eliminarHorario(id),
    [eliminarHorario]
  );

  const handleGuardar = useCallback(() => {
    setAgendaExistenteId(null);

    validateBeforeSave(
      {
        prestador,
        especialidad: especialidadSeleccionada,
        direccion: direccionSeleccionada,
        horarios,
      },
      async () => {
        try {
          setSaving(true);
          await sleepIfLocal(1500);

          const data = await createAgendaTurnos({
            prestador,
            especialidad: especialidadSeleccionada,
            direccion: direccionSeleccionada,
            horarios,
          });

          navigateToEdicion(data.id, { created: true });
        } catch (err) {
          const msg = err?.response?.data || '';

          const match = msg.match(/#(\d+)#/);
          if (match?.[1]) {
            setAgendaExistenteId(match[1]);
            setSaving(false);
            return;
          }

          setShowError(true);
        } finally {
          setSaving(false);
        }
      }
    );
  }, [
    validateBeforeSave,
    prestador,
    especialidadSeleccionada,
    direccionSeleccionada,
    horarios,
    navigateToEdicion,
  ]);

  const handleCancelar = useCallback(
    () => navigateToListado('alta-cancelada'),
    [navigateToListado]
  );

  return (
    <Box component="form" noValidate>
      <LoadingOverlay open={loading || saving} />

      {agendaExistenteId && (
        <Alert
          severity="error"
          ref={alertRef}
          sx={{
            mb: 3,
            fontSize: '.9rem',
            display: 'flex',
            alignItems: 'center',
            '& .MuiAlert-icon': {
              alignSelf: 'center',
              mt: 0.2,
            },
          }}
        >
          <Box>
            <Typography component="div">
              Ya existe una agenda para este prestador, especialidad y centro de
              atención.
            </Typography>

            <Typography component="div" sx={{ mt: 0.5 }}>
              Si querés sumar más horarios, podés editarla haciendo{' '}
              <Link
                component={RouterLink}
                to={`/agenda-turnos/detalle/${agendaExistenteId}`}
                underline="hover"
                sx={{
                  fontWeight: 600,
                  color: 'inherit',
                  textDecoration: 'underline',
                }}
              >
                click acá
              </Link>
              .
            </Typography>
          </Box>
        </Alert>
      )}

      <PrestadorSection />

      <Divider sx={{ mt: 4 }} />

      <AnimatePresence>
        <div>
          {horarios.map((horario, index) => (
            <FadeSlide key={index}>
              <HorariosSection
                horario={horario}
                index={index}
                puedeEliminar={horarios.length > 1}
                onEliminar={(idx) => handleEliminarHorario(idx)}
                onChange={(idx, field, value) =>
                  handleChangeHorario(idx, field, value)
                }
              />

              {index === horarios.length - 1 && direccionSeleccionada && (
                <AgregarButton
                  onAgregar={agregarHorario}
                  label="Agregar otro horario"
                />
              )}
            </FadeSlide>
          ))}
        </div>
      </AnimatePresence>

      <Divider sx={{ my: 4 }} />

      <ButtonsSection
        handleGuardar={handleGuardar}
        onConfirmCancel={handleCancelar}
        cancelTitle="¿Cancelar alta de agenda de turnos?"
        cancelMessage="Si cancelás ahora, se perderán todos los cambios que hayas hecho en el formulario."
      />

      <ErrorSnackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        message="Ocurrió un error al guardar la agenda de turnos."
      />
    </Box>
  );
}
