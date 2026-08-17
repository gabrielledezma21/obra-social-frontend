import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import IconoMenu from '@mui/icons-material/Menu';
import PropTypes from 'prop-types';
import LogoMarca from '../../common/BrandLogo';

export default function BarraSuperior({ alHacerClicMenu }) {
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
      </Toolbar>
    </AppBar>
  );
}

BarraSuperior.propTypes = {
  alHacerClicMenu: PropTypes.func.isRequired,
};
