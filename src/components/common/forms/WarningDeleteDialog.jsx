import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function WarningDeleteDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar baja',
  cancelText = 'Cancelar',
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          fontWeight: 700,
          color: 'warning.dark',
          fontSize: '1.25rem',
        }}
      >
        <WarningAmberIcon sx={{ fontSize: 28, color: 'warning.main' }} />
        {title}
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: '1rem',
            lineHeight: 1.6,
            mb: 1,
          }}
          dangerouslySetInnerHTML={{ __html: message }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {cancelText}
        </Button>

        <Button variant="contained" color="warning" onClick={onConfirm}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

WarningDeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};
