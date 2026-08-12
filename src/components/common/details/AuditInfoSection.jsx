import PropTypes from 'prop-types';
import { Box, Stack, Typography } from '@mui/material';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

export default function AuditInfoSection({
  createdAtFecha,
  createdAtHora,
  updatedAtFecha,
  updatedAtHora,
}) {
  return (
    <Box sx={{ mt: 4, color: 'text.secondary' }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
        spacing={{ xs: 1, md: 2 }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        {createdAtFecha && createdAtHora && (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <EventOutlinedIcon fontSize="small" />
            <Typography variant="caption">
              Creado el {createdAtFecha} — {createdAtHora} hs
            </Typography>
          </Stack>
        )}
        {updatedAtFecha && updatedAtHora && (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <HistoryOutlinedIcon fontSize="small" />
            <Typography variant="caption">
              Última modificación: {updatedAtFecha} — {updatedAtHora} hs
            </Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

AuditInfoSection.propTypes = {
  createdAtFecha: PropTypes.string,
  createdAtHora: PropTypes.string,
  updatedAtFecha: PropTypes.string,
  updatedAtHora: PropTypes.string,
};
