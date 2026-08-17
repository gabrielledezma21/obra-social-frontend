import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { elementosBarraLateral } from '../../../utils/elementosBarraLateral';
import { Link as EnlaceRouter, useLocation } from 'react-router-dom';
import ElementoBarraLateral from './SidebarItem';
import './Sidebar.css';

const ANCHO_BARRA = 280;

export default function BarraLateral({ abierto, cambiarApertura }) {
  const [anclaMenu, setAnclaMenu] = useState(null);
  const [elementosMenu, setElementosMenu] = useState([]);
  const ubicacion = useLocation();

  useEffect(() => {
    setAnclaMenu(null);
    setElementosMenu([]);
  }, [ubicacion.pathname]);

  const anchoActual = abierto ? ANCHO_BARRA : 70;

  const abrirMenu = (evento, elementos) => {
    setAnclaMenu(evento.currentTarget);
    setElementosMenu(elementos);
  };

  const cerrarMenu = () => {
    setAnclaMenu(null);
    setElementosMenu([]);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        open={abierto}
        sx={{
          width: anchoActual,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: anchoActual,
            backgroundColor: '#0b111e',
            color: '#fff',
            borderRight: 'none',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            paddingTop: '68px',
          },
        }}
      >
        <List className="sidebar-list">
          {elementosBarraLateral.map((elemento) => (
            <ElementoBarraLateral
              key={elemento.clave}
              elemento={elemento}
              abierto={abierto}
              abrirMenu={abrirMenu}
              colapsado={!abierto}
              esMobile={false}
            />
          ))}
        </List>
      </Drawer>

      <Menu
        anchorEl={anclaMenu}
        open={Boolean(anclaMenu)}
        onClose={cerrarMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            backgroundColor: '#0b111e',
            color: '#fff',
            borderRadius: 2,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          },
        }}
      >
        {elementosMenu.map((elemento, indice) => (
          <MenuItem
            key={indice}
            component={EnlaceRouter}
            to={elemento.ruta}
            onClick={() => {
              cerrarMenu();
              cambiarApertura(false);
            }}
          >
            <ListItemIcon sx={{ color: '#fff' }}>{elemento.icono}</ListItemIcon>
            <ListItemText primary={elemento.etiqueta} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

BarraLateral.propTypes = {
  abierto: PropTypes.bool.isRequired,
  cambiarApertura: PropTypes.func.isRequired,
};
