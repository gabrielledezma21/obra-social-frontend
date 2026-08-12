import PropTypes from 'prop-types';
import { Snackbar, Alert } from '@mui/material';

export default function SuccessSnackbar({ open, onClose, message }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        variant="filled"
        sx={{ width: '100%', color: 'white' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

SuccessSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};
