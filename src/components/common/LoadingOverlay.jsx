import { Backdrop, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

export default function LoadingOverlay({ open }) {
  return (
    <Backdrop
      open={open}
      sx={{
        color: '#FFF',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

LoadingOverlay.propTypes = {
  open: PropTypes.bool.isRequired,
};
