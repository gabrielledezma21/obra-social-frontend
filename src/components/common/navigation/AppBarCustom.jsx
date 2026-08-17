import { AppBar, Toolbar, IconButton, Box, Button } from '@mui/material';
import IconoMenu from '@mui/icons-material/Menu';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import LogoMarca from '../../common/BrandLogo';
import { limpiarSesion } from '../../../services/portal';

export default function BarraSuperior({ alHacerClicMenu }) {
  const navegar = useNavigate();

  const cerrarSesion = () => {
    limpiarSesion();
    navegar('/portal/acceso');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#0b111e',
        color: '#fff',
        boxShadow: 'none',
        zIndex: (tema) => tema.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '64px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={alHacerClicMenu} color="inherit">
            <IconoMenu />
          </IconButton>
          <LogoMarca clickable size="medium" />
        </Box>
        <Button color="inherit" onClick={cerrarSesion}>
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
}

BarraSuperior.propTypes = {
  alHacerClicMenu: PropTypes.func.isRequired,
};
