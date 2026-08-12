import { Drawer, Toolbar, List, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SidebarItem from './SidebarItem';
import PropTypes from 'prop-types';
import { sidebarItems } from '../../../utils/sidebarItems';
import BrandLogo from '../BrandLogo';
export default function SidebarModal({ open, onClose }) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
        '& .MuiDrawer-paper': {
          width: 300,
          backgroundColor: '#0b111e',
          color: '#fff',
          borderRight: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 2,
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
        <BrandLogo clickable size="medium" />{' '}
        <IconButton onClick={onClose} color="inherit">
          <CloseIcon />
        </IconButton>
      </Toolbar>

      <List className="sidebar-list">
        {sidebarItems.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            open={true}
            esMobile={true}
            abrirMenu={() => {}}
            collapsed={false}
          />
        ))}
      </List>
    </Drawer>
  );
}

SidebarModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
