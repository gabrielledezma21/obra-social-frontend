import { Drawer, Toolbar, List, IconButton } from '@mui/material';
import IconoCerrar from '@mui/icons-material/Close';
import ElementoBarraLateral from './SidebarItem';
import PropTypes from 'prop-types';
import { elementosBarraLateral } from '../../../utils/elementosBarraLateral';
import LogoMarca from '../BrandLogo';

export default function ModalBarraLateral({ abierto, alCerrar }) {
  return (
    <Drawer
      anchor="left"
      open={abierto}
      onClose={alCerrar}
      ModalProps={{ keepMounted: true }}
      sx={{
        zIndex: (tema) => tema.zIndex.drawer + 2,
        '& .MuiDrawer-paper': {
          width: 300,
          backgroundColor: '#0b111e',
          color: '#fff',
          borderRight: 'none',
          zIndex: (tema) => tema.zIndex.drawer + 2,
        },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
        }}
      >
        <LogoMarca clickable size="medium" />{' '}
        <IconButton onClick={alCerrar} color="inherit">
          <IconoCerrar />
        </IconButton>
      </Toolbar>

      <List className="sidebar-list">
        {elementosBarraLateral.map((elemento, indice) => (
          <ElementoBarraLateral
            key={indice}
            elemento={elemento}
            abierto={true}
            esMobile={true}
            abrirMenu={() => {}}
            colapsado={false}
          />
        ))}
      </List>
    </Drawer>
  );
}

ModalBarraLateral.propTypes = {
  abierto: PropTypes.bool.isRequired,
  alCerrar: PropTypes.func.isRequired,
};
