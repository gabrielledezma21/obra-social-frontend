import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  leerCredencialesTurnoDesdeUbicacion,
} from '../src/utils/enlaceTurno.js';

const leer = (rutaRelativa) =>
  fs
    .readFileSync(new URL(`../${rutaRelativa}`, import.meta.url), 'utf8')
    .replace(/\r\n/g, '\n');

test('interpreta codigo y token separados desde el enlace seguro', () => {
  const credenciales = leerCredencialesTurnoDesdeUbicacion({
    search: '?codigo=med-8f4k2p',
    hash: '#token=token-seguro&accion=reagendar',
  });

  assert.deepEqual(credenciales, {
    codigoReserva: 'MED-8F4K2P',
    tokenGestion: 'token-seguro',
    accion: 'reagendar',
  });
});

test('la autogestion usa POST y no persiste el token en storage', () => {
  const servicio = leer('src/services/turnosPublicos.js');
  const pagina = leer('src/pages/portales/GestionTurnoPublico.jsx');

  assert.match(servicio, /clienteApi\.post\(`\/publico\/turnos\/\$\{ruta\}`/);
  assert.doesNotMatch(servicio, /\.get\(/);
  assert.doesNotMatch(pagina, /localStorage|sessionStorage/);
  assert.match(pagina, /limpiarFragmentoSensible/);
});

test('la ruta publica queda disponible sin protector de autenticacion', () => {
  const aplicacion = leer('src/App.jsx');
  const posicionRutaPublica = aplicacion.indexOf('path="/turnos/gestionar"');
  const posicionProtectorAfiliado = aplicacion.indexOf(
    "rolesPermitidos={['AFILIADO']}"
  );

  assert.ok(posicionRutaPublica >= 0);
  assert.ok(posicionProtectorAfiliado > posicionRutaPublica);
});
