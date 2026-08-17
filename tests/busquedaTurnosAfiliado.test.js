import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const leer = (ruta) => readFile(new URL(`../${ruta}`, import.meta.url), 'utf8');

test('el afiliado puede buscar turnos por médico, especialidad, localidad y horario', async () => {
  const componente = await leer(
    'src/components/portales/GestionTurnosAfiliado.jsx'
  );

  for (const texto of [
    'Médico / prestador',
    'Especialidad',
    'Localidad',
    'Desde las',
    'Hasta las',
  ]) {
    assert.match(componente, new RegExp(texto));
  }

  for (const filtro of [
    'prestadorId',
    'especialidadId',
    'localidad',
    'horaDesde',
    'horaHasta',
  ]) {
    assert.match(componente, new RegExp(filtro));
  }

  assert.match(componente, /buscarDisponibilidad\(filtros\)/);
  assert.match(componente, /No encontramos turnos disponibles/);
});

test('el portal envía los filtros seleccionados al servicio de disponibilidad', async () => {
  const portal = await leer('src/pages/portales/PortalAfiliado.jsx');
  const servicio = await leer('src/services/portal.js');

  assert.match(portal, /buscarDisponibilidad = async \(filtros = \{\}\)/);
  assert.match(
    portal,
    /portalAfiliado\.obtenerDisponibilidad\(\s*fechaTurno,\s*filtros\s*\)/
  );
  assert.match(
    servicio,
    /obtenerDisponibilidad: \(fecha, filtros = \{\}\)[\s\S]*params: \{ fecha, \.\.\.filtros \}/
  );
});
