import * as React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
} from '@mui/material';
import PropTypes from 'prop-types';

export default function ConfirmCancelDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-cancel-title"
      aria-describedby="confirm-cancel-description"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        id="confirm-cancel-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          fontWeight: 600,
          pb: 1,
        }}
      >
        <Box component="span">{title}</Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2 }}>
        <DialogContentText
          id="confirm-cancel-description"
          sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Volver
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmCancelDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmColor: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

ConfirmCancelDialog.defaultProps = {
  title: '¿Cancelar?',
  message: 'Si cancelás ahora, se perderán los cambios realizados.',
  confirmColor: 'error',
  confirmText: 'Confirmar',
  cancelText: 'Volver',
};
