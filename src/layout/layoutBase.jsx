import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';

import AppBarCustom from '../components/common/navigation/AppBarCustom';
import Sidebar from '../components/common/navigation/Sidebar';
import SidebarModal from '../components/common/navigation/SidebarModal';
import Footer from '../components/Footer';
import BreadcrumbsNav from '../components/common/BreadcrumbsNav';

export default function LayoutBase() {
  const theme = useTheme();
  const esMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleModal = () => setModalOpen((prev) => !prev);

  useEffect(() => {
    setSidebarOpen(false);
    setModalOpen(false);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <AppBarCustom onMenuClick={esMobile ? toggleModal : toggleSidebar} />

      {!esMobile && <Sidebar open={sidebarOpen} toggleOpen={setSidebarOpen} />}
      {esMobile && <SidebarModal open={modalOpen} onClose={toggleModal} />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 10,
          transition: 'margin 0.3s ease',
          ml: !esMobile ? (sidebarOpen ? '280px' : '70px') : 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container maxWidth="lg" sx={{ flexGrow: 1, mb: 4 }}>
          <BreadcrumbsNav />
          <Box sx={{ flexGrow: 1, mt: 3 }}>
            <Outlet />
          </Box>
        </Container>
      </Box>
      <Footer
        sx={{
          pl: !esMobile ? (sidebarOpen ? '296px' : '86px') : '16px',
          transition: 'padding 0.3s ease',
        }}
      />
    </Box>
  );
}
