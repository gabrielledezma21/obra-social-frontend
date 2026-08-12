import { Box, IconButton, Typography } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PropTypes from 'prop-types';

export default function EliminarButton({ onEliminar, label }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        onClick={onEliminar}
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <IconButton color="error" size="small">
          <RemoveCircleOutlineIcon fontSize="small" />
        </IconButton>
        <Typography
          variant="body2"
          color="error"
          fontWeight={600}
          sx={{ ml: 1 }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

EliminarButton.propTypes = {
  onEliminar: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};
