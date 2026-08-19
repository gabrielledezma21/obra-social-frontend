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

test('el dashboard ordena especialidades y localidades de mayor a menor', () => {
  const dashboard = leer('src/services/dashboard.js');

  assert.match(dashboard, /segundo\.cantidad - primero\.cantidad/);
  assert.match(dashboard, /\.sort\(compararPorCantidadDescendente\)/);
});

test('el dashboard incluye todos los planes en todos los meses', () => {
  const dashboard = leer('src/services/dashboard.js');
  const grafico = leer('src/components/dashboard/PlanesMedicosPorMes.jsx');

  assert.match(dashboard, /ORDEN_PLANES_PRINCIPALES = \['210', '310', '410', '510'\]/);
  assert.match(dashboard, /planesDisponibles = new Set\(ORDEN_PLANES_PRINCIPALES\)/);
  assert.match(dashboard, /month: 'long'/);
  assert.match(dashboard, /cantidades\[plan\] \?\? 0/);
  assert.match(grafico, /flatMap\(\(periodo\) => Object\.keys\(periodo\.planes \|\| \{\}\)\)/);
  assert.match(grafico, /periodo\.planes\?\.\[plan\] \?\? 0/);
  assert.match(grafico, /label: `Plan \$\{key\}`/);
  assert.match(grafico, /Altas nuevas de afiliados por plan en cada mes/);
});

test('el detalle de afiliado conserva grupo familiar, direcciones y auditoría', () => {
  const adaptadores = leer('src/services/apiAdapters.js');
  const detalle = leer('src/pages/afiliados/Detalle.jsx');

  assert.match(adaptadores, /dependientes,/);
  assert.match(adaptadores, /grupoFamiliar: dependientes/);
  assert.match(adaptadores, /raw\.direccionesIds\?\.length/);
  assert.match(adaptadores, /createdAtFecha: creado\.fecha/);
  assert.match(adaptadores, /updatedAtFecha: actualizado\.fecha/);
  assert.doesNotMatch(detalle, /navigate\('\/403'/);
});

test('el detalle completa situaciones terapéuticas y grupo al abrir un familiar', () => {
  const servicio = leer('src/services/afiliado.js');
  const situaciones = leer(
    'src/components/afiliados/SituacionesTerapeuticasDetailsSection.jsx'
  );

  assert.match(servicio, /completarGrupoFamiliar/);
  assert.match(servicio, /\/reportes\/situaciones\/\$\{obtenerId\(datos\)\}/);
  assert.match(servicio, /fechaInicio: novedad\.fechaInicio/);
  assert.match(situaciones, /Situaciones terapéuticas/);
  assert.match(situaciones, /Activa/);
  assert.match(situaciones, /Finalizada/);
});
