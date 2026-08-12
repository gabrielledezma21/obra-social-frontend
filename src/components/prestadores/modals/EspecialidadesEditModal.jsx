import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  TextField,
  Autocomplete,
  IconButton,
  Button,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/WarningAmber';
import ButtonsSection from '../../common/forms/FormActions';
import { validateEspecialidad } from '../../../utils/validations/validateEspecialidad';
import { getEspecialidades } from '../../../services/especialidades';
import { usePrestador } from '../../../context/PrestadorContext';

export default function EspecialidadesEditModal({ open, onClose }) {
  const { prestador, updateEspecialidades } = usePrestador();

  const [localValue, setLocalValue] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [error, setError] = useState(null);

  const [warningOpen, setWarningOpen] = useState(false);
  const [especialidadesEliminadas, setEspecialidadesEliminadas] = useState([]);

  const autoRef = useRef(null);

  useEffect(() => {
    if (!open || !prestador) return;

    const loadData = async () => {
      try {
        const lista = await getEspecialidades();
        setEspecialidades(lista || []);
        setLocalValue(prestador.especialidades || []);
        setError(null);
      } catch (err) {
        console.error('Error cargando especialidades:', err);
      }
    };

    loadData();
  }, [open, prestador]);

  if (!prestador) return null;

  const handleChange = (_, newValue) => {
    setLocalValue(newValue);
    setError(null);
  };

  const handleGuardarFinal = async () => {
    await updateEspecialidades(localValue);
    setWarningOpen(false);
    onClose();
  };

  const onGuardar = () => {
    if (!localValue.length) {
      setError('Seleccioná al menos una especialidad.');
      return;
    }

    const invalid = localValue.find((e) => validateEspecialidad(e));
    if (invalid) {
      const validation = validateEspecialidad(invalid);
      setError(validation?.message || 'Especialidad inválida');
      return;
    }

    const idsOriginales = prestador.especialidades.map((e) => e.id);
    const idsActuales = localValue.map((e) => e.id);
    const eliminadas = idsOriginales.filter((id) => !idsActuales.includes(id));

    if (eliminadas.length > 0) {
      const objetosEliminados = prestador.especialidades.filter((e) =>
        eliminadas.includes(e.id)
      );
      setEspecialidadesEliminadas(objetosEliminados);
      setWarningOpen(true);
      return;
    }

    handleGuardarFinal();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pr: 1,
          }}
        >
          Editar especialidades de {prestador.nombre}
          <IconButton onClick={onClose} size="small" color="default">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Autocomplete
                  multiple
                  value={localValue}
                  onChange={handleChange}
                  options={especialidades}
                  getOptionLabel={(o) => o?.nombre || ''}
                  isOptionEqualToValue={(o, v) => o.id === v.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Especialidades"
                      placeholder="Selecciona una o más"
                      inputRef={autoRef}
                      error={!!error}
                      helperText={error}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <ButtonsSection
            handleGuardar={onGuardar}
            onConfirmCancel={onClose}
            cancelTitle="¿Cancelar la edición de especialidades?"
            cancelMessage="Si cancelás ahora, se perderán los cambios realizados."
            confirmText="Guardar cambios"
            cancelText="Cancelar"
          />
        </DialogActions>
      </Dialog>

      <Dialog
        open={warningOpen}
        onClose={() => setWarningOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 600,
            color: 'warning.main',
          }}
        >
          <WarningIcon sx={{ color: 'warning.main' }} />
          Atención
        </DialogTitle>

        <DialogContent dividers>
          <Typography sx={{ mb: 2 }}>
            Estás por <strong>eliminar una o más especialidades</strong> que
            este prestador tenía asignadas.
          </Typography>

          <Typography sx={{ mb: 2 }}>
            Si existen <strong>agendas de turnos</strong> asociadas a esas
            especialidades, <strong>se eliminarán definitivamente</strong>.
          </Typography>

          {especialidadesEliminadas.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>
                Especialidades que estás eliminando:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {especialidadesEliminadas.map((e) => (
                  <li key={e.id}>{e.nombre}</li>
                ))}
              </ul>
            </Box>
          )}

          <Typography>¿Querés continuar?</Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setWarningOpen(false)}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="warning"
            onClick={handleGuardarFinal}
          >
            Sí, continuar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

EspecialidadesEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
