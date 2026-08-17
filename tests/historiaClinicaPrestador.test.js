import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const leer = (ruta) => readFile(new URL(`../${ruta}`, import.meta.url), 'utf8');

const contar = (texto, expresion) => [...texto.matchAll(expresion)].length;

test('el prestador consulta pacientes e historia clínica en una única sección', async () => {
  const portal = await leer('src/pages/portales/PortalPrestador.jsx');
  const historia = await leer(
    'src/components/portales/HistoriaClinicaPrestador.jsx'
  );
  const diseno = await leer('src/layout/DisenoPortal.jsx');

  assert.match(portal, /<Tab label="Historia clínica" \/>/);
  assert.match(portal, /<HistoriaClinicaPrestador \/>/);
  assert.doesNotMatch(portal, /Afiliados y situaciones/);
  assert.doesNotMatch(diseno, /etiqueta: 'Afiliados y situaciones'/);

  assert.match(historia, /Nombre, apellido, DNI, credencial o teléfono/);
  assert.match(historia, /Ver historia clínica/);
  assert.match(historia, /Situaciones terapéuticas/);
  assert.match(historia, /Evolución clínica/);
  assert.match(historia, /Toda la historia/);
  assert.match(historia, /Solo mis notas/);
  assert.match(historia, /buscarAfiliados\(texto\)/);
  assert.match(historia, /obtenerHistoria/);
  assert.match(historia, /obtenerSituaciones/);
});

test('afiliado y prestador dejan el cierre de sesión únicamente en la navbar', async () => {
  const portalAfiliado = await leer('src/pages/portales/PortalAfiliado.jsx');
  const portalPrestador = await leer('src/pages/portales/PortalPrestador.jsx');
  const diseno = await leer('src/layout/DisenoPortal.jsx');

  assert.doesNotMatch(portalAfiliado, /Cerrar sesión/);
  assert.doesNotMatch(portalPrestador, /Cerrar sesión/);
  assert.equal(contar(diseno, /Cerrar sesión/g), 1);
  assert.match(diseno, /onClick=\{cerrarSesion\}/);
});
