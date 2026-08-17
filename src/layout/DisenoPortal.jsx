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
            sx={{
              color: 'rgba(255,255,255,0.72)',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Portal MedIntegral
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 11,
          pb: 5,
          '& .MuiCard-root': {
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider',
          },
          '& .MuiTabs-root': {
            minHeight: 48,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            px: 1,
          },
          '& .MuiButton-contained': {
            borderRadius: 2,
            boxShadow: 'none',
            textTransform: 'none',
            fontWeight: 600,
          },
          '& .MuiButton-text': {
            textTransform: 'none',
            fontWeight: 500,
          },
          '& .MuiChip-root': {
            borderRadius: 2,
            fontWeight: 500,
          },
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>

      <PiePagina />
    </Box>
  );
}
