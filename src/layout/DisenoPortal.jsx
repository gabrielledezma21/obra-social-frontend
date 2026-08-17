import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import IconoMenu from '@mui/icons-material/Menu';
import IconoResumen from '@mui/icons-material/ShowChartOutlined';
import IconoSolicitudNueva from '@mui/icons-material/AddCircleOutline';
import IconoSolicitudes from '@mui/icons-material/FeedOutlined';
import IconoTurnos from '@mui/icons-material/CalendarTodayOutlined';
import IconoCartilla from '@mui/icons-material/MedicalInformationOutlined';
import IconoAfiliados from '@mui/icons-material/PeopleOutline';
import IconoHistoria from '@mui/icons-material/HistoryEduOutlined';
import IconoFlecha from '@mui/icons-material/ArrowForwardOutlined';
import { Outlet, useNavigate } from 'react-router-dom';
import LogoMarca from '../components/common/BrandLogo';
import PiePagina from '../components/Footer';
import {
  limpiarSesion,
  obtenerSesion,
  portalAfiliado,
  portalPrestador,
} from '../services/portal';
import '../components/common/navigation/Sidebar.css';
import '../components/common/navigation/SidebarItem.css';

const ANCHO_BARRA_ABIERTA = 280;
const ANCHO_BARRA_CERRADA = 70;
const COLOR_OSCURO = '#0B111E';
const COLOR_PRINCIPAL = '#00B1EA';
const COLOR_FONDO = '#F8F8F8';

const ELEMENTOS_AFILIADO = [
  { clave: 'resumen', etiqueta: 'Resumen', icono: IconoResumen },
  {
    clave: 'nueva-solicitud',
    etiqueta: 'Nueva solicitud',
    icono: IconoSolicitudNueva,
    pestana: 0,
  },
  {
    clave: 'solicitudes',
    etiqueta: 'Solicitudes',
    icono: IconoSolicitudes,
    pestana: 1,
  },
  { clave: 'turnos', etiqueta: 'Turnos', icono: IconoTurnos, pestana: 2 },
  {
    clave: 'cartilla',
    etiqueta: 'Cartilla médica',
    icono: IconoCartilla,
    pestana: 3,
  },
];

const ELEMENTOS_PRESTADOR = [
  { clave: 'resumen', etiqueta: 'Resumen', icono: IconoResumen },
  {
    clave: 'solicitudes',
    etiqueta: 'Solicitudes',
    icono: IconoSolicitudes,
    pestana: 0,
  },
  { clave: 'turnos', etiqueta: 'Turnos', icono: IconoTurnos, pestana: 1 },
  {
    clave: 'afiliados',
    etiqueta: 'Afiliados y situaciones',
    icono: IconoAfiliados,
    pestana: 2,
  },
  {
    clave: 'historia',
    etiqueta: 'Historia clínica',
    icono: IconoHistoria,
    pestana: 3,
  },
];

const obtenerMensajeError = (error) =>
  error.response?.data?.mensaje || error.message || 'No se pudo cargar el resumen';

const ordenarTurnos = (turnos) =>
  [...turnos].sort((primero, segundo) => {
    const fechaPrimero = new Date(`${String(primero.fecha).slice(0, 10)}T${primero.hora}`);
    const fechaSegundo = new Date(`${String(segundo.fecha).slice(0, 10)}T${segundo.hora}`);
    return fechaPrimero - fechaSegundo;
  });

function TarjetaMetrica({ titulo, valor, principal = false }) {
  return (
    <Card
      sx={{
        height: '100%',
        color: principal ? '#fff' : '#000',
        background: principal
          ? 'linear-gradient(180deg, #00B1EA 0%, #0077C8 100%)'
          : '#fff',
      }}
    >
      <CardContent>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 500,
            color: principal ? '#fff' : '#000',
          }}
        >
          {titulo}
        </Typography>
        <Typography sx={{ fontSize: 42, lineHeight: 1.15, fontWeight: 700, mt: 1 }}>
          {valor ?? 0}
        </Typography>
      </CardContent>
    </Card>
  );
}

