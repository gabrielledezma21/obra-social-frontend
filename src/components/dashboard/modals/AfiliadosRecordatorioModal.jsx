import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Link as RouterLink } from 'react-router-dom';

export default function AfiliadosRecordatorioModal({
  open,
  onClose,
  items = [],
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Afiliados con baja programada</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card
                component={RouterLink}
                to={`/afiliados/detalle/${item.id}`}
                sx={{
                  backgroundColor: '#00B1EA',
                  color: '#fff',
                  borderRadius: 3,
                  width: '100%',
                  height: '100%',
                  textDecoration: 'none',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    filter: 'brightness(1.08)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoOutlinedIcon sx={{ fontSize: 20, opacity: 0.9 }} />
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: '#fff',
                      }}
                    >
                      {item.nombre}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ ml: 3, opacity: 0.9, fontWeight: 500 }}
                  >
                    Fecha de baja: {item.fecha}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AfiliadosRecordatorioModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  items: PropTypes.array,
};
