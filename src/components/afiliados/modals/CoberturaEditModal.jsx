import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  IconButton,
  Stack,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ButtonsSection from '../../common/forms/FormActions';
import { useAfiliado } from '../../../context/AfiliadoContext';
import { getPlanesMedicos } from '../../../services/cobertura';

export default function DatosPersonalesEditModal({ open, onClose }) {
  const { afiliado, updateCobertura } = useAfiliado();
  const [localData, setLocalData] = useState(null);
  const [planesMedicos, setPlanesMedicos] = useState([]);
  const [loadingPlanes, setLoadingPlanes] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && afiliado) {
      const loadPlanesMedicos = async () => {
        setLoadingPlanes(true);
        try {
          const planes = await getPlanesMedicos();
          setPlanesMedicos(planes);
        } catch (err) {
          console.error('Error cargando planes medicos:', err);
        } finally {
          setLoadingPlanes(false);
        }
      };

      setLocalData({
        planId: afiliado.Contrato?.plan?.id || '',
      });
      setError(null);
      loadPlanesMedicos();
    }
  }, [open, afiliado]);

  if (!localData) return null;

  const handlePlanMedicoChange = (_, newValue) => {
    setLocalData((prev) => ({
      ...prev,
      planId: newValue ? newValue.id : null,
    }));
    setError(null);
  };

  const selectedPlan =
    planesMedicos.find((plan) => plan.id === localData.planId) || null;

  const onGuardar = async () => {
    if (!localData.planId) {
      setError({ field: 'plan', message: 'Seleccioná un plan médico' });
      return;
    }

    await updateCobertura(localData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Editar cobertura de {afiliado.nombre}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Autocomplete
                fullWidth
                loading={loadingPlanes}
                value={selectedPlan}
                onChange={handlePlanMedicoChange}
                options={planesMedicos}
                getOptionLabel={(option) =>
                  option?.plan ? `Plan ${option.plan}` : ''
                }
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Plan Médico"
                    error={!!error}
                    helperText={error?.message || ''}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <ButtonsSection
          handleGuardar={onGuardar}
          onConfirmCancel={onClose}
          cancelTitle={`¿Cancelar la edición de la cobertura del afiliado ${afiliado.nombre}?`}
          cancelMessage="Si cancelás ahora, se perderán los cambios realizados."
          confirmText="Guardar cambios"
          cancelText="Cancelar"
        />
      </DialogActions>
    </Dialog>
  );
}

DatosPersonalesEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
