import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Stack,
  Alert,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ButtonsSection from '../../common/forms/FormActions';
import { useAfiliado } from '../../../context/AfiliadoContext';
import dayjs from 'dayjs';
import { validateFechasVigencia } from '../../../utils/validations/validateFechas';
import FechaVigenciaGroup from '../FechaVigenciaGroup';
import { FormValidationProvider } from '../../../context/FormValidationContext';
import { formatFecha } from '../../../utils/formats/afiliadoPayload';

export default function BajaAfiliadoModal({
  open,
  onClose,
  esModificacion = false,
}) {
  const { afiliado, darDeBaja, modificarFechaBaja } = useAfiliado();
  const [localData, setLocalData] = useState(null);
  const [error, setError] = useState(null);
  const [aplicarAGrupoFamiliar, setAplicarAGrupoFamiliar] = useState(false);

  useEffect(() => {
    if (open && afiliado) {
      const vigenciaInicioActual = afiliado.vigenciaInicio
        ? dayjs(afiliado.vigenciaInicio).startOf('day')
        : null;

      const vigenciaFinNueva = afiliado.vigenciaFin
        ? dayjs(afiliado.vigenciaFin).startOf('day')
        : dayjs().startOf('day');

      setLocalData({
        vigenciaInicio: vigenciaInicioActual,
        vigenciaFin: vigenciaFinNueva,
        tieneFechaBaja: true,
      });
      setError(null);
      setAplicarAGrupoFamiliar(false);
    }
  }, [open, afiliado]);

  if (!localData) return null;

  const handleDateChange = (fieldName, newDate) => {
    if (fieldName === 'vigenciaFin') {
      const dateWithStartOfDay = newDate ? newDate.startOf('day') : null;
      setLocalData((prev) => ({
        ...prev,
        vigenciaFin: dateWithStartOfDay,
      }));
      setError(null);
    }
  };

  const handleSwitchChange = () => {
    console.log('El switch de baja no se puede desactivar en este modal');
  };

  const onConfirmarBaja = async () => {
    const vigenciaFinString = localData.vigenciaFin
      ? formatFecha(localData.vigenciaFin)
      : null;

    if (!vigenciaFinString) {
      setError({
        field: 'vigenciaFin',
        message: 'La fecha de baja es obligatoria.',
      });
      return;
    }

    const validationError = validateFechasVigencia(
      afiliado.vigenciaInicio,
      vigenciaFinString,
      true,
      ''
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    let result;
    if (esModificacion) {
      result = await modificarFechaBaja(
        vigenciaFinString,
        aplicarAGrupoFamiliar
      );
    } else {
      result = await darDeBaja(vigenciaFinString);
    }

    if (result.success) {
      onClose();
    }
  };

  const titulo = esModificacion
    ? 'Modificar fecha de baja'
    : 'Dar de baja afiliado';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {titulo}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <FormValidationProvider>
          <Stack spacing={3}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              {esModificacion
                ? 'Esta acción modificará la fecha de baja del afiliado.'
                : 'Esta acción dará de baja al afiliado. Podrá reactivarlo posteriormente si es necesario.'}
            </Alert>

            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body1">
                <strong>
                  {afiliado.nombre} {afiliado.apellido}
                </strong>
              </Typography>
              {afiliado.numeroDocumento && (
                <Typography variant="body2" color="text.secondary">
                  Documento: {afiliado.numeroDocumento}
                </Typography>
              )}
              {esModificacion && afiliado.vigenciaFin && (
                <Typography variant="body2" color="text.secondary">
                  Fecha de baja actual:
                  {new Date(afiliado.vigenciaFin).toLocaleDateString()}
                </Typography>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <FechaVigenciaGroup
                  data={localData}
                  onDateChange={handleDateChange}
                  onSwitchChange={handleSwitchChange}
                  labelDesde="Vigencia inicio (actual)"
                  labelHasta="Fecha de baja *"
                  labelSwitch="Confirmar baja del afiliado"
                  dateDesdeField="vigenciaInicio"
                  dateHastaField="vigenciaFin"
                  switchFinField="tieneFechaBaja"
                  disabledFields={['vigenciaInicio', 'tieneFechaBaja']}
                />

                {error?.field === 'vigenciaFin' && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    {error.message}
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Typography variant="caption" color="text.secondary">
              {esModificacion
                ? 'La nueva fecha de baja debe ser al menos 30 días después de la fecha de inicio.'
                : 'El afiliado dejará de aparecer en los listados a partir de la fecha de baja seleccionada.'}
            </Typography>
          </Stack>
        </FormValidationProvider>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <ButtonsSection
          handleGuardar={onConfirmarBaja}
          onConfirmCancel={onClose}
          cancelTitle={`¿Cancelar la ${esModificacion ? 'modificación' : 'baja'} del afiliado?`}
          cancelMessage={`Si cancelás ahora, se perderán los cambios realizados.`}
          confirmText={esModificacion ? 'Modificar fecha' : 'Confirmar baja'}
          cancelText="Cancelar"
        />
      </DialogActions>
    </Dialog>
  );
}

BajaAfiliadoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  esModificacion: PropTypes.bool,
};