function DashboardAfiliado({ datos, seleccionarElemento }) {
  const turnosProximos = useMemo(
    () =>
      ordenarTurnos(
        (datos.turnos || []).filter(
          (turno) => turno.estado === 'RESERVADO' && new Date(turno.fecha) >= new Date()
        )
      ).slice(0, 3),
    [datos.turnos]
  );

  const solicitudesAtencion = (datos.solicitudes || [])
    .filter((solicitud) => ['Recibido', 'En análisis', 'Observado'].includes(solicitud.estado))
    .slice(0, 4);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Portal del afiliado</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {datos.perfil
            ? `${datos.perfil.nombre} ${datos.perfil.apellido} · Credencial ${String(
                datos.perfil.numeroAfiliado || ''
              ).padStart(7, '0')}-${String(datos.perfil.numeroIntegrante || '').padStart(2, '0')}`
            : 'Resumen de tu cobertura y gestiones en MedIntegral'}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TarjetaMetrica
            titulo="Turnos próximos"
            valor={datos.resumen?.turnosProximos}
            principal
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TarjetaMetrica titulo="Solicitudes pendientes" valor={datos.resumen?.pendientes} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TarjetaMetrica titulo="Observadas" valor={datos.resumen?.observadas} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TarjetaMetrica titulo="Aprobadas 7 días" valor={datos.resumen?.aprobadasSemana} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Próximos turnos</Typography>
                <Button
                  endIcon={<IconoFlecha />}
                  onClick={() => seleccionarElemento(ELEMENTOS_AFILIADO[3])}
                >
                  Ver turnos
                </Button>
              </Stack>

              {turnosProximos.length === 0 ? (
                <Alert severity="info">
                  No tenés turnos próximos. Podés buscar disponibilidad desde Turnos.
                </Alert>
              ) : (
                <Stack spacing={1.5}>
                  {turnosProximos.map((turno) => (
                    <Box
                      key={turno._id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 1,
                        p: 1.5,
                        borderBottom: '1px solid #EAEAEA',
                      }}
                    >
                      <Box>
                        <Typography fontWeight={600}>{turno.prestadorId?.nombre}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(turno.fecha).toLocaleDateString('es-AR')} · {turno.hora}
                        </Typography>
                      </Box>
                      <Chip label={turno.estado} size="small" />
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Solicitudes a revisar</Typography>
                <Button onClick={() => seleccionarElemento(ELEMENTOS_AFILIADO[2])}>Ver todas</Button>
              </Stack>

              {solicitudesAtencion.length === 0 ? (
                <Typography color="text.secondary">No hay solicitudes pendientes.</Typography>
              ) : (
                <Stack spacing={1.25}>
                  {solicitudesAtencion.map((solicitud) => (
                    <Box
                      key={solicitud._id}
                      sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}
                    >
                      <Typography fontWeight={500}>{solicitud.tipo}</Typography>
                      <Chip label={solicitud.estado} size="small" />
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Accesos rápidos
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<IconoSolicitudNueva />}
              onClick={() => seleccionarElemento(ELEMENTOS_AFILIADO[1])}
            >
              Nueva solicitud
            </Button>
            <Button
              variant="outlined"
              startIcon={<IconoTurnos />}
              onClick={() => seleccionarElemento(ELEMENTOS_AFILIADO[3])}
            >
              Buscar turno
            </Button>
            <Button
              variant="outlined"
              startIcon={<IconoCartilla />}
              onClick={() => seleccionarElemento(ELEMENTOS_AFILIADO[4])}
            >
              Ver cartilla médica
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

function DashboardPrestador({ datos, seleccionarElemento }) {
  const turnosProximos = useMemo(
    () =>
      ordenarTurnos(
        (datos.turnos || []).filter(
          (turno) => turno.estado === 'RESERVADO' && new Date(turno.fecha) >= new Date()
        )
      ).slice(0, 4),
    [datos.turnos]
  );

  const solicitudesPendientes = (datos.solicitudes || [])
    .filter((solicitud) => ['Recibido', 'En análisis', 'Observado'].includes(solicitud.estado))
    .slice(0, 4);

  const pacientesRecientes = [];
  const identificadores = new Set();
  (datos.turnos || []).forEach((turno) => {
    const afiliado = turno.afiliadoId;
    if (afiliado?._id && !identificadores.has(afiliado._id)) {
      identificadores.add(afiliado._id);
      pacientesRecientes.push(afiliado);
    }
  });

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Portal del prestador</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {datos.perfil?.nombre || 'Resumen de actividad profesional en MedIntegral'}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TarjetaMetrica titulo="Turnos próximos" valor={turnosProximos.length} principal />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TarjetaMetrica titulo="Solicitudes pendientes" valor={datos.resumen?.pendientes} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TarjetaMetrica titulo="Solicitudes resueltas" valor={datos.resumen?.resueltas} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TarjetaMetrica titulo="Pacientes recientes" valor={pacientesRecientes.length} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Próximos turnos</Typography>
                <Button onClick={() => seleccionarElemento(ELEMENTOS_PRESTADOR[2])}>
                  Ver agenda
                </Button>
              </Stack>

              {turnosProximos.length === 0 ? (
                <Alert severity="info">No hay turnos próximos asignados.</Alert>
              ) : (
                <Stack spacing={1.25}>
                  {turnosProximos.map((turno) => (
                    <Box
                      key={turno._id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 1,
                        p: 1.5,
                        borderBottom: '1px solid #EAEAEA',
                      }}
                    >
                      <Box>
                        <Typography fontWeight={600}>
                          {turno.afiliadoId?.nombre} {turno.afiliadoId?.apellido}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(turno.fecha).toLocaleDateString('es-AR')} · {turno.hora}
                        </Typography>
                      </Box>
                      <Chip label={turno.estado} size="small" />
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Solicitudes pendientes</Typography>
                <Button onClick={() => seleccionarElemento(ELEMENTOS_PRESTADOR[1])}>Ver todas</Button>
              </Stack>

              {solicitudesPendientes.length === 0 ? (
                <Typography color="text.secondary">No hay solicitudes pendientes.</Typography>
              ) : (
                <Stack spacing={1.25}>
                  {solicitudesPendientes.map((solicitud) => (
                    <Box
                      key={solicitud._id}
                      sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}
                    >
                      <Box>
                        <Typography fontWeight={500}>{solicitud.tipo}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {solicitud.afiliadoId?.nombre} {solicitud.afiliadoId?.apellido}
                        </Typography>
                      </Box>
                      <Chip label={solicitud.estado} size="small" />
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Pacientes recientes</Typography>
            <Button onClick={() => seleccionarElemento(ELEMENTOS_PRESTADOR[3])}>
              Buscar pacientes
            </Button>
          </Stack>
          {pacientesRecientes.length === 0 ? (
            <Typography color="text.secondary">Todavía no hay pacientes recientes.</Typography>
          ) : (
            <Stack direction="row" gap={1} flexWrap="wrap">
              {pacientesRecientes.slice(0, 6).map((paciente) => (
                <Chip
                  key={paciente._id}
                  label={`${paciente.nombre} ${paciente.apellido}`}
                  variant="outlined"
                />
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}

export default function DisenoPortal() {
  const tema = useTheme();
  const esMobile = useMediaQuery(tema.breakpoints.down('md'));
  const navegar = useNavigate();
  const { token, usuario } = obtenerSesion();
  const mostrarNavegacion = Boolean(token && usuario);
  const [barraAbierta, setBarraAbierta] = useState(false);
  const [menuMobileAbierto, setMenuMobileAbierto] = useState(false);
  const [elementoActivo, setElementoActivo] = useState('resumen');
  const [datosResumen, setDatosResumen] = useState({
    perfil: null,
    resumen: {},
    turnos: [],
    solicitudes: [],
  });
  const [errorResumen, setErrorResumen] = useState('');

  const elementos =
    usuario?.rol === 'PRESTADOR' ? ELEMENTOS_PRESTADOR : ELEMENTOS_AFILIADO;
  const anchoBarra = barraAbierta ? ANCHO_BARRA_ABIERTA : ANCHO_BARRA_CERRADA;

  useEffect(() => {
    if (!mostrarNavegacion || !['AFILIADO', 'PRESTADOR'].includes(usuario?.rol)) return;

    let activo = true;

    const cargar = async () => {
      try {
        setErrorResumen('');
        const servicio = usuario.rol === 'PRESTADOR' ? portalPrestador : portalAfiliado;
        const [perfil, resumen, turnos, solicitudes] = await Promise.all([
          servicio.obtenerPerfil(),
          servicio.obtenerResumen(),
          usuario.rol === 'PRESTADOR' ? servicio.obtenerTurnos('') : servicio.obtenerTurnos(),
          servicio.obtenerSolicitudes(),
        ]);

        if (activo) {
          setDatosResumen({ perfil, resumen, turnos, solicitudes });
        }
      } catch (errorPeticion) {
        if (activo) setErrorResumen(obtenerMensajeError(errorPeticion));
      }
    };

    cargar();
    return () => {
      activo = false;
    };
  }, [mostrarNavegacion, usuario?.rol]);

  const cerrarSesion = () => {
    limpiarSesion();
    navegar('/portal/acceso');
  };

  const seleccionarElemento = (elemento) => {
    setElementoActivo(elemento.clave);
    setMenuMobileAbierto(false);

    if (elemento.pestana === undefined) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const pestanas = document.querySelectorAll('[role="tab"]');
    const pestanaObjetivo = pestanas[elemento.pestana];
    if (pestanaObjetivo) pestanaObjetivo.click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contenidoBarra = (abierta) => (
    <List className="sidebar-list" sx={{ flexGrow: 1 }}>
      {elementos.map((elemento) => {
        const Icono = elemento.icono;
        const seleccionado = elementoActivo === elemento.clave;

        const boton = (
          <ListItemButton
            key={elemento.clave}
            selected={seleccionado}
            onClick={() => seleccionarElemento(elemento)}
            className={`sidebar-item-button ${seleccionado ? 'active' : ''}`}
            sx={{ justifyContent: abierta ? 'initial' : 'center' }}
          >
            <ListItemIcon
              className={`sidebar-item-icon ${seleccionado ? 'active' : ''}`}
              sx={{ minWidth: abierta ? 40 : 0 }}
            >
              <Icono />
            </ListItemIcon>
            {abierta && (
              <ListItemText
                primary={elemento.etiqueta}
                className={`sidebar-item-text ${seleccionado ? 'active' : ''}`}
                primaryTypographyProps={{ fontSize: '1rem' }}
              />
            )}
          </ListItemButton>
        );

        return abierta ? (
          <Box
            key={elemento.clave}
            className={`sidebar-item ${seleccionado ? 'active' : ''}`}
          >
            {boton}
          </Box>
        ) : (
          <Tooltip key={elemento.clave} title={elemento.etiqueta} placement="right">
            <Box className={`sidebar-item collapsed ${seleccionado ? 'active' : ''}`}>
              {boton}
            </Box>
          </Tooltip>
        );
      })}
    </List>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLOR_FONDO,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: COLOR_OSCURO,
          color: '#fff',
          zIndex: (temaActual) => temaActual.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            minHeight: '64px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {mostrarNavegacion && (
              <IconButton
                color="inherit"
                onClick={() =>
                  esMobile
                    ? setMenuMobileAbierto(true)
                    : setBarraAbierta((abierta) => !abierta)
                }
              >
                <IconoMenu />
              </IconButton>
            )}
            <LogoMarca clickable={false} size="medium" />
          </Box>

          {mostrarNavegacion ? (
            <Button
              color="inherit"
              onClick={cerrarSesion}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Cerrar sesión
            </Button>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.72)',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Portal MedIntegral
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      {mostrarNavegacion && !esMobile && (
        <Drawer
          variant="permanent"
          open={barraAbierta}
          className={!barraAbierta ? 'sidebar-collapsed' : ''}
          sx={{
            width: anchoBarra,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: anchoBarra,
              boxSizing: 'border-box',
              backgroundColor: COLOR_OSCURO,
              color: '#fff',
              borderRight: 'none',
              overflowX: 'hidden',
              paddingTop: '68px',
              transition: 'width 0.3s ease',
              boxShadow: '0 6px 10px rgba(0,0,0,0.15), 0 2px 3px rgba(0,0,0,0.3)',
            },
          }}
        >
          {contenidoBarra(barraAbierta)}
        </Drawer>
      )}

      {mostrarNavegacion && esMobile && (
        <Drawer
          open={menuMobileAbierto}
          onClose={() => setMenuMobileAbierto(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              backgroundColor: COLOR_OSCURO,
              color: '#fff',
              pt: 2,
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <LogoMarca clickable={false} size="medium" />
          </Box>
          {contenidoBarra(true)}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8,
          ml: mostrarNavegacion && !esMobile ? `${anchoBarra}px` : 0,
          pb: 5,
          transition: 'margin 0.3s ease',
          '& .MuiTypography-h4': {
            fontSize: { xs: '1.75rem', md: '2rem' },
            lineHeight: 1.15,
            fontWeight: 600,
            color: '#000',
          },
          '& .MuiTypography-h6': {
            fontSize: '1.35rem',
            lineHeight: 1.2,
            fontWeight: 600,
          },
          '& .MuiCard-root': {
            borderRadius: '10px',
            boxShadow: '0 1px 4px rgba(12,12,13,0.10), 0 1px 4px rgba(12,12,13,0.05)',
            border: 'none',
            backgroundColor: '#fff',
          },
          '& .MuiCardContent-root': {
            padding: '16px',
            '&:last-child': { paddingBottom: '16px' },
          },
          '& .MuiTabs-root': {
            display: mostrarNavegacion ? 'none' : 'flex',
          },
          '& .MuiButton-root': {
            minHeight: 43,
            borderRadius: '8px',
            boxShadow: 'none',
            textTransform: 'none',
            fontWeight: 600,
          },
          '& .MuiButton-contained': {
            backgroundColor: COLOR_PRINCIPAL,
            '&:hover': { backgroundColor: '#0099cc', boxShadow: 'none' },
          },
          '& .MuiTextField-root .MuiOutlinedInput-root': {
            minHeight: 56,
            borderRadius: '8px',
            backgroundColor: '#fff',
          },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D9D9D9' },
          '& .MuiChip-root': { borderRadius: '8px', fontWeight: 500 },
        }}
      >
        <Container maxWidth="lg" sx={{ pt: 3, flexGrow: 1, mb: 4 }}>
          {mostrarNavegacion && (
            <Typography sx={{ color: '#9B9B9B', fontSize: 16, fontWeight: 600, mb: 3 }}>
              Home
            </Typography>
          )}

          {errorResumen && elementoActivo === 'resumen' && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorResumen}
            </Alert>
          )}

          {mostrarNavegacion && elementoActivo === 'resumen' ? (
            usuario?.rol === 'PRESTADOR' ? (
              <DashboardPrestador datos={datosResumen} seleccionarElemento={seleccionarElemento} />
            ) : (
              <DashboardAfiliado datos={datosResumen} seleccionarElemento={seleccionarElemento} />
            )
          ) : null}

          <Box sx={{ display: mostrarNavegacion && elementoActivo === 'resumen' ? 'none' : 'block' }}>
            <Outlet />
          </Box>
        </Container>
      </Box>

      <PiePagina
        sx={{
          pl: mostrarNavegacion && !esMobile ? `${anchoBarra + 16}px` : '16px',
          transition: 'padding 0.3s ease',
        }}
      />
    </Box>
  );
}
