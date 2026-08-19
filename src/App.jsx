import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectorRuta from './components/autenticacion/ProtectorRuta';
import RutaInicial from './components/autenticacion/RutaInicial';
import DisenoBase from './layout/layoutBase';
import DisenoPortal from './layout/DisenoPortal';
import Inicio from './pages/Home';
import Reportes from './pages/Reportes';
import ListadoAgendas from './pages/agenda-turnos/Listado';
import AltaAgenda from './pages/agenda-turnos/Alta';
import DetalleAgenda from './pages/agenda-turnos/Detalle';
import ListadoPrestadores from './pages/prestadores/Listado';
import AltaPrestador from './pages/prestadores/Alta';
import DetallePrestador from './pages/prestadores/Detalle';
import ListadoAfiliados from './pages/afiliados/Listado';
import AltaAfiliado from './pages/afiliados/Alta';
import DetalleAfiliado from './pages/afiliados/Detalle';
import AccesoPortales from './pages/portales/Acceso';
import CambiarContrasena from './pages/portales/CambiarContrasena';
import GestionPublicaTurno from './pages/portales/GestionPublicaTurno';
import PortalAfiliado from './pages/portales/PortalAfiliado';
import PortalPrestador from './pages/portales/PortalPrestador';
import AccesoProhibido from './pages/403/Forbidden';
import PaginaNoEncontrada from './pages/404/404';
import './App.css';

function Aplicacion() {
  return (
    <Routes>
      <Route path="/" element={<RutaInicial />} />

      <Route element={<DisenoPortal />}>
        <Route path="/portal/acceso" element={<AccesoPortales />} />
        <Route path="/turnos/gestionar" element={<GestionPublicaTurno />} />

        <Route
          element={
            <ProtectorRuta
              rolesPermitidos={['ADMIN', 'AFILIADO', 'PRESTADOR']}
              permitirCambioPendiente
            />
          }
        >
          <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
        </Route>

        <Route element={<ProtectorRuta rolesPermitidos={['AFILIADO']} />}>
          <Route path="/portal/afiliado" element={<PortalAfiliado />} />
        </Route>

        <Route element={<ProtectorRuta rolesPermitidos={['PRESTADOR']} />}>
          <Route path="/portal/prestador" element={<PortalPrestador />} />
        </Route>
      </Route>

      <Route path="/403" element={<AccesoProhibido />} />
      <Route path="/404" element={<PaginaNoEncontrada />} />

      <Route element={<ProtectorRuta rolesPermitidos={['ADMIN']} />}>
        <Route path="/administracion" element={<DisenoBase />}>
          <Route index element={<Inicio />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="agenda-turnos">
            <Route path="listado" element={<ListadoAgendas />} />
            <Route path="alta" element={<AltaAgenda />} />
            <Route path="detalle/:id" element={<DetalleAgenda />} />
          </Route>
          <Route path="prestadores">
            <Route path="listado" element={<ListadoPrestadores />} />
            <Route path="alta" element={<AltaPrestador />} />
            <Route path="detalle/:id" element={<DetallePrestador />} />
          </Route>
          <Route path="afiliados">
            <Route path="listado" element={<ListadoAfiliados />} />
            <Route path="alta" element={<AltaAfiliado />} />
            <Route path="detalle/:id" element={<DetalleAfiliado />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default Aplicacion;
