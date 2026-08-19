import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GestionTurnosAfiliado from './GestionTurnosAfiliado';
import {
  formatearFechaTurno,
  obtenerEstadoVisualTurno,
  separarTurnosAfiliado,
} from '../../utils/turnosAfiliado';

const obtenerId = (valor) => valor?._id ?? valor?.id ?? valor ?? '';

const obtenerColorEstado = (estado) => {
  if (estado === 'Reservado') return 'primary';
  if (estado === 'Atendido') return 'success';
  if (estado === 'Cancelado') return 'default';
  return 'warning';
};

const obtenerIntegrante = (turno, integrantes) => {
  const afiliadoTurno = turno.afiliadoId;
  if (afiliadoTurno && typeof afiliadoTurno === 'object') {
    return afiliadoTurno;
  }

  return integrantes.find(
    (integrante) => obtenerId(integrante) === obtenerId(afiliadoTurno)
  );
};

export default function TurnosAfiliado({
  turnos,
  integrantes,
  cartilla,
  afiliadoTurnoId,
  setAfiliadoTurnoId,
  horariosDisponibles,
  buscarDisponibilidad,
  reservarTurno,
  cancelarTurno,
}) {
  const [modo, setModo] = useState('listado');
  const [pestanaTurnos, setPestanaTurnos] = useState(0);
  const [mensajeReserva, setMensajeReserva] = useState('');

  useEffect(() => {
    const manejarNavegacionTurnos = (evento) => {
      if (evento.detail?.vista === 'sacar') {
        setModo('sacar');
        return;
      }

      if (evento.detail?.vista === 'listado') {
        setModo('listado');
        setPestanaTurnos(0);
      }
    };

    window.addEventListener(
      'medintegral:navegar-turnos',
      manejarNavegacionTurnos
    );
    return () =>
      window.removeEventListener(
        'medintegral:navegar-turnos',
        manejarNavegacionTurnos
      );
  }, []);
  const { proximos, anteriores } = separarTurnosAfiliado(turnos);
  const turnosVisibles = pestanaTurnos === 0 ? proximos : anteriores;

  const reservarYVolver = async (horario) => {
    const reservado = await reservarTurno(horario);
    if (reservado) {
      setModo('listado');
      setPestanaTurnos(0);
      setMensajeReserva(
        'Turno reservado correctamente. Tu código de reserva queda visible en Mis turnos y, si el correo está configurado, recibirás también el enlace seguro para gestionarlo.'
      );
    }
  };

  if (modo === 'sacar') {
    return (
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ sm: 'center' }}
          gap={1}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Sacar turno
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Buscá disponibilidad y reservá un nuevo turno.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => setModo('listado')}
          >
            Volver a turnos
          </Button>
        </Stack>

        <GestionTurnosAfiliado
          integrantes={integrantes}
          cartilla={cartilla}
          afiliadoTurnoId={afiliadoTurnoId}
          setAfiliadoTurnoId={setAfiliadoTurnoId}
          horariosDisponibles={horariosDisponibles}
          buscarDisponibilidad={buscarDisponibilidad}
          reservarTurno={reservarYVolver}
        />
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        gap={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Turnos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consultá tus próximos turnos y el historial de turnos anteriores.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setMensajeReserva('');
            setModo('sacar');
          }}
          sx={{ textTransform: 'none' }}
        >
          Sacar turno
        </Button>
      </Stack>

      {mensajeReserva && (
        <Alert severity="success" onClose={() => setMensajeReserva('')}>
          {mensajeReserva}
        </Alert>
      )}

      <Tabs
        value={pestanaTurnos}
        onChange={(_evento, valor) => setPestanaTurnos(valor)}
      >
        <Tab label={`Próximos (${proximos.length})`} />
        <Tab label={`Anteriores (${anteriores.length})`} />
      </Tabs>

      {turnosVisibles.length === 0 ? (
        <Alert severity="info">
          {pestanaTurnos === 0
            ? 'No tenés próximos turnos reservados.'
            : 'No hay turnos anteriores para mostrar.'}
        </Alert>
      ) : (
        <Paper
          sx={{
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Fecha y hora</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Prestador</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Integrante</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {turnosVisibles.map((turno) => {
                  const integrante = obtenerIntegrante(turno, integrantes);
                  const estado = obtenerEstadoVisualTurno(turno);

                  return (
                    <TableRow hover key={turno._id}>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {formatearFechaTurno(turno.fecha)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {turno.hora || 'Hora sin informar'}
                        </Typography>
                        {turno.codigoReserva && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            Código: {turno.codigoReserva}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {turno.prestadorId?.nombre || 'Prestador'}
                      </TableCell>
                      <TableCell>
                        {integrante
                          ? `${integrante.nombre || ''} ${integrante.apellido || ''}`.trim()
                          : 'Integrante'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={estado}
                          color={obtenerColorEstado(estado)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {estado === 'Reservado' ? (
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => cancelarTurno(turno._id)}
                          >
                            Cancelar
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Stack>
  );
}

TurnosAfiliado.propTypes = {
  turnos: PropTypes.array.isRequired,
  integrantes: PropTypes.array.isRequired,
  cartilla: PropTypes.array.isRequired,
  afiliadoTurnoId: PropTypes.string.isRequired,
  setAfiliadoTurnoId: PropTypes.func.isRequired,
  horariosDisponibles: PropTypes.array.isRequired,
  buscarDisponibilidad: PropTypes.func.isRequired,
  reservarTurno: PropTypes.func.isRequired,
  cancelarTurno: PropTypes.func.isRequired,
};
