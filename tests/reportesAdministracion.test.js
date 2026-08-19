import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const leer = (rutaRelativa) =>
  fs.readFileSync(new URL(`../${rutaRelativa}`, import.meta.url), 'utf8');

test('los reportes por periodo muestran los elementos obtenidos', () => {
  const reportes = leer('src/pages/Reportes.jsx');

  assert.match(reportes, /Afiliados dados de alta/);
  assert.match(reportes, /Prestadores dados de alta/);
  assert.match(reportes, /afiliados\.elementos/);
  assert.match(reportes, /prestadores\.elementos/);
  assert.match(reportes, /fecha desde no puede ser posterior/i);
});

test('el reporte individual descarga un PDF real desde el backend', () => {
  const servicio = leer('src/services/afiliado.js');

  assert.match(servicio, /\/reportes\/afiliados\/\$\{id\}\/pdf/);
  assert.match(servicio, /responseType: 'blob'/);
  assert.doesNotMatch(servicio, /todavía no ofrece reportes en PDF/);
});
