import { useEffect, useMemo, useState } from 'react';
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
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import { portalPrestador } from '../../services/portal';

const obtenerMensajeError = (error) =>
  error.response?.data?.mensaje ||
  error.message ||
  'Ocurrió un error inesperado';

const formatearCredencial = (afiliado) =>
  `${String(afiliado?.numeroAfiliado || '').padStart(7, '0')}-${String(
    afiliado?.numeroIntegrante || ''
  ).padStart(2, '0')}`;

const formatearFecha = (valor) => {
  if (!valor) return 'Sin fecha';
  return new Date(valor).toLocaleDateString('es-AR');
};

const formatearFechaHora = (valor) => {
  if (!valor) return 'Sin fecha';
  return new Date(valor).toLocaleString('es-AR');
};

const obtenerTelefonoPrincipal = (afiliado) =>
  afiliado?.telefonos?.[0]?.numero || 'Sin teléfono';

export default function HistoriaClinicaPrestador() {
  const [busqueda, setBusqueda] = useState('');
  const [afiliados, setAfiliados] = useState([]);
  const [afiliadoSeleccionado, setAfiliadoSeleccionado] = useState(null);
  const [situaciones, setSituaciones] = useState([]);
  const [historia, setHistoria] = useState([]);
  const [soloMias, setSoloMias] = useState(false);
  const [catalogoSituaciones, setCatalogoSituaciones] = useState([]);
  const [situacionNuevaId, setSituacionNuevaId] = useState('');
  const [dialogoSituacionAbierto, setDialogoSituacionAbierto] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [cargandoFicha, setCargandoFicha] = useState(false);
  const [guardandoSituacion, setGuardandoSituacion] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    portalPrestador
      .obtenerCatalogoSituaciones()
      .then((datos) => {
        if (activo) setCatalogoSituaciones(datos || []);
      })
      .catch((errorPeticion) => {
        if (activo) setError(obtenerMensajeError(errorPeticion));
      });

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    const texto = busqueda.trim();

    if (texto.length < 2) {
      setAfiliados([]);
      setBuscando(false);
      return undefined;
    }

    let activo = true;
    const temporizador = setTimeout(async () => {
      try {
        setBuscando(true);
        setError('');
        const resultados = await portalPrestador.buscarAfiliados(texto);
        if (activo) setAfiliados(resultados || []);
      } catch (errorPeticion) {
        if (activo) setError(obtenerMensajeError(errorPeticion));
      } finally {
        if (activo) setBuscando(false);
      }
    }, 350);

    return () => {
      activo = false;
      clearTimeout(temporizador);
    };
  }, [busqueda]);

  const cargarFicha = async (afiliado, soloPropias = soloMias) => {
    try {
      setCargandoFicha(true);
      setError('');
      const [datosSituaciones, datosHistoria] = await Promise.all([
        portalPrestador.obtenerSituaciones(afiliado._id),
        portalPrestador.obtenerHistoria(afiliado._id, soloPropias),
      ]);
      setSituaciones(datosSituaciones.situaciones || []);
      setHistoria(datosHistoria || []);
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    } finally {
      setCargandoFicha(false);
    }
  };

  const seleccionarAfiliado = async (afiliado) => {
    setAfiliadoSeleccionado(afiliado);
    setSoloMias(false);
    await cargarFicha(afiliado, false);
  };

  const cambiarFiltroHistoria = async (soloPropias) => {
    setSoloMias(soloPropias);
    if (!afiliadoSeleccionado) return;

    try {
      setCargandoFicha(true);
      setHistoria(
        await portalPrestador.obtenerHistoria(
          afiliadoSeleccionado._id,
          soloPropias
        )
      );
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    } finally {
      setCargandoFicha(false);
    }
  };

  const abrirRegistroSituacion = () => {
    setSituacionNuevaId('');
    setDialogoSituacionAbierto(true);
  };

  const registrarSituacion = async () => {
    if (!afiliadoSeleccionado || !situacionNuevaId) return;

    try {
      setGuardandoSituacion(true);
      setError('');
      await portalPrestador.crearSituacion({
        afiliadoId: afiliadoSeleccionado._id,
        situacionTerapeuticaId: situacionNuevaId,
        fechaInicio: new Date().toISOString(),
        activa: true,
      });
      setDialogoSituacionAbierto(false);
      await cargarFicha(afiliadoSeleccionado, soloMias);
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    } finally {
      setGuardandoSituacion(false);
    }
  };

  const finalizarSituacion = async (situacionId) => {
    if (!afiliadoSeleccionado) return;

    try {
      setError('');
      await portalPrestador.modificarSituacion(situacionId, {
        fechaFin: new Date().toISOString(),
        activa: false,
      });
      await cargarFicha(afiliadoSeleccionado, soloMias);
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const situacionesOrdenadas = useMemo(
    () =>
      [...situaciones].sort((primera, segunda) => {
        if (primera.activa !== segunda.activa) return primera.activa ? -1 : 1;
        return new Date(segunda.fechaInicio) - new Date(primera.fechaInicio);
      }),
    [situaciones]
  );

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Historia clínica
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Buscá un paciente y consultá su información clínica sin salir de esta
          sección.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        value={busqueda}
        onChange={(evento) => setBusqueda(evento.target.value)}
        label="Buscar paciente"
        placeholder="Nombre, apellido, DNI, credencial o teléfono"
        helperText="La búsqueda comienza automáticamente desde 2 caracteres."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: buscando ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null,
          },
        }}
      />

      {busqueda.trim().length >= 2 && afiliados.length > 0 && (
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Paciente</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>DNI</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Credencial</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Teléfono</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Acción
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {afiliados.map((afiliado) => (
                  <TableRow
                    hover
                    key={afiliado._id}
                    selected={afiliadoSeleccionado?._id === afiliado._id}
                  >
                    <TableCell>
                      <Typography fontWeight={600}>
                        {afiliado.nombre} {afiliado.apellido}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Plan {afiliado.plan || 'sin informar'}
                      </Typography>
                    </TableCell>
                    <TableCell>{afiliado.dni || '—'}</TableCell>
                    <TableCell>{formatearCredencial(afiliado)}</TableCell>
                    <TableCell>{obtenerTelefonoPrincipal(afiliado)}</TableCell>
                    <TableCell align="right">
                      <Button onClick={() => seleccionarAfiliado(afiliado)}>
                        Ver historia clínica
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {busqueda.trim().length >= 2 &&
        !buscando &&
        afiliados.length === 0 &&
        !afiliadoSeleccionado && (
          <Alert severity="info">No se encontraron pacientes.</Alert>
        )}

      {afiliadoSeleccionado && (
        <>
          <Card>
            <CardContent>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ sm: 'center' }}
                gap={2}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PersonOutlineIcon color="primary" />
                  <Box>
                    <Typography variant="h6">
                      {afiliadoSeleccionado.nombre}{' '}
                      {afiliadoSeleccionado.apellido}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      DNI {afiliadoSeleccionado.dni} · Credencial{' '}
                      {formatearCredencial(afiliadoSeleccionado)} · Plan{' '}
                      {afiliadoSeleccionado.plan}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setAfiliadoSeleccionado(null);
                    setSituaciones([]);
                    setHistoria([]);
                    setBusqueda('');
                  }}
                >
                  Cambiar paciente
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {cargandoFicha ? (
            <Stack alignItems="center" py={5}>
              <CircularProgress />
            </Stack>
          ) : (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={1}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <MedicalInformationOutlinedIcon color="primary" />
                        <Typography variant="h6">
                          Situaciones terapéuticas
                        </Typography>
                      </Stack>
                      <Button size="small" onClick={abrirRegistroSituacion}>
                        Registrar
                      </Button>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {situacionesOrdenadas.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Sin situaciones registradas.
                      </Typography>
                    ) : (
                      <Stack spacing={1.5}>
                        {situacionesOrdenadas.map((situacion) => (
                          <Box key={situacion._id}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              gap={1}
                            >
                              <Box>
                                <Typography fontWeight={600}>
                                  {situacion.situacionTerapeuticaId?.nombre ||
                                    'Situación terapéutica'}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {situacion.afiliadoId?.nombre}{' '}
                                  {situacion.afiliadoId?.apellido}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Desde {formatearFecha(situacion.fechaInicio)}
                                  {situacion.fechaFin
                                    ? ` · Hasta ${formatearFecha(
                                        situacion.fechaFin
                                      )}`
                                    : ''}
                                </Typography>
                              </Box>
                              <Chip
                                size="small"
                                label={
                                  situacion.activa ? 'Activa' : 'Finalizada'
                                }
                                color={situacion.activa ? 'success' : 'default'}
                              />
                            </Stack>
                            {situacion.activa && (
                              <Button
                                size="small"
                                color="warning"
                                sx={{ mt: 0.5 }}
                                onClick={() =>
                                  finalizarSituacion(situacion._id)
                                }
                              >
                                Finalizar
                              </Button>
                            )}
                            <Divider sx={{ mt: 1.5 }} />
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ sm: 'center' }}
                      gap={1}
                    >
                      <Typography variant="h6">Evolución clínica</Typography>
                      <Stack direction="row" gap={1}>
                        <Button
                          size="small"
                          variant={!soloMias ? 'contained' : 'outlined'}
                          onClick={() => cambiarFiltroHistoria(false)}
                        >
                          Toda la historia
                        </Button>
                        <Button
                          size="small"
                          variant={soloMias ? 'contained' : 'outlined'}
                          onClick={() => cambiarFiltroHistoria(true)}
                        >
                          Solo mis notas
                        </Button>
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {historia.length === 0 ? (
                      <Alert severity="info">
                        No hay notas registradas en la historia clínica.
                      </Alert>
                    ) : (
                      <Stack spacing={2}>
                        {historia.map((registro) => (
                          <Box
                            key={registro._id}
                            sx={{
                              borderLeft: '3px solid',
                              borderColor: 'primary.main',
                              pl: 2,
                              py: 0.5,
                            }}
                          >
                            <Typography>{registro.nota}</Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.75 }}
                            >
                              {formatearFechaHora(registro.fecha)} ·{' '}
                              {registro.prestadorId?.nombre || 'Prestador'}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      )}

      <Dialog
        open={dialogoSituacionAbierto}
        onClose={() => !guardandoSituacion && setDialogoSituacionAbierto(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Registrar situación terapéutica</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Situación terapéutica"
            value={situacionNuevaId}
            onChange={(evento) => setSituacionNuevaId(evento.target.value)}
            sx={{ mt: 1 }}
          >
            {catalogoSituaciones.map((situacion) => (
              <MenuItem key={situacion._id} value={situacion._id}>
                {situacion.nombre}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogoSituacionAbierto(false)}
            disabled={guardandoSituacion}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={registrarSituacion}
            disabled={!situacionNuevaId || guardandoSituacion}
          >
            {guardandoSituacion ? 'Guardando...' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
