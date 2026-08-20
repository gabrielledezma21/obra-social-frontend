import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  obtenerEstadoVisualTurno,
  separarTurnosAfiliado,
} from '../src/utils/turnosAfiliado.js';

const leer = (ruta) => readFile(new URL(`../${ruta}`, import.meta.url), 'utf8');

test('clasifica próximos, anteriores y cancelados por fecha y hora argentina', () => {
  const ahora = new Date('2026-08-17T15:00:00-03:00').getTime();
  const turnos = [
    {
      _id: 'pasado-hoy',
      fecha: '2026-08-17T12:00:00.000Z',
      hora: '14:30',
      estado: 'RESERVADO',
    },
    {
      _id: 'proximo-hoy',
      fecha: '2026-08-17T12:00:00.000Z',
      hora: '16:30',
      estado: 'RESERVADO',
    },
    {
      _id: 'cancelado-futuro',
      fecha: '2026-08-18T12:00:00.000Z',
      hora: '10:00',
      estado: 'CANCELADO',
    },
    {
      _id: 'atendido-anterior',
      fecha: '2026-08-16T12:00:00.000Z',
      hora: '09:00',
      estado: 'ATENDIDO',
    },
  ];

  const { proximos, anteriores, cancelados } = separarTurnosAfiliado(
    turnos,
    ahora
  );

  assert.deepEqual(
    proximos.map((turno) => turno._id),
    ['proximo-hoy']
  );
  assert.deepEqual(
    anteriores.map((turno) => turno._id),
    ['pasado-hoy', 'atendido-anterior']
  );
  assert.deepEqual(
    cancelados.map((turno) => turno._id),
    ['cancelado-futuro']
  );
  assert.equal(obtenerEstadoVisualTurno(turnos[0], ahora), 'Pasado');
  assert.equal(obtenerEstadoVisualTurno(turnos[1], ahora), 'Reservado');
  assert.equal(obtenerEstadoVisualTurno(turnos[2], ahora), 'Cancelado');
});

test('Turnos muestra próximos, anteriores y cancelados aunque el layout oculte tabs principales', async () => {
  const portal = await leer('src/pages/portales/PortalAfiliado.jsx');
  const turnos = await leer('src/components/portales/TurnosAfiliado.jsx');

  assert.match(portal, /<Tab label="Turnos" \/>/);
  assert.doesNotMatch(portal, /<Tab label="Sacar turno" \/>/);
  assert.doesNotMatch(portal, /<Tab label="Mis próximos turnos" \/>/);
  assert.match(portal, /<TurnosAfiliado/);

  assert.match(turnos, />\s*Sacar turno\s*</);
  assert.match(turnos, /Próximos/);
  assert.match(turnos, /Anteriores/);
  assert.match(turnos, /Cancelados/);
  assert.match(turnos, /style=\{\{ display: 'flex' \}\}/);
  assert.match(turnos, /<GestionTurnosAfiliado/);
  assert.match(turnos, /Volver a turnos/);
});

test('la cartilla médica es solo un listado de consulta similar a prestadores', async () => {
  const portal = await leer('src/pages/portales/PortalAfiliado.jsx');
  const cartilla = await leer(
    'src/components/portales/CartillaMedicaAfiliado.jsx'
  );

  assert.match(portal, /<Tab label="Cartilla médica" \/>/);
  assert.match(portal, /<CartillaMedicaAfiliado cartilla=\{cartilla\} \/>/);
  assert.match(cartilla, /Buscar prestador, especialidad o localidad/);
  assert.match(cartilla, /<Table/);
  assert.match(cartilla, /<TablePagination/);
  assert.doesNotMatch(cartilla, /Sacar turno/);
  assert.doesNotMatch(cartilla, />\s*Reservar\s*</);

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
