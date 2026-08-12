import { useState, useEffect } from 'react';
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
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import './SidebarItem.css';

export default function SidebarItem({
  item,
  open,
  esMobile,
  abrirMenu,
  collapsed,
}) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isChildActive = item.children?.some((child) =>
    location.pathname.startsWith(child.route)
  );
  const isSelfActive = !item.children && location.pathname === item.route;

  useEffect(() => {
    setIsOpen(isChildActive);
  }, [location.pathname]);

  const handleClick = (e) => {
    if (item.children) {
      const expandedView = open || esMobile;
      if (expandedView) setIsOpen((prev) => !prev);
      else abrirMenu(e, item.children);
    }
  };

  const collapsedView = collapsed;
  const isActive = isSelfActive || (!open && isChildActive);
  const hasChildren = !!item.children;

  return (
    <Box
      className={`sidebar-item ${hasChildren ? 'has-children' : ''} ${
        isActive ? 'active' : ''
      } ${collapsedView ? 'collapsed' : ''} ${isOpen ? 'open' : ''}`}
    >
      <Tooltip title={collapsedView ? item.label : ''} placement="right">
        <ListItemButton
          onClick={handleClick}
          component={!hasChildren ? RouterLink : 'div'}
          to={!hasChildren ? item.route : undefined}
          className={`sidebar-item-button ${isActive ? 'active' : ''}`}
        >
          <ListItemIcon
            className={`sidebar-item-icon ${isActive ? 'active' : ''}`}
          >
            {item.icon}
          </ListItemIcon>

          {(open || esMobile) && (
            <ListItemText
              primary={item.label}
              className={`sidebar-item-text ${isActive ? 'active' : ''}`}
              primaryTypographyProps={{ fontSize: '1.1rem' }}
            />
          )}

          {(open || esMobile) &&
            hasChildren &&
            (isOpen ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />)}
        </ListItemButton>
      </Tooltip>

      {(open || esMobile) && hasChildren && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="sidebar-sublist">
            {item.children.map((child, i) => {
              const activeChild = location.pathname.startsWith(child.route);
              return (
                <ListItemButton
                  key={i}
                  component={RouterLink}
                  to={child.route}
                  className={`sidebar-subitem ${activeChild ? 'active' : ''}`}
                >
                  <ListItemIcon className="sidebar-subitem-icon">
                    {child.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={child.label}
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

SidebarItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    route: PropTypes.string,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        icon: PropTypes.node,
        route: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  open: PropTypes.bool.isRequired,
  esMobile: PropTypes.bool.isRequired,
  abrirMenu: PropTypes.func.isRequired,
  collapsed: PropTypes.bool,
};
