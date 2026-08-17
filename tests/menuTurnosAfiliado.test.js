import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const leer = (rutaRelativa) =>
  fs.readFileSync(new URL(`../${rutaRelativa}`, import.meta.url), 'utf8');

test('el afiliado tiene Turnos con Mis turnos y Sacar turno en el sidebar', () => {
  const diseno = leer('src/layout/DisenoPortal.jsx');

  assert.match(diseno, /etiqueta: 'Turnos'/);
  assert.match(diseno, /etiqueta: 'Mis turnos'/);
  assert.match(diseno, /etiqueta: 'Sacar turno'/);
  assert.match(diseno, /hijos: \[ELEMENTO_MIS_TURNOS, ELEMENTO_SACAR_TURNO\]/);
  assert.match(diseno, /IconoExpandir/);
  assert.match(diseno, /IconoContraer/);
});

test('los accesos del sidebar abren el modo correcto de turnos', () => {
  const diseno = leer('src/layout/DisenoPortal.jsx');
  const turnos = leer('src/components/portales/TurnosAfiliado.jsx');

  assert.match(diseno, /vistaTurnos: 'listado'/);
  assert.match(diseno, /vistaTurnos: 'sacar'/);
  assert.match(diseno, /medintegral:navegar-turnos/);
  assert.match(turnos, /medintegral:navegar-turnos/);
  assert.match(turnos, /evento\.detail\?\.vista === 'sacar'/);
  assert.match(turnos, /evento\.detail\?\.vista === 'listado'/);
});
