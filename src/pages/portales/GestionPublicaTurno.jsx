import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { autogestionTurnos } from '../../services/portal';

const formatearFecha = (valor) => {
  const texto = String(valor || '').slice(0, 10);
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  return coincidencia
    ? `${coincidencia[3]}/${coincidencia[2]}/${coincidencia[1]}`
    : texto;
};

const obtenerMensajeError = (error) =>
  error.response?.data?.mensaje ||
  error.message ||
  'No se pudo gestionar el turno';

export default function GestionPublicaTurno() {
  const navegar = useNavigate();
  const [codigoReserva, setCodigoReserva] = useState('');
  const [tokenGestion, setTokenGestion] = useState('');
  const [turno, setTurno] = useState(null);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [buscandoDisponibilidad, setBuscandoDisponibilidad] = useState(false);

  const credenciales = {
    codigoReserva: codigoReserva.trim().toUpperCase(),
    tokenGestion: tokenGestion.trim(),
  };

  const consultar = async (evento) => {
    evento.preventDefault();
    setError('');
    setMensaje('');
    setDisponibilidad([]);
    setCargando(true);

    try {
      const resultado = await autogestionTurnos.consultar(credenciales);
      setCodigoReserva(resultado.codigoReserva || credenciales.codigoReserva);
      setTurno(resultado);
    } catch (errorPeticion) {
      setTurno(null);
      setError(obtenerMensajeError(errorPeticion));
    } finally {
      setCargando(false);
    }
  };

  const buscarDisponibilidad = async () => {
    setError('');
    setMensaje('');
    setBuscandoDisponibilidad(true);

    try {
      const horarios = await autogestionTurnos.obtenerDisponibilidad(
        credenciales
      );
      setDisponibilidad(horarios);
      if (horarios.length === 0) {
        setMensaje('No encontramos otros horarios disponibles por el momento.');
      }
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    } finally {
      setBuscandoDisponibilidad(false);
    }
  };

  const reagendar = async (horario) => {
    if (
      !window.confirm(
        `¿Reagendar el turno para el ${formatearFecha(horario.fecha)} a las ${horario.hora}?`
      )
    ) {
      return;
    }

    setError('');
    setMensaje('');
    try {
      const actualizado = await autogestionTurnos.reagendar(
        credenciales,
        horario
      );
      setTurno(actualizado);
      setDisponibilidad([]);
      setMensaje('El turno fue reagendado correctamente.');
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const cancelar = async () => {
    if (!window.confirm('¿Confirmás que querés cancelar este turno?')) return;

    setError('');
    setMensaje('');
    try {
      const actualizado = await autogestionTurnos.cancelar(credenciales);
      setTurno(actualizado);
      setDisponibilidad([]);
      setMensaje('El turno fue cancelado correctamente.');
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const estadoColor = turno?.estado === 'RESERVADO' ? 'primary' : 'default';

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 2 }}>
      <Stack spacing={3}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navegar('/portal/acceso')}
            sx={{ mb: 1 }}
          >
            Volver al acceso
          </Button>
          <Typography variant="h4" fontWeight={600}>
            Gestionar un turno
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Consultá, cancelá o cambiá tu turno usando el código de reserva y la
            clave de gestión que recibiste al reservar.
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Stack component="form" spacing={2} onSubmit={consultar}>
              <TextField
                label="Código de reserva"
                placeholder="MED-ABC234"
                value={codigoReserva}
                onChange={(evento) => setCodigoReserva(evento.target.value)}
                inputProps={{ maxLength: 10 }}
                required
              />
              <TextField
                label="Clave de gestión"
                type="password"
                value={tokenGestion}
                onChange={(evento) => setTokenGestion(evento.target.value)}
                autoComplete="off"
                required
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
                disabled={cargando}
              >
                {cargando ? 'Consultando...' : 'Consultar turno'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {error && <Alert severity="error">{error}</Alert>}
        {mensaje && <Alert severity="success">{mensaje}</Alert>}

        {turno && (
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  gap={1}
                >
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      {turno.prestador?.nombre || 'Turno médico'}
                    </Typography>
                    <Typography color="text.secondary">
                      Código {turno.codigoReserva}
                    </Typography>
                  </Box>
                  <Chip label={turno.estado} color={estadoColor} />
                </Stack>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha y hora
                    </Typography>
                    <Typography fontWeight={600}>
                      {formatearFecha(turno.fecha)} · {turno.hora}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Paciente
                    </Typography>
                    <Typography fontWeight={600}>
                      {`${turno.afiliado?.nombre || ''} ${turno.afiliado?.apellido || ''}`.trim() ||
                        'Afiliado'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Especialidad
                    </Typography>
                    <Typography>
                      {turno.agenda?.especialidad?.nombre || 'Sin informar'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Centro
                    </Typography>
                    <Typography>
                      {turno.agenda?.centro?.nombre ||
                        turno.agenda?.centro?.direccionId?.localidad ||
                        'Sin informar'}
                    </Typography>
                  </Grid>
                </Grid>

                {turno.estado === 'RESERVADO' && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
                    <Button
                      variant="contained"
                      startIcon={<EventRepeatIcon />}
                      onClick={buscarDisponibilidad}
                      disabled={buscandoDisponibilidad}
                    >
                      {buscandoDisponibilidad
                        ? 'Buscando...'
                        : 'Cambiar turno'}
                    </Button>
                    <Button color="error" variant="outlined" onClick={cancelar}>
                      Cancelar turno
                    </Button>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}

        {disponibilidad.length > 0 && (
          <Box>
            <Typography variant="h6" mb={1.5}>
              Horarios disponibles
            </Typography>
            <Grid container spacing={2}>
              {disponibilidad.map((horario) => (
                <Grid
                  key={`${horario.agendaId}-${horario.fecha}-${horario.hora}`}
                  size={{ xs: 12, sm: 6, md: 4 }}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <Typography fontWeight={600}>
                        {formatearFecha(horario.fecha)}
                      </Typography>
                      <Typography color="text.secondary">
                        {horario.hora}
                      </Typography>
                      <Button
                        fullWidth
                        sx={{ mt: 1.5 }}
                        onClick={() => reagendar(horario)}
                      >
                        Elegir horario
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
