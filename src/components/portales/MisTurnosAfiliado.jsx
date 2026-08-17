import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

const obtenerFechaHoy = () => {
  const hoy = new Date();
  return [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, '0'),
    String(hoy.getDate()).padStart(2, '0'),
  ].join('-');
};

const obtenerFechaTexto = (valor) => String(valor || '').slice(0, 10);

const formatearFecha = (valor) => {
  const fechaTexto = obtenerFechaTexto(valor);
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaTexto);
  if (!coincidencia) return fechaTexto || 'Fecha sin informar';

  return `${coincidencia[3]}/${coincidencia[2]}/${coincidencia[1]}`;
};

const obtenerProximosTurnos = (turnos) => {
  const hoy = obtenerFechaHoy();

  return turnos
    .filter(
      (turno) =>
        turno.estado === 'RESERVADO' && obtenerFechaTexto(turno.fecha) >= hoy
    )
    .sort((primero, segundo) => {
      const clavePrimero = `${obtenerFechaTexto(primero.fecha)}-${primero.hora || ''}`;
      const claveSegundo = `${obtenerFechaTexto(segundo.fecha)}-${segundo.hora || ''}`;
      return clavePrimero.localeCompare(claveSegundo);
    });
};

export default function MisTurnosAfiliado({ turnos, cancelarTurno }) {
  const proximosTurnos = obtenerProximosTurnos(turnos);

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Mis próximos turnos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Consultá tus reservas próximas sin mezclar esta información con la
          búsqueda de nuevos turnos.
        </Typography>
      </Box>

      {proximosTurnos.length === 0 ? (
        <Alert severity="info">No tenés próximos turnos reservados.</Alert>
      ) : (
        <Grid container spacing={2}>
          {proximosTurnos.map((turno) => (
            <Grid key={turno._id} size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      gap={1}
                    >
                      <Box>
                        <Typography variant="h6">
                          {turno.prestadorId?.nombre || 'Prestador'}
                        </Typography>
                        <Typography fontWeight={600}>
                          {formatearFecha(turno.fecha)} · {turno.hora}
                        </Typography>
                      </Box>
                      <Chip label="Reservado" size="small" color="primary" />
                    </Stack>

                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ alignSelf: 'flex-start' }}
                      onClick={() => cancelarTurno(turno._id)}
                    >
                      Cancelar turno
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}

MisTurnosAfiliado.propTypes = {
  turnos: PropTypes.array.isRequired,
  cancelarTurno: PropTypes.func.isRequired,
};
