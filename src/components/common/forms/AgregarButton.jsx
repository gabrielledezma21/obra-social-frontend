import { Box, IconButton, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PropTypes from 'prop-types';

export default function AgregarButton({ onAgregar, label }) {
  return (
    <Box
      sx={{
        mt: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <Box
        onClick={onAgregar}
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <IconButton color="primary" size="small">
          <AddCircleOutlineIcon fontSize="small" />
        </IconButton>
        <Typography
          variant="body2"
          color="primary"
          fontWeight={500}
          sx={{ ml: 1 }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

AgregarButton.propTypes = {
  onAgregar: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};
