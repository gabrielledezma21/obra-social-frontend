import { useState } from 'react';
import { Box, Button } from '@mui/material';
import PropTypes from 'prop-types';
import ConfirmCancelDialog from './ConfirmCancelDialog';

export default function FormActions({
  handleGuardar,
  onConfirmCancel,
  cancelTitle,
  cancelMessage,
}) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleConfirmCancel = () => {
    setOpenDialog(false);
    if (onConfirmCancel) onConfirmCancel();
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          color="error"
          variant="text"
          sx={{ textTransform: 'none' }}
          onClick={handleOpenDialog}
        >
          Cancelar
        </Button>
        <Button
          color="primary"
          variant="contained"
          sx={{ textTransform: 'none' }}
          onClick={handleGuardar}
        >
          Guardar
        </Button>
      </Box>

      <ConfirmCancelDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmCancel}
        title={cancelTitle}
        message={cancelMessage}
      />
    </>
  );
}

FormActions.propTypes = {
  handleGuardar: PropTypes.func.isRequired,
  onConfirmCancel: PropTypes.func,
  cancelTitle: PropTypes.string,
  cancelMessage: PropTypes.string,
};

FormActions.defaultProps = {
  onConfirmCancel: null,
  cancelTitle: '¿Cancelar?',
  cancelMessage: 'Se perderán los cambios realizados.',
};
