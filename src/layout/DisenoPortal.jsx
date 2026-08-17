import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import { Outlet, useNavigate } from 'react-router-dom';
import LogoMarca from '../components/common/BrandLogo';
import PiePagina from '../components/Footer';
import { limpiarSesion, obtenerSesion } from '../services/portal';

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

export default function DisenoPortal() {
  const tema = useTheme();
  const esMobile = useMediaQuery(tema.breakpoints.down('md'));
  const navegar = useNavigate();
  const { token, usuario } = obtenerSesion();
  const mostrarNavegacion = Boolean(token && usuario);
  const [barraAbierta, setBarraAbierta] = useState(false);
  const [menuMobileAbierto, setMenuMobileAbierto] = useState(false);
  const [elementoActivo, setElementoActivo] = useState('resumen');

  const elementos =
    usuario?.rol === 'PRESTADOR' ? ELEMENTOS_PRESTADOR : ELEMENTOS_AFILIADO;
  const anchoBarra = barraAbierta ? ANCHO_BARRA_ABIERTA : ANCHO_BARRA_CERRADA;

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
    <>
      <List sx={{ px: 1, pt: 1.5, flexGrow: 1 }}>
        {elementos.map((elemento) => {
          const Icono = elemento.icono;
          const seleccionado = elementoActivo === elemento.clave;

          const boton = (
            <ListItemButton
              key={elemento.clave}
              selected={seleccionado}
              onClick={() => seleccionarElemento(elemento)}
              sx={{
                minHeight: 56,
                mb: 0.75,
                px: abierta ? 2 : 1.5,
                borderRadius: 2,
                justifyContent: abierta ? 'initial' : 'center',
                color: seleccionado ? '#fff' : 'rgba(255,255,255,0.86)',
                backgroundColor: seleccionado
                  ? 'rgba(0,177,234,0.18)'
                  : 'transparent',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0,177,234,0.18)',
                },
                '&.Mui-selected:hover, &:hover': {
                  backgroundColor: 'rgba(0,177,234,0.26)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: abierta ? 44 : 0,
                  color: seleccionado ? COLOR_PRINCIPAL : '#fff',
                  justifyContent: 'center',
                }}
              >
                <Icono />
              </ListItemIcon>
              {abierta && (
                <ListItemText
                  primary={elemento.etiqueta}
                  primaryTypographyProps={{
                    fontSize: 16,
                    fontWeight: seleccionado ? 600 : 500,
                  }}
                />
              )}
            </ListItemButton>
          );

          return abierta ? (
            boton
          ) : (
            <Tooltip key={elemento.clave} title={elemento.etiqueta} placement="right">
              {boton}
            </Tooltip>
          );
        })}
      </List>
    </>
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
              boxShadow:
                '0 6px 10px rgba(0,0,0,0.15), 0 2px 3px rgba(0,0,0,0.3)',
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
            boxShadow:
              '0 1px 4px rgba(12,12,13,0.10), 0 1px 4px rgba(12,12,13,0.05)',
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
        <Container
          maxWidth="lg"
          sx={{
            pt: 3,
            flexGrow: 1,
            mb: 4,
          }}
        >
          {mostrarNavegacion && (
            <Typography
              sx={{
                color: '#9B9B9B',
                fontSize: 16,
                fontWeight: 600,
                mb: 3,
              }}
            >
              Home
            </Typography>
          )}
          <Outlet />
        </Container>
      </Box>

      <PiePagina
        sx={{
          pl:
            mostrarNavegacion && !esMobile
              ? `${anchoBarra + 16}px`
              : '16px',
          transition: 'padding 0.3s ease',
        }}
      />
    </Box>
  );
}
