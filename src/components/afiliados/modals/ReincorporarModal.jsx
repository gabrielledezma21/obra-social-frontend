import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Alert,
  Typography,
  Box,
} from '@mui/material';
import { useAfiliado } from '../../../context/AfiliadoContext';
import ButtonsSection from '../../common/forms/FormActions';

export default function ReincorporarModal({ open, onClose }) {
  const { afiliado, reincorporar } = useAfiliado();
  const [reincorporarGrupoFamiliar, setReincorporarGrupoFamiliar] =
    useState(false);

  const handleConfirmar = async () => {
    const result = await reincorporar(reincorporarGrupoFamiliar);
    if (result.success) {
      onClose();
    }
  };

  const esTitular = !afiliado?.titularId;
  const tieneDependientes = esTitular && afiliado?.dependientes?.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reincorporar Afiliado</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Esta acción eliminará la fecha de baja del afiliado y lo reactivará.
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
              {new Date(afiliado.vigenciaFin).toLocaleDateString()}
            </Typography>
          )}

          {esTitular && tieneDependientes && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={reincorporarGrupoFamiliar}
                  onChange={(e) =>
                    setReincorporarGrupoFamiliar(e.target.checked)
                  }
                />
              }
              label="Reincorporar también a todos los miembros del grupo familiar"
            />
          )}

          {reincorporarGrupoFamiliar && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Se reincorporarán todos los miembros del grupo familiar que tengan
              fecha de baja.
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
