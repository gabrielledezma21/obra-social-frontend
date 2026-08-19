import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Typography,
  Box,
} from '@mui/material';
import { useAfiliado } from '../../../context/AfiliadoContext';
import ButtonsSection from '../../common/forms/FormActions';
import { formatearFechaCalendario } from '../../../utils/fechaCalendario';

export default function ReincorporarModal({ open, onClose }) {
  const { afiliado, reincorporar } = useAfiliado();

  const handleConfirmar = async () => {
    const result = await reincorporar();
    if (result.success) {
      onClose();
    }
  };

  const esTitular = afiliado?.parentesco === 'Titular';
  const tieneDependientes = esTitular && afiliado?.dependientes?.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reincorporar Afiliado</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            {tieneDependientes
              ? 'Esta acción eliminará la fecha de baja del titular y de todo su grupo familiar.'
              : 'Esta acción eliminará la fecha de baja del afiliado y lo reactivará.'}
          </Alert>

          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>
              {afiliado?.nombre} {afiliado?.apellido}
            </strong>
            {afiliado?.numeroDocumento && (
              <> - Documento: {afiliado.numeroDocumento}</>
            )}
          </Typography>

          {afiliado?.vigenciaFin && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Fecha de baja actual:{' '}
              {formatearFechaCalendario(afiliado.vigenciaFin)}
            </Typography>
          )}

          {tieneDependientes && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              También se reincorporarán automáticamente todos los miembros del
              grupo familiar que tengan fecha de baja.
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <ButtonsSection
          handleGuardar={handleConfirmar}
          onConfirmCancel={onClose}
          cancelTitle="¿Cancelar la reincorporación?"
          cancelMessage="Si cancelás ahora, el afiliado mantendrá su estado actual."
          confirmText="Reincorporar"
          cancelText="Cancelar"
        />
      </DialogActions>
    </Dialog>
  );
}

ReincorporarModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
