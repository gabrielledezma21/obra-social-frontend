import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const leer = (rutaRelativa) =>
  fs.readFileSync(new URL(`../${rutaRelativa}`, import.meta.url), 'utf8');

test('el encabezado común permite ordenar al hacer click', () => {
  const encabezado = leer('src/components/common/lists/TableHeader.jsx');

  assert.match(encabezado, /TableSortLabel/);
  assert.match(
    encabezado,
    /onRequestSort\(campo, esAscendente \? 'desc' : 'asc'\)/
  );
  assert.match(encabezado, /sortDirection/);
});

test('los tres listados administrativos ordenan antes de paginar', () => {
  const afiliados = leer('src/pages/afiliados/Listado.jsx');
  const prestadores = leer('src/pages/prestadores/Listado.jsx');
  const agendas = leer('src/pages/agenda-turnos/Listado.jsx');

  for (const contenido of [afiliados, prestadores, agendas]) {
    assert.match(contenido, /ordenarFilas/);
    assert.match(contenido, /LIMITE_LISTADO_COMPLETO/);
    assert.match(contenido, /handleRequestSort/);
    assert.match(contenido, /onRequestSort=\{handleRequestSort\}/);
  }
});

test('el ordenamiento contempla texto, números y valores múltiples', () => {
  const utilidad = leer('src/utils/ordenamientoListados.js');

  assert.match(utilidad, /Array\.isArray\(valor\)/);
  assert.match(utilidad, /localeCompare/);
  assert.match(utilidad, /numeric: true/);
  assert.match(utilidad, /direccion === 'desc'/);
});
