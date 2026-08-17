import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const leer = (ruta) => readFile(new URL(`../${ruta}`, import.meta.url), 'utf8');

test('el afiliado puede buscar próximos turnos con filtros sin elegir una fecha exacta', async () => {
  const componente = await leer(
    'src/components/portales/GestionTurnosAfiliado.jsx'
  );

  for (const texto of [
    'Médico / prestador',
    'Especialidad',
    'Localidad',
    'Día de la semana',
    'Desde las',
    'Hasta las',
    'Cualquier día · próximos libres',
    'Próximos turnos libres',
  ]) {
    assert.match(componente, new RegExp(texto));
  }

  for (const filtro of [
    'prestadorId',
    'especialidadId',
    'localidad',
    'diaSemana',
    'horaDesde',
    'horaHasta',
  ]) {
    assert.match(componente, new RegExp(filtro));
  }

  assert.match(componente, /buscarDisponibilidad\(\{ limite: 30 \}\)/);
  assert.doesNotMatch(componente, /label="Fecha"/);
});

test('el médico se busca por autocompletado remoto a medida que se escribe', async () => {
  const componente = await leer(
    'src/components/portales/GestionTurnosAfiliado.jsx'
  );
  const servicio = await leer('src/services/portal.js');

  assert.match(componente, /<Autocomplete/);
  assert.match(componente, /texto\.length < 2/);
  assert.match(componente, /portalAfiliado\.buscarPrestadores\(texto\)/);
  assert.match(componente, /}, 300\);/);
  assert.match(componente, /Escribí al menos 2 letras/);

  assert.match(
    servicio,
    /buscarPrestadores: \(busqueda\)[\s\S]*\/portal-afiliado\/prestadores\/buscar[\s\S]*params: \{ busqueda \}/
  );
});

test('el portal envía los nuevos filtros y distingue la fecha al reservar', async () => {
  const portal = await leer('src/pages/portales/PortalAfiliado.jsx');
  const servicio = await leer('src/services/portal.js');

  assert.match(
    portal,
    /buscarDisponibilidad = useCallback\(async \(filtros = \{\}\) =>/
  );
  assert.match(
    portal,
    /portalAfiliado\.obtenerDisponibilidad\(filtros\)/
  );
  assert.match(
    portal,
    /horarioActual\.fecha === horario\.fecha/
  );
  assert.doesNotMatch(portal, /fechaTurno=\{fechaTurno\}/);

  assert.match(
    servicio,
    /obtenerDisponibilidad: \(filtros = \{\}\)[\s\S]*params: filtros/
  );
});
