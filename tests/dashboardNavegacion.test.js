import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const directorioActual = path.dirname(fileURLToPath(import.meta.url));
const raizProyecto = path.resolve(directorioActual, '..');
const leerFuente = (ruta) => readFile(path.join(raizProyecto, ruta), 'utf8');

test('las tarjetas del dashboard administrativo navegan dentro de /administracion', async () => {
  const [contextoDashboard, tarjetas, aplicacion] = await Promise.all([
    leerFuente('src/context/DashboardContext.jsx'),
    leerFuente('src/components/dashboard/DashboardStats.jsx'),
    leerFuente('src/App.jsx'),
  ]);

  const rutasEsperadas = [
    '/administracion/afiliados/listado',
    '/administracion/prestadores/listado',
    '/administracion/agenda-turnos/listado',
  ];

  rutasEsperadas.forEach((ruta) => {
    assert.match(contextoDashboard, new RegExp(`link: ['"]${ruta}['"]`));
  });

  [
    "link: '/afiliados/listado'",
    "link: '/prestadores/listado'",
    "link: '/agenda-turnos/listado'",
  ].forEach((rutaVieja) => assert.doesNotMatch(contextoDashboard, new RegExp(rutaVieja)));

  assert.match(tarjetas, /component=\{RouterLink\}/);
  assert.match(tarjetas, /to=\{item\.link\}/);
  assert.match(aplicacion, /path="\/administracion"\s+element=\{<DisenoBase\s*\/>\}/);
});
