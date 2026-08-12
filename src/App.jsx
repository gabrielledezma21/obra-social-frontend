import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/layoutBase';

import Home from './pages/Home';

import AgendaListado from './pages/agenda-turnos/Listado';
import AgendaAlta from './pages/agenda-turnos/Alta';
import AgendaDetalle from './pages/agenda-turnos/Detalle';

import PrestadoresListado from './pages/prestadores/Listado';
import PrestadoresAlta from './pages/prestadores/Alta';
import PrestadoresDetalle from './pages/prestadores/Detalle';

import AfiliadosListado from './pages/afiliados/Listado';
import AfiliadosAlta from './pages/afiliados/Alta';
import AfiliadosDetalle from './pages/afiliados/Detalle';

import Forbidden from './pages/403/Forbidden';

import NotFound from './pages/404/404';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="agenda-turnos">
          <Route path="listado" element={<AgendaListado />} />
          <Route path="alta" element={<AgendaAlta />} />
          <Route path="detalle/:id" element={<AgendaDetalle />} />
        </Route>

        <Route path="prestadores">
          <Route path="listado" element={<PrestadoresListado />} />
          <Route path="alta" element={<PrestadoresAlta />} />
          <Route path="detalle/:id" element={<PrestadoresDetalle />} />
        </Route>

        <Route path="afiliados">
          <Route path="listado" element={<AfiliadosListado />} />
          <Route path="alta" element={<AfiliadosAlta />} />
          <Route path="detalle/:id" element={<AfiliadosDetalle />} />
        </Route>

        <Route path="/403" element={<Forbidden />} />
        <Route path="404" element={<NotFound />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
