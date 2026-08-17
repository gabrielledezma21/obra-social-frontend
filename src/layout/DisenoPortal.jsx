import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import IconoInicio from '@mui/icons-material/HomeOutlined';
import IconoSalir from '@mui/icons-material/LogoutOutlined';
import IconoPersona from '@mui/icons-material/PersonOutlined';
import IconoPrestador from '@mui/icons-material/MedicalInformationOutlined';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import LogoMarca from '../components/common/BrandLogo';
import PiePagina from '../components/Footer';
import { limpiarSesion, obtenerSesion } from '../services/portal';

const ANCHO_BARRA = 94;
const COLOR_OSCURO = '#0B111E';
const COLOR_PRINCIPAL = '#00B1EA';
const COLOR_FONDO = '#F8F8F8';

const obtenerRutaPrincipal = (rol) => {
  if (rol === 'AFILIADO') return '/portal/afiliado';
  if (rol === 'PRESTADOR') return '/portal/prestador';
  if (rol === 'ADMIN') return '/';
  return '/portal/acceso';
};

export default function DisenoPortal() {
  const tema = useTheme();
  const esMobile = useMediaQuery(tema.breakpoints.down('md'));
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const { token, usuario } = obtenerSesion();
  const mostrarNavegacion = Boolean(token && usuario);

  const cerrarSesion = () => {
    limpiarSesion();
    navegar('/portal/acceso');
  };

  const irAlInicio = () => navegar(obtenerRutaPrincipal(usuario?.rol));

  const IconoRol = usuario?.rol === 'PRESTADOR' ? IconoPrestador : IconoPersona;

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
      {mostrarNavegacion && !esMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: ANCHO_BARRA,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: ANCHO_BARRA,
              boxSizing: 'border-box',
              backgroundColor: COLOR_OSCURO,
              color: '#fff',
              borderRight: 'none',
              px: 1.5,
              py: 3,
              alignItems: 'center',
              boxShadow:
                '0 6px 10px rgba(0,0,0,0.15), 0 2px 3px rgba(0,0,0,0.3)',
            },
          }}
        >
          <Box sx={{ mb: 6 }}>
            <LogoMarca clickable={false} size="small" compacto />
          </Box>

          <Stack spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
            <Tooltip title="Inicio" placement="right">
              <IconButton
                onClick={irAlInicio}
                sx={{
                  width: 56,
                  height: 56,
                  color: '#fff',
                  borderRadius: 2,
                  backgroundColor: ubicacion.pathname.includes('/portal/')
                    ? 'rgba(0,177,234,0.12)'
                    : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(0,177,234,0.2)' },
                }}
              >
                <IconoInicio />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={usuario?.rol === 'PRESTADOR' ? 'Prestador' : 'Afiliado'}
              placement="right"
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  display: 'grid',
                  placeItems: 'center',
                  color: COLOR_PRINCIPAL,
                }}
              >
                <IconoRol />
              </Box>
            </Tooltip>
          </Stack>

          <Tooltip title="Cerrar sesión" placement="right">
            <IconButton
              onClick={cerrarSesion}
              sx={{
                width: 56,
                height: 56,
                color: '#fff',
                borderRadius: 2,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
              }}
            >
              <IconoSalir />
            </IconButton>
          </Tooltip>
        </Drawer>
      )}

      {(!mostrarNavegacion || esMobile) && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{ backgroundColor: COLOR_OSCURO, color: '#fff' }}
        >
          <Toolbar
            sx={{
              minHeight: { xs: 72, sm: 80 },
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <LogoMarca clickable={false} size="medium" />
            {mostrarNavegacion ? (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <IconButton onClick={irAlInicio} sx={{ color: '#fff' }}>
                  <IconoInicio />
                </IconButton>
                <IconButton onClick={cerrarSesion} sx={{ color: '#fff' }}>
                  <IconoSalir />
                </IconButton>
              </Stack>
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
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: mostrarNavegacion && !esMobile ? `${ANCHO_BARRA}px` : 0,
          pt: !mostrarNavegacion || esMobile ? { xs: 12, sm: 14 } : 3,
          pb: 5,
          transition: 'margin 0.25s ease',
          '& .MuiTypography-h4': {
            fontSize: { xs: '1.75rem', md: '2rem' },
            lineHeight: 1.15,
            fontWeight: 600,
            letterSpacing: 0,
            color: '#000',
          },
          '& .MuiTypography-h6': {
            fontSize: '1.5rem',
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
            minHeight: 48,
            backgroundColor: 'transparent',
            borderRadius: 0,
            border: 'none',
            borderBottom: '1px solid #D9D9D9',
            px: 0,
          },
          '& .MuiTab-root': {
            minHeight: 48,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            color: '#9B9B9B',
            px: 2,
          },
          '& .MuiTab-root.Mui-selected': { color: COLOR_PRINCIPAL },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
            backgroundColor: COLOR_PRINCIPAL,
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
          maxWidth={false}
          sx={{
            width: '100%',
            maxWidth: mostrarNavegacion ? '1152px' : '1200px',
            px: { xs: 2, sm: 3 },
          }}
        >
          <Outlet />
        </Container>
      </Box>

      <PiePagina
        sx={{
          pl: mostrarNavegacion && !esMobile ? `${ANCHO_BARRA + 12}px` : 2,
          transition: 'padding 0.25s ease',
        }}
      />
    </Box>
  );
}
