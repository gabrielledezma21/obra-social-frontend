import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { limpiarSesion, portalPrestador } from '../../services/portal';

const obtenerMensajeError = (error) =>
  error.response?.data?.mensaje || error.message || 'Ocurrió un error inesperado';

function Estadistica({ etiqueta, valor }) {
  return (
    <Card>
      <CardContent>
        <Typography color="text.secondary">{etiqueta}</Typography>
        <Typography variant="h4">{valor ?? 0}</Typography>
      </CardContent>
    </Card>
  );
}

export default function PortalPrestador() {
  const [pestana, setPestana] = useState(0);
  const [perfil, setPerfil] = useState(null);
  const [resumen, setResumen] = useState({});
  const [solicitudes, setSolicitudes] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [especialidadTurnos, setEspecialidadTurnos] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [afiliados, setAfiliados] = useState([]);
  const [afiliadoSeleccionado, setAfiliadoSeleccionado] = useState(null);
  const [situaciones, setSituaciones] = useState([]);
  const [historia, setHistoria] = useState([]);
  const [soloMias, setSoloMias] = useState(false);
  const [error, setError] = useState('');
  const navegar = useNavigate();

  const cargarDatos = async (especialidad = especialidadTurnos) => {
    try {
      const [
        perfilObtenido,
        resumenObtenido,
        solicitudesObtenidas,
        turnosObtenidos,
      ] = await Promise.all([
        portalPrestador.obtenerPerfil(),
        portalPrestador.obtenerResumen(),
        portalPrestador.obtenerSolicitudes(),
        portalPrestador.obtenerTurnos(especialidad),
      ]);

      setPerfil(perfilObtenido);
      setResumen(resumenObtenido);
      setSolicitudes(solicitudesObtenidas);
      setTurnos(turnosObtenidos);
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  useEffect(() => {
    cargarDatos('');
  }, []);

  const bandejaSolicitudes = useMemo(() => {
    const ordenEstados = {
      'En análisis': 0,
      Observado: 1,
      Recibido: 2,
      Aprobado: 3,
      Rechazado: 4,
    };

    return solicitudes.slice().sort(
      (primera, segunda) =>
        (ordenEstados[primera.estado] ?? 9) -
        (ordenEstados[segunda.estado] ?? 9)
    );
  }, [solicitudes]);

  const cambiarEstado = async (id, estado) => {
    let motivo = '';
    if (['Observado', 'Rechazado'].includes(estado)) {
      motivo =
        window.prompt(`Motivo para marcar como ${estado.toLowerCase()}:`) || '';
      if (!motivo) return;
    }

    try {
      await portalPrestador.cambiarEstado(id, estado, motivo);
      await cargarDatos();
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const buscarAfiliados = async () => {
    try {
      setAfiliados(await portalPrestador.buscarAfiliados(busqueda));
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const seleccionarAfiliado = async (afiliado) => {
    setAfiliadoSeleccionado(afiliado);

    try {
      const [datosSituaciones, datosHistoria] = await Promise.all([
        portalPrestador.obtenerSituaciones(afiliado._id),
        portalPrestador.obtenerHistoria(afiliado._id, soloMias),
      ]);
      setSituaciones(datosSituaciones.situaciones || []);
      setHistoria(datosHistoria || []);
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const recargarHistoria = async (soloPropias) => {
    setSoloMias(soloPropias);
    if (!afiliadoSeleccionado) return;

    try {
      setHistoria(
        await portalPrestador.obtenerHistoria(
          afiliadoSeleccionado._id,
          soloPropias
        )
      );
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const agregarSituacion = async () => {
    if (!afiliadoSeleccionado) return;

    const situacionTerapeuticaId = window.prompt(
      'ID de la situación terapéutica a registrar'
    );
    if (!situacionTerapeuticaId) return;

    try {
      await portalPrestador.crearSituacion({
        afiliadoId: afiliadoSeleccionado._id,
        situacionTerapeuticaId,
        fechaInicio: new Date().toISOString(),
      });
      await seleccionarAfiliado(afiliadoSeleccionado);
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const finalizarSituacion = async (situacionId) => {
    try {
      await portalPrestador.modificarSituacion(situacionId, {
        fechaFin: new Date().toISOString(),
        activa: false,
      });
      await seleccionarAfiliado(afiliadoSeleccionado);
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const agregarNota = async (turno) => {
    const nota = window.prompt('Nota de atención para la historia clínica');
    if (!nota) return;

    try {
      await portalPrestador.agregarNota(turno._id, nota);
      await cargarDatos();
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const filtrarTurnos = async (valor) => {
    setEspecialidadTurnos(valor);
    try {
      setTurnos(await portalPrestador.obtenerTurnos(valor));
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const cerrarSesion = () => {
    limpiarSesion();
    navegar('/portal/acceso');
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        gap={2}
      >
        <Box>
          <Typography variant="h4">Portal del prestador</Typography>
          <Typography color="text.secondary">
            {perfil?.nombre || 'Cargando...'}
          </Typography>
        </Box>
        <Button onClick={cerrarSesion}>Cerrar sesión</Button>
      </Stack>

      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Estadistica etiqueta="Pendientes" valor={resumen.pendientes} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Estadistica etiqueta="Resueltas" valor={resumen.resueltas} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Estadistica etiqueta="Turnos" valor={turnos.length} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Estadistica
            etiqueta="Procesadas hoy"
            valor={(resumen.porDia || []).find(
              (registro) =>
                registro.fecha === new Date().toISOString().slice(0, 10)
            )?.cantidad}
          />
        </Grid>
      </Grid>

      <Tabs
        value={pestana}
        onChange={(_evento, valor) => setPestana(valor)}
        variant="scrollable"
      >
        <Tab label="Bandeja de solicitudes" />
        <Tab label="Turnos" />
        <Tab label="Afiliados y situaciones" />
        <Tab label="Historia clínica" />
      </Tabs>

      {pestana === 0 && (
        <Stack spacing={2}>
          {bandejaSolicitudes.map((solicitud) => (
            <Card key={solicitud._id}>
              <CardContent>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  justifyContent="space-between"
                  gap={2}
                >
                  <Box>
                    <Typography variant="h6">{solicitud.tipo}</Typography>
                    <Typography>
                      {solicitud.afiliadoId?.nombre}{' '}
                      {solicitud.afiliadoId?.apellido}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {solicitud.prestadorId?.nombre ||
                        'Procesable por cualquier prestador'}
                    </Typography>
                  </Box>
                  <Chip label={solicitud.estado} />
                </Stack>
                <Stack direction="row" flexWrap="wrap" gap={1} mt={2}>
                  {solicitud.estado === 'Recibido' && (
                    <Button
                      variant="contained"
                      onClick={() =>
                        cambiarEstado(solicitud._id, 'En análisis')
                      }
                    >
                      Tomar solicitud
                    </Button>
                  )}
                  {solicitud.estado === 'En análisis' && (
                    <>
                      <Button
                        onClick={() => cambiarEstado(solicitud._id, 'Observado')}
                      >
                        Observar
                      </Button>
                      <Button
                        color="success"
                        onClick={() => cambiarEstado(solicitud._id, 'Aprobado')}
                      >
                        Aprobar
                      </Button>
                      <Button
                        color="error"
                        onClick={() => cambiarEstado(solicitud._id, 'Rechazado')}
                      >
                        Rechazar
                      </Button>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {pestana === 1 && (
        <Stack spacing={2}>
          {perfil?.esCentroMedico && (
            <TextField
              select
              label="Especialidad del calendario"
              value={especialidadTurnos}
              onChange={(evento) => filtrarTurnos(evento.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {(perfil.especialidades || []).map((especialidad) => (
                <MenuItem key={especialidad._id} value={especialidad._id}>
                  {especialidad.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}

          {turnos.length === 0 ? (
            <Alert severity="info">No hay turnos asignados.</Alert>
          ) : (
            turnos.map((turno) => (
              <Card key={turno._id}>
                <CardContent>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    gap={2}
                  >
                    <Box>
                      <Typography variant="h6">
                        {turno.afiliadoId?.nombre} {turno.afiliadoId?.apellido}
                      </Typography>
                      <Typography>
                        {new Date(turno.fecha).toLocaleDateString('es-AR')} ·{' '}
                        {turno.hora}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {turno.prestadorId?.nombre}
                        {turno.agendaId?.especialidadId?.nombre
                          ? ` · ${turno.agendaId.especialidadId.nombre}`
                          : ''}
                      </Typography>
                    </Box>
                    <Chip label={turno.estado} />
                  </Stack>
                  {turno.estado === 'RESERVADO' && (
                    <Button
                      sx={{ mt: 2 }}
                      variant="contained"
                      onClick={() => agregarNota(turno)}
                    >
                      Registrar atención y nota
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      )}

      {pestana === 2 && (
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
            <TextField
              fullWidth
              label="Buscar por afiliado, apellido o teléfono"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              onKeyDown={(evento) =>
                evento.key === 'Enter' && buscarAfiliados()
              }
            />
            <Button variant="contained" onClick={buscarAfiliados}>
              Buscar
            </Button>
          </Stack>

          <Grid container spacing={2}>
            {afiliados.map((afiliado) => (
              <Grid key={afiliado._id} size={{ xs: 12, md: 6 }}>
                <Card
                  variant={
                    afiliadoSeleccionado?._id === afiliado._id
                      ? 'outlined'
                      : undefined
                  }
                >
                  <CardContent>
                    <Typography variant="h6">
                      {afiliado.nombre} {afiliado.apellido}
                    </Typography>
                    <Typography>
                      Credencial{' '}
                      {String(afiliado.numeroAfiliado || '').padStart(7, '0')}-
                      {String(afiliado.numeroIntegrante || '').padStart(2, '0')}
                    </Typography>
                    <Button onClick={() => seleccionarAfiliado(afiliado)}>
                      Ver grupo y situaciones
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {afiliadoSeleccionado && (
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">
                    Situaciones de {afiliadoSeleccionado.nombre}{' '}
                    {afiliadoSeleccionado.apellido}
                  </Typography>
                  <Button onClick={agregarSituacion}>Dar de alta</Button>
                </Stack>

                {situaciones.length === 0 ? (
                  <Typography color="text.secondary" mt={2}>
                    Sin situaciones registradas.
                  </Typography>
                ) : (
                  situaciones.map((situacion) => (
                    <Stack
                      key={situacion._id}
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      py={1}
                    >
                      <Box>
                        <Typography>
                          {situacion.afiliadoId?.nombre}{' '}
                          {situacion.afiliadoId?.apellido}:{' '}
                          {situacion.situacionTerapeuticaId?.nombre}
                        </Typography>
                        <Typography variant="body2">
                          Desde{' '}
                          {new Date(situacion.fechaInicio).toLocaleDateString(
                            'es-AR'
                          )}
                          {situacion.fechaFin
                            ? ` hasta ${new Date(
                                situacion.fechaFin
                              ).toLocaleDateString('es-AR')}`
                            : ''}
                        </Typography>
                      </Box>
                      {situacion.activa && (
                        <Button
                          color="warning"
                          onClick={() => finalizarSituacion(situacion._id)}
                        >
                          Dar de baja
                        </Button>
                      )}
                    </Stack>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </Stack>
      )}

      {pestana === 3 && (
        <Stack spacing={2}>
          {!afiliadoSeleccionado && (
            <Alert severity="info">
              Primero buscá y seleccioná un afiliado en la pestaña anterior.
            </Alert>
          )}
          {afiliadoSeleccionado && (
            <>
              <Stack direction="row" gap={1}>
                <Button
                  variant={!soloMias ? 'contained' : 'outlined'}
                  onClick={() => recargarHistoria(false)}
                >
                  Toda la historia
                </Button>
                <Button
                  variant={soloMias ? 'contained' : 'outlined'}
                  onClick={() => recargarHistoria(true)}
                >
                  Solo mis notas
                </Button>
              </Stack>

              {historia.length === 0 ? (
                <Alert severity="info">
                  No hay notas en la historia clínica.
                </Alert>
              ) : (
                historia.map((registro) => (
                  <Card key={registro._id}>
                    <CardContent>
                      <Typography>{registro.nota}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(registro.fecha).toLocaleString('es-AR')} ·{' '}
                        {registro.prestadorId?.nombre}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}
        </Stack>
      )}
    </Stack>
  );
}
