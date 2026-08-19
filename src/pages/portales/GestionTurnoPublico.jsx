import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import {
  cancelarTurnoPublico,
  consultarTurnoPublico,
  obtenerDisponibilidadTurnoPublico,
  reagendarTurnoPublico,
} from '../../services/turnosPublicos';
import {
  leerCredencialesTurnoDesdeUbicacion,
  limpiarFragmentoSensible,
} from '../../utils/enlaceTurno';

const obtenerMensajeError = (error) =>
  error.response?.data?.mensaje ||
  error.message ||
  'No pudimos gestionar el turno. Intentá nuevamente.';

const formatearFecha = (valor) => {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(valor || ''));
  if (!coincidencia) return valor || 'Fecha sin informar';
  return `${coincidencia[3]}/${coincidencia[2]}/${coincidencia[1]}`;
};

const colorEstado = (estado) => {
  if (estado === 'RESERVADO') return 'primary';
  if (estado === 'ATENDIDO') return 'success';
  return 'default';
};

export default function GestionTurnoPublico() {
  const navegar = useNavigate();
  const credencialesIniciales = useRef(
    leerCredencialesTurnoDesdeUbicacion()
  ).current;
  const [turno, setTurno] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mostrarCancelacion, setMostrarCancelacion] = useState(false);
  const [mostrandoReagendamiento, setMostrandoReagendamiento] = useState(
    credencialesIniciales.accion === 'reagendar'
  );
  const [horarios, setHorarios] = useState([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const { codigoReserva, tokenGestion } = credencialesIniciales;
  const enlaceValido = Boolean(codigoReserva && tokenGestion);

  const centroTexto = useMemo(() => {
    const centro = turno?.centro;
    if (!centro) return 'Centro de atención';
    return [
      [centro.calle, centro.altura].filter(Boolean).join(' '),
      centro.localidad,
      centro.provincia,
    ]
      .filter(Boolean)
      .join(' · ');
  }, [turno]);

  useEffect(() => {
    limpiarFragmentoSensible();

    if (!enlaceValido) {
      setCargando(false);
      return;
    }

    let activo = true;
    consultarTurnoPublico(codigoReserva, tokenGestion)
      .then(({ turno: turnoObtenido }) => {
        if (!activo) return;
        setTurno(turnoObtenido);
        if (credencialesIniciales.accion === 'cancelar') {
          setMostrarCancelacion(true);
        }
      })
      .catch((errorPeticion) => {
        if (activo) setError(obtenerMensajeError(errorPeticion));
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [codigoReserva, credencialesIniciales.accion, enlaceValido, tokenGestion]);

  const cargarHorarios = async () => {
    try {
      setError('');
      setCargandoHorarios(true);
      const { horarios: opciones } = await obtenerDisponibilidadTurnoPublico(
        codigoReserva,
        tokenGestion,
        30
      );
      setHorarios(opciones || []);
      setMostrandoReagendamiento(true);
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    } finally {
      setCargandoHorarios(false);
    }
  };

  useEffect(() => {
    if (
      turno?.puedeGestionarse &&
      mostrandoReagendamiento &&
      horarios.length === 0 &&
      !cargandoHorarios
    ) {
      cargarHorarios();
    }
    // La carga inicial se dispara una sola vez al abrir el modo reagendar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turno?.puedeGestionarse, mostrandoReagendamiento]);

  const cancelar = async () => {
    try {
      setProcesando(true);
      setError('');
      const resultado = await cancelarTurnoPublico(codigoReserva, tokenGestion);
      setTurno(resultado.turno);
      setMostrarCancelacion(false);
      setMostrandoReagendamiento(false);
      setMensaje('El turno fue cancelado correctamente.');
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    } finally {
      setProcesando(false);
    }
  };

  const reagendar = async (horario) => {
    try {
      setProcesando(true);
      setError('');
      const resultado = await reagendarTurnoPublico(
        codigoReserva,
        tokenGestion,
        horario.fecha,
        horario.hora
      );
      setTurno(resultado.turno);
      setHorarios([]);
      setMostrandoReagendamiento(false);
      setMensaje(
        `Turno reagendado para el ${formatearFecha(horario.fecha)} a las ${horario.hora}.`
      );
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!enlaceValido || (!turno && error)) {
    return (
      <Box sx={{ maxWidth: 720, mx: 'auto', mt: 2 }}>
        <PageHeader
          title="Gestionar turno"
          subtitle="Autogestión segura de turnos MedIntegral"
        />
        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={2}>
              <Alert severity="warning">
                {!enlaceValido
                  ? 'Este enlace no contiene las credenciales necesarias para gestionar un turno.'
                  : error}
              </Alert>
              <Typography color="text.secondary">
                Por seguridad, usá el botón del correo de confirmación que
                recibiste al reservar. El código visible por sí solo no autoriza
                cambios.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navegar('/portal/acceso')}
              >
                Ir al acceso de MedIntegral
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 2 }}>
      <PageHeader
        title="Tu turno"
        subtitle={`Reserva ${turno.codigoReserva}`}
      />

      <Stack spacing={2.5}>
        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {mensaje && (
          <Alert severity="success" onClose={() => setMensaje('')}>
            {mensaje}
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={2.5}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ sm: 'center' }}
                gap={1}
              >
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {turno.prestador || 'Prestador'}
                  </Typography>
                  <Typography color="text.secondary">
                    {turno.especialidad || 'Especialidad'}
                  </Typography>
                </Box>
                <Chip
                  label={turno.estado}
                  color={colorEstado(turno.estado)}
                  variant={turno.estado === 'RESERVADO' ? 'filled' : 'outlined'}
                />
              </Stack>

              <Divider />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CalendarMonthOutlinedIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Fecha
                      </Typography>
                      <Typography fontWeight={600}>
                        {formatearFecha(turno.fecha)}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <ScheduleOutlinedIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Hora
                      </Typography>
                      <Typography fontWeight={600}>{turno.hora}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Centro de atención
                </Typography>
                <Typography>{centroTexto}</Typography>
              </Box>

              {turno.estado === 'RESERVADO' && !turno.puedeGestionarse && (
                <Alert severity="info">
                  Este turno ya está dentro de las 24 horas previas y no puede
                  cancelarse o reagendarse desde el enlace.
                </Alert>
              )}

              {turno.puedeGestionarse && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button
                    variant="contained"
                    startIcon={<CalendarMonthOutlinedIcon />}
                    onClick={() => {
                      setMostrandoReagendamiento(true);
                      if (horarios.length === 0) cargarHorarios();
                    }}
                    disabled={procesando}
                  >
                    Reagendar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<EventBusyOutlinedIcon />}
                    onClick={() => setMostrarCancelacion(true)}
                    disabled={procesando}
                  >
                    Cancelar turno
                  </Button>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>

        {mostrandoReagendamiento && turno.puedeGestionarse && (
          <Card>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Elegí un nuevo horario
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Se mantiene el mismo prestador, especialidad y centro de
                    atención.
                  </Typography>
                </Box>

                {cargandoHorarios ? (
                  <Box
                    sx={{ py: 4, display: 'flex', justifyContent: 'center' }}
                  >
                    <CircularProgress size={28} />
                  </Box>
                ) : horarios.length === 0 ? (
                  <Alert severity="info">
                    No encontramos horarios alternativos disponibles en las
                    próximas semanas.
                  </Alert>
                ) : (
                  <Grid container spacing={1.5}>
                    {horarios.map((horario) => (
                      <Grid
                        key={`${horario.fecha}-${horario.hora}`}
                        size={{ xs: 12, sm: 6, md: 4 }}
                      >
                        <Button
                          variant="outlined"
                          fullWidth
                          disabled={procesando}
                          onClick={() => reagendar(horario)}
                          sx={{ py: 1.5, justifyContent: 'flex-start' }}
                        >
                          {formatearFecha(horario.fecha)} · {horario.hora}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                )}

                <Button
                  sx={{ alignSelf: 'flex-start' }}
                  onClick={() => setMostrandoReagendamiento(false)}
                >
                  Volver al turno
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        <Alert severity="info" variant="outlined">
          Por seguridad, la clave incluida en el enlace se mantiene solo durante
          esta visita y no se guarda en el navegador.
        </Alert>
      </Stack>

      <Dialog
        open={mostrarCancelacion}
        onClose={() => !procesando && setMostrarCancelacion(false)}
      >
        <DialogTitle>Cancelar turno</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Confirmás la cancelación del turno del{' '}
            {formatearFecha(turno.fecha)} a las {turno.hora}? Esta acción quedará
            registrada en el historial.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setMostrarCancelacion(false)}
            disabled={procesando}
          >
            Volver
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={cancelar}
            disabled={procesando}
          >
            {procesando ? 'Cancelando…' : 'Cancelar turno'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
