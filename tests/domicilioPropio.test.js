import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const leer = (rutaRelativa) =>
  fs.readFileSync(new URL(`../${rutaRelativa}`, import.meta.url), 'utf8');

test('al independizar un domicilio no se copia el domicilio del titular', () => {
  const modal = leer('src/components/afiliados/modals/DireccionEditModal.jsx');

  assert.match(modal, /if \(usarDomicilioPropio\) \{/);
  assert.match(modal, /setDireccionesTitular\(direccionesNormalizadas\)/);
  assert.match(modal, /setDirecciones\(\[newDireccion\(\)\]\)/);
  assert.match(modal, /repiteDomicilioTitular/);
  assert.match(
    modal,
    /El domicilio propio debe ser diferente al domicilio del titular/
  );
});

test('el backend es la fuente de verdad para impedir un domicilio duplicado', () => {
  const servicio = leer('src/services/afiliado.js');

  assert.match(servicio, /comparteDomicilioTitular: false/);
  assert.match(
    servicio,
    /direcciones: construirDirecciones\(datos\.direcciones\)/
  );
});
