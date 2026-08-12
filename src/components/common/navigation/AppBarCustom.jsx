import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PropTypes from 'prop-types';
import BrandLogo from '../../common/BrandLogo';

export default function AppBarCustom({ onMenuClick }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#0b111e',
        color: '#fff',
        boxShadow: 'none',
        zIndex: (theme) => theme.zIndex.drawer + 1,
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
          <IconButton onClick={onMenuClick} color="inherit">
            <MenuIcon />
          </IconButton>
          <BrandLogo clickable size="medium" />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

AppBarCustom.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};
