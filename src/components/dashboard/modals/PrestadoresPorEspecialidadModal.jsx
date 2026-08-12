import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function PrestadoresPorEspecialidadModal({
  open,
  onClose,
  fullData,
  total,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderBottomColor: '#D9D9D9',
        }}
      >
        <Box>
          <Typography variant="h6">Prestadores por especialidad</Typography>
          <Typography variant="body2" color="text.secondary">
            Total: {total} prestadores
          </Typography>
        </Box>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Stack spacing={1.2} sx={{ mt: 0 }}>
          {fullData.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 0.5,
              }}
            >
              <Typography variant="body1" color="text.primary">
                {item.label}
              </Typography>
              <Typography variant="body1" fontWeight={600} color="text.primary">
                {item.cantidad}
              </Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

PrestadoresPorEspecialidadModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fullData: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
    })
  ).isRequired,
  total: PropTypes.number.isRequired,
};
