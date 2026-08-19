import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const leer = (rutaRelativa) =>
  fs.readFileSync(new URL(`../${rutaRelativa}`, import.meta.url), 'utf8');

test('un familiar que comparte domicilio hereda la direccion del titular', () => {
  const servicio = leer('src/services/afiliado.js');

  assert.match(servicio, /familiar\.usaMismaDireccionTitular/);
  assert.match(servicio, /\? datosAfiliado\.direcciones/);
  assert.match(servicio, /opciones\.direcciones \?\? formulario\.direcciones/);
});

test('si falla un familiar se revierte el alta del titular', () => {
  const servicio = leer('src/services/afiliado.js');

  assert.match(servicio, /revertirAltaIncompleta/);
  assert.match(servicio, /clienteApi\.delete\(`\/afiliados\/\$\{titularId\}`\)/);
  assert.match(servicio, /catch \(error\) \{\n    await revertirAltaIncompleta\(titularId\);\n    throw error;/);
});

test('los errores 400 generales no se marcan como documento duplicado', () => {
  const formulario = leer('src/components/afiliados/AltaAfiliadoForm.jsx');

  assert.doesNotMatch(formulario, /statusCode === 400/);
  assert.match(formulario, /includes\('ya está registrado'\)/);
  assert.match(formulario, /message=\{/);
  assert.match(formulario, /mensajeError/);
});
