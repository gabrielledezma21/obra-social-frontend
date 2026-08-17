import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

import BarraSuperior from '../components/common/navigation/AppBarCustom';
import BarraLateral from '../components/common/navigation/Sidebar';
import ModalBarraLateral from '../components/common/navigation/SidebarModal';
import PiePagina from '../components/Footer';
import MigasNavegacion from '../components/common/BreadcrumbsNav';

export default function DisenoBase() {
  const tema = useTheme();
  const esMobile = useMediaQuery(tema.breakpoints.down('md'));
  const ubicacion = useLocation();

  const [barraAbierta, setBarraAbierta] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  const alternarBarra = () =>
    setBarraAbierta((valorAnterior) => !valorAnterior);
  const alternarModal = () =>
    setModalAbierto((valorAnterior) => !valorAnterior);

  useEffect(() => {
    setBarraAbierta(false);
    setModalAbierto(false);
  }, [ubicacion.pathname]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: tema.palette.background.default,
      }}
    >
      <BarraSuperior
        alHacerClicMenu={esMobile ? alternarModal : alternarBarra}
      />

      {!esMobile && (
        <BarraLateral
          abierto={barraAbierta}
          cambiarApertura={setBarraAbierta}
        />
      )}
      {esMobile && (
        <ModalBarraLateral abierto={modalAbierto} alCerrar={alternarModal} />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 10,
          transition: 'margin 0.3s ease',
          ml: !esMobile ? (barraAbierta ? '280px' : '70px') : 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container maxWidth="lg" sx={{ flexGrow: 1, mb: 4 }}>
          <MigasNavegacion />
          <Box sx={{ flexGrow: 1, mt: 3 }}>
            <Outlet />
          </Box>
        </Container>
      </Box>

      <PiePagina
        sx={{
          pl: !esMobile ? (barraAbierta ? '296px' : '86px') : '16px',
          transition: 'padding 0.3s ease',
        }}
      />
    </Box>
  );
}
