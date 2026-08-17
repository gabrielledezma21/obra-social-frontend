import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const directorioActual = path.dirname(fileURLToPath(import.meta.url));
const raizProyecto = path.resolve(directorioActual, '..');
const leerFuente = (ruta) => readFile(path.join(raizProyecto, ruta), 'utf8');

test('Reportes conserva ruta, navegación lateral y contratos HTTP administrativos', async () => {
  const [aplicacion, elementos, barraLateral, servicioReportes, migas] =
    await Promise.all([
      leerFuente('src/App.jsx'),
      leerFuente('src/utils/elementosBarraLateral.jsx'),
      leerFuente('src/components/common/navigation/SidebarItem.jsx'),
      leerFuente('src/services/reportes.js'),
      leerFuente('src/components/common/BreadcrumbsNav.jsx'),
    ]);

  assert.match(aplicacion, /path="reportes"\s+element=\{<Reportes\s*\/>\}/);
  assert.match(elementos, /ruta:\s*['"]\/administracion\/reportes['"]/);
  assert.match(barraLateral, /navegar\(elemento\.ruta\)/);
  assert.match(migas, /seccion === ['"]reportes['"]/);

  [
    '/reportes/afiliados-altas',
    '/reportes/prestadores-altas',
    '/reportes/prestadores-distribucion',
    '/reportes/prestadores-sin-agenda',
  ].forEach((ruta) => assert.match(servicioReportes, new RegExp(ruta)));
});
