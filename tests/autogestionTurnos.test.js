import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const directorioActual = path.dirname(fileURLToPath(import.meta.url));
const raizProyecto = path.resolve(directorioActual, '..');

const leerFuente = (rutaRelativa) =>
  readFile(path.join(raizProyecto, rutaRelativa), 'utf8');

test('expone los contratos HTTP de autogestion segura', async () => {
  const portal = await leerFuente('src/services/portal.js');

  assert.match(portal, /\/autogestion-turnos\/consultar/);
  assert.match(portal, /\/autogestion-turnos\/disponibilidad/);
  assert.match(portal, /\/autogestion-turnos\/cancelar/);
  assert.match(portal, /\/autogestion-turnos\/reagendar/);
  assert.match(portal, /\/portal-afiliado\/turnos\/\$\{id\}\/reagendar/);
});

test('la autogestion es accesible sin pasar por ProtectorRuta', async () => {
  const aplicacion = await leerFuente('src/App.jsx');

  assert.match(
    aplicacion,
    /<Route path="\/turnos\/gestionar" element=\{<GestionPublicaTurno \/>\} \/>/
  );
  assert.match(aplicacion, /<Route element=\{<DisenoPortal \/>\}>/);
});

test('la pantalla publica permite consultar cancelar y reagendar', async () => {
  const pagina = await leerFuente(
    'src/pages/portales/GestionPublicaTurno.jsx'
  );

  assert.match(pagina, /autogestionTurnos\.consultar/);
  assert.match(pagina, /autogestionTurnos\.obtenerDisponibilidad/);
  assert.match(pagina, /autogestionTurnos\.cancelar/);
  assert.match(pagina, /autogestionTurnos\.reagendar/);
  assert.match(pagina, /Código de reserva/);
  assert.match(pagina, /Clave de gestión/);
});

test('el acceso principal ofrece gestionar un turno por codigo', async () => {
  const acceso = await leerFuente('src/pages/portales/Acceso.jsx');

  assert.match(acceso, /navegar\('\/turnos\/gestionar'\)/);
  assert.match(acceso, /Gestionar turno con código/);
});

test('la reserva informa las credenciales una sola vez al afiliado', async () => {
  const portal = await leerFuente('src/services/portal.js');

  assert.match(portal, /turno\?\.codigoReserva/);
  assert.match(portal, /turno\?\.tokenGestion/);
  assert.match(portal, /La clave se muestra una sola vez/);
});
