import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const leer = (ruta) => readFile(new URL(`../${ruta}`, import.meta.url), 'utf8');

test('el portal separa próximos turnos de la búsqueda de nuevos turnos', async () => {
  const portal = await leer('src/pages/portales/PortalAfiliado.jsx');
  const buscador = await leer(
    'src/components/portales/GestionTurnosAfiliado.jsx'
  );
  const proximos = await leer(
    'src/components/portales/MisTurnosAfiliado.jsx'
  );

  assert.match(portal, /<Tab label="Mis próximos turnos" \/>/);
  assert.match(portal, /<Tab label="Sacar turno" \/>/);
  assert.match(portal, /<MisTurnosAfiliado/);
  assert.match(portal, /<GestionTurnosAfiliado/);
  assert.match(portal, /setPestana\(2\)/);

  assert.doesNotMatch(buscador, /Mis turnos/);
  assert.doesNotMatch(buscador, /turnos: PropTypes\.array/);
  assert.match(proximos, /Mis próximos turnos/);
  assert.match(proximos, /turno\.estado === 'RESERVADO'/);
});

test('la cartilla médica usa un listado buscable y paginado similar a prestadores', async () => {
  const portal = await leer('src/pages/portales/PortalAfiliado.jsx');
  const cartilla = await leer(
    'src/components/portales/CartillaMedicaAfiliado.jsx'
  );

  assert.match(portal, /<Tab label="Cartilla médica" \/>/);
  assert.match(portal, /<CartillaMedicaAfiliado cartilla=\{cartilla\} \/>/);
  assert.match(cartilla, /Buscar prestador, especialidad o localidad/);
  assert.match(cartilla, /<Table/);
  assert.match(cartilla, /<TablePagination/);

  for (const columna of [
    'Prestador',
    'Tipo de prestador',
    'Especialidades',
    'Direcciones',
    'Teléfonos',
    'Emails',
  ]) {
    assert.match(cartilla, new RegExp(columna));
  }
});
