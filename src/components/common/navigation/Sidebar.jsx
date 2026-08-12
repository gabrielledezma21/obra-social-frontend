import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { sidebarItems } from '../../../utils/sidebarItems';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import './Sidebar.css';

const drawerWidth = 280;

export default function Sidebar({ open, toggleOpen }) {
  const [anclaMenu, setAnclaMenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const location = useLocation();

  // 🔹 Cierra menú contextual al cambiar de ruta
  useEffect(() => {
    setAnclaMenu(null);
    setMenuItems([]);
  }, [location.pathname]);

  const drawerWidthActual = open ? drawerWidth : 70;

  const abrirMenu = (event, items) => {
    setAnclaMenu(event.currentTarget);
    setMenuItems(items);
  };

  const cerrarMenu = () => {
    setAnclaMenu(null);
    setMenuItems([]);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidthActual,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidthActual,
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
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              open={open}
              abrirMenu={abrirMenu}
              collapsed={!open}
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
        {menuItems.map((item, idx) => (
          <MenuItem
            key={idx}
            component={RouterLink}
            to={item.route}
            onClick={() => {
              cerrarMenu();
              toggleOpen(false);
            }}
          >
            <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleOpen: PropTypes.func.isRequired,
};
