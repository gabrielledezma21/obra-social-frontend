import { useState } from 'react';
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

const DESPLAZAMIENTO_ARGENTINA = '-03:00';

const obtenerId = (valor) => valor?._id ?? valor?.id ?? valor ?? '';
const obtenerFechaTexto = (valor) => String(valor || '').slice(0, 10);

const obtenerMomentoTurno = (turno) => {
  const fecha = obtenerFechaTexto(turno?.fecha);
  const hora = String(turno?.hora || '');

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^\d{2}:\d{2}$/.test(hora)) {
    return null;
  }

  const momento = new Date(`${fecha}T${hora}:00${DESPLAZAMIENTO_ARGENTINA}`);
  return Number.isNaN(momento.getTime()) ? null : momento;
};

const formatearFecha = (valor) => {
  const fecha = obtenerFechaTexto(valor);
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  if (!coincidencia) return fecha || 'Fecha sin informar';

  return `${coincidencia[3]}/${coincidencia[2]}/${coincidencia[1]}`;
};

const separarTurnos = (turnos, ahora = Date.now()) => {
  const proximos = [];
  const anteriores = [];

  turnos.forEach((turno) => {
    const momento = obtenerMomentoTurno(turno);
    const esProximo =
      turno.estado === 'RESERVADO' &&
      momento !== null &&
      momento.getTime() >= ahora;

    if (esProximo) proximos.push(turno);
    else anteriores.push(turno);
  });

  proximos.sort((primero, segundo) => {
    const momentoPrimero = obtenerMomentoTurno(primero)?.getTime() ?? Infinity;
    const momentoSegundo = obtenerMomentoTurno(segundo)?.getTime() ?? Infinity;
    return momentoPrimero - momentoSegundo;
  });

  anteriores.sort((primero, segundo) => {
    const momentoPrimero = obtenerMomentoTurno(primero)?.getTime() ?? 0;
    const momentoSegundo = obtenerMomentoTurno(segundo)?.getTime() ?? 0;
    return momentoSegundo - momentoPrimero;
  });

  return { proximos, anteriores };
};

const obtenerEstadoVisual = (turno, ahora = Date.now()) => {
  if (turno.estado === 'CANCELADO') return 'Cancelado';
  if (turno.estado === 'ATENDIDO') return 'Atendido';

  const momento = obtenerMomentoTurno(turno);
  if (turno.estado === 'RESERVADO' && momento?.getTime() < ahora) {
    return 'Pasado';
  }

  return 'Reservado';
};

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
  const { proximos, anteriores } = separarTurnos(turnos);
  const turnosVisibles = pestanaTurnos === 0 ? proximos : anteriores;

  const reservarYVolver = async (horario) => {
    const reservado = await reservarTurno(horario);
    if (reservado) {
      setModo('listado');
      setPestanaTurnos(0);
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
          onClick={() => setModo('sacar')}
          sx={{ textTransform: 'none' }}
        >
          Sacar turno
        </Button>
      </Stack>

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
                  const estado = obtenerEstadoVisual(turno);

                  return (
                    <TableRow hover key={turno._id}>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {formatearFecha(turno.fecha)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {turno.hora || 'Hora sin informar'}
                        </Typography>
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
