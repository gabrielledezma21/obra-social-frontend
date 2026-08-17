import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import LogoMarca from '../components/common/BrandLogo';
import PiePagina from '../components/Footer';

export default function DisenoPortal() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#0b111e',
          color: '#fff',
          boxShadow: 'none',
        }}
      >
        <Toolbar
          sx={{
            minHeight: '64px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <LogoMarca clickable={false} size="medium" />
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255,255,255,0.72)', display: { xs: 'none', sm: 'block' } }}
          >
            Portal MedIntegral
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, pt: 11, pb: 5 }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>

      <PiePagina />
    </Box>
  );
}
