import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const directorioActual = path.dirname(fileURLToPath(import.meta.url));
const raizProyecto = path.resolve(directorioActual, '..');

const leerFuente = (rutaRelativa) =>
  readFile(path.join(raizProyecto, rutaRelativa), 'utf8');

const exigirPatrones = (fuente, patrones, nombreArchivo) => {
  patrones.forEach((patron) => {
    assert.match(
      fuente,
      patron,
      `${nombreArchivo} debe conservar el contrato ${String(patron)}`
    );
  });
};

test('el cliente API central adjunta el token a cualquier servicio', async () => {
  const [clienteApi, portal] = await Promise.all([
    leerFuente('src/services/api.js'),
    leerFuente('src/services/portal.js'),
  ]);

  exigirPatrones(
    clienteApi,
    [
      /medintegral_token/,
      /interceptors\.request\.use/,
      /localStorage\.getItem\(CLAVE_TOKEN\)/,
      /headers\.Authorization\s*=\s*`Bearer \$\{token\}`/,
    ],
    'api.js'
  );

  assert.doesNotMatch(
    portal,
    /interceptors\.request\.use/,
    'El interceptor no debe depender de que portal.js haya sido importado'
  );
});

test('los servicios administrativos conservan los endpoints protegidos del backend', async () => {
  const [afiliados, prestadores, agendas] = await Promise.all([
    leerFuente('src/services/afiliado.js'),
    leerFuente('src/services/prestadores.js'),
    leerFuente('src/services/agendaTurnos.js'),
  ]);

  exigirPatrones(
    afiliados,
    [
      /clienteApi\.get\('\/afiliados'\)/,
      /clienteApi\.post\('\/afiliados'/,
      /clienteApi\.put\(`\/afiliados\/\$\{id\}`/,
      /clienteApi\.delete\(`\/afiliados\/\$\{id\}`/,
    ],
    'afiliado.js'
  );

  exigirPatrones(
    prestadores,
    [
      /api\.get\('\/prestadores'\)/,
      /api\.get\(`\/prestadores\/\$\{id\}`\)/,
      /api\.post\('\/prestadores'/,
      /api\.put\(`\/prestadores\/\$\{id\}`/,
      /api\.delete\(`\/prestadores\/\$\{id\}`\)/,
    ],
    'prestadores.js'
  );

  exigirPatrones(
    agendas,
    [
      /api\.get\('\/agendas'\)/,
      /api\.get\(`\/agendas\/\$\{id\}`\)/,
      /api\.post\('\/agendas'/,
      /api\.put\(`\/agendas\/\$\{id\}`/,
      /api\.delete\(`\/agendas\/\$\{id\}`\)/,
    ],
    'agendaTurnos.js'
  );
});

test('el portal de afiliado conserva todos sus contratos HTTP principales', async () => {
  const portal = await leerFuente('src/services/portal.js');

  exigirPatrones(
    portal,
    [
      /\/portal-afiliado\/mi-perfil/,
      /\/portal-afiliado\/resumen/,
      /\/portal-afiliado\/cartilla/,
      /\/portal-afiliado\/solicitudes/,
      /\/portal-afiliado\/solicitudes\/\$\{id\}\/responder-observacion/,
      /\/portal-afiliado\/disponibilidad/,
      /\/portal-afiliado\/turnos/,
      /\/portal-afiliado\/turnos\/\$\{id\}\/cancelar/,
    ],
    'portal.js'
  );
});

test('el portal de prestador conserva todos sus contratos HTTP principales', async () => {
  const portal = await leerFuente('src/services/portal.js');

  exigirPatrones(
    portal,
    [
      /\/portal-prestador\/mi-perfil/,
      /\/portal-prestador\/resumen/,
      /\/portal-prestador\/solicitudes/,
      /\/portal-prestador\/solicitudes\/\$\{id\}\/estado/,
      /\/portal-prestador\/afiliados\/buscar/,
      /\/portal-prestador\/situaciones/,
      /\/portal-prestador\/turnos/,
      /\/portal-prestador\/turnos\/\$\{id\}\/nota/,
      /\/portal-prestador\/historia\/\$\{afiliadoId\}/,
    ],
    'portal.js'
  );
});

test('los contratos de autenticación apuntan a las rutas reales del backend', async () => {
  const portal = await leerFuente('src/services/portal.js');

  exigirPatrones(
    portal,
    [
      /\/autenticacion\/iniciar-sesion/,
      /\/autenticacion\/activar-afiliado/,
      /\/autenticacion\/activar-prestador/,
      /\/autenticacion\/cambiar-contrasena/,
    ],
    'portal.js'
  );
});
