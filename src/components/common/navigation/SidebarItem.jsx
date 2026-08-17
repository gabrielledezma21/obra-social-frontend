import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Collapse,
  List,
} from '@mui/material';
import IconoContraer from '@mui/icons-material/ExpandLessOutlined';
import IconoExpandir from '@mui/icons-material/ExpandMoreOutlined';
import { Link as EnlaceRouter, useLocation } from 'react-router-dom';
import './SidebarItem.css';

export default function ElementoBarraLateral({
  elemento,
  abierto,
  esMobile,
  abrirMenu,
  colapsado,
}) {
  const ubicacion = useLocation();
  const [desplegado, setDesplegado] = useState(false);

  const tieneHijoActivo = elemento.hijos?.some((hijo) =>
    ubicacion.pathname.startsWith(hijo.ruta)
  );
  const estaActivo = !elemento.hijos && ubicacion.pathname === elemento.ruta;

  useEffect(() => {
    setDesplegado(tieneHijoActivo);
  }, [ubicacion.pathname, tieneHijoActivo]);

  const manejarClic = (evento) => {
    if (!elemento.hijos) return;

    const vistaExpandida = abierto || esMobile;
    if (vistaExpandida) {
      setDesplegado((valorAnterior) => !valorAnterior);
    } else {
      abrirMenu(evento, elemento.hijos);
    }
  };

  const vistaColapsada = colapsado;
  const activo = estaActivo || (!abierto && tieneHijoActivo);
  const tieneHijos = Boolean(elemento.hijos);

  return (
    <Box
      className={`sidebar-item ${tieneHijos ? 'has-children' : ''} ${
        activo ? 'active' : ''
      } ${vistaColapsada ? 'collapsed' : ''} ${desplegado ? 'open' : ''}`}
    >
      <Tooltip
        title={vistaColapsada ? elemento.etiqueta : ''}
        placement="right"
      >
        <ListItemButton
          onClick={manejarClic}
          component={!tieneHijos ? EnlaceRouter : 'div'}
          to={!tieneHijos ? elemento.ruta : undefined}
          className={`sidebar-item-button ${activo ? 'active' : ''}`}
        >
          <ListItemIcon
            className={`sidebar-item-icon ${activo ? 'active' : ''}`}
          >
            {elemento.icono}
          </ListItemIcon>

          {(abierto || esMobile) && (
            <ListItemText
              primary={elemento.etiqueta}
              className={`sidebar-item-text ${activo ? 'active' : ''}`}
              primaryTypographyProps={{ fontSize: '1.1rem' }}
            />
          )}

          {(abierto || esMobile) &&
            tieneHijos &&
            (desplegado ? <IconoContraer /> : <IconoExpandir />)}
        </ListItemButton>
      </Tooltip>

      {(abierto || esMobile) && tieneHijos && (
        <Collapse in={desplegado} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="sidebar-sublist">
            {elemento.hijos.map((hijo, indice) => {
              const hijoActivo = ubicacion.pathname.startsWith(hijo.ruta);
              return (
                <ListItemButton
                  key={indice}
                  component={EnlaceRouter}
                  to={hijo.ruta}
                  className={`sidebar-subitem ${hijoActivo ? 'active' : ''}`}
                >
                  <ListItemIcon className="sidebar-subitem-icon">
                    {hijo.icono}
                  </ListItemIcon>
                  <ListItemText
                    primary={hijo.etiqueta}
                    className="sidebar-subitem-text"
                    primaryTypographyProps={{ fontSize: '0.95rem' }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}
    </Box>
  );
}

ElementoBarraLateral.propTypes = {
  elemento: PropTypes.shape({
    clave: PropTypes.string.isRequired,
    etiqueta: PropTypes.string.isRequired,
    icono: PropTypes.node.isRequired,
    ruta: PropTypes.string,
    hijos: PropTypes.arrayOf(
      PropTypes.shape({
        etiqueta: PropTypes.string.isRequired,
        icono: PropTypes.node,
        ruta: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  abierto: PropTypes.bool.isRequired,
  esMobile: PropTypes.bool.isRequired,
  abrirMenu: PropTypes.func.isRequired,
  colapsado: PropTypes.bool,
};
