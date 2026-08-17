import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const leerArchivo = (rutaRelativa) =>
  fs.readFileSync(new URL(`../${rutaRelativa}`, import.meta.url), 'utf8');

test('muestra las credenciales demo correspondientes a cada rol', () => {
  const acceso = leerArchivo('src/pages/portales/Acceso.jsx');

  assert.match(acceso, /Credenciales de demostración/);
  assert.match(acceso, /admin@medintegral\.com/);
  assert.match(acceso, /Admin1234/);
  assert.match(acceso, /homero@simpson\.com/);
  assert.match(acceso, /house@medical\.com/);
  assert.match(acceso, /Demo1234/);
  assert.match(acceso, /CREDENCIALES_DEMO/);
});

test('el aviso demo se muestra solamente en la pestaña de ingreso', () => {
  const acceso = leerArchivo('src/pages/portales/Acceso.jsx');

  assert.match(acceso, /pestana === 0/);
  assert.match(acceso, /credencialesActuales/);
});
