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

test('las fechas calendario no se convierten a la zona horaria local', () => {
  const utilidad = leer('src/utils/fechaCalendario.js');
  const modal = leer(
    'src/components/afiliados/modals/DatosPersonalesEditModal.jsx'
  );
  const dashboard = leer('src/services/dashboard.js');
  const detalle = leer(
    'src/components/afiliados/DatosPersonalesDetailsSection.jsx'
  );

  assert.match(utilidad, /PATRON_FECHA_CALENDARIO/);
  assert.match(utilidad, /getUTCFullYear/);
  assert.match(modal, /obtenerFechaCalendario\(afiliado\.fechaNacimiento\)/);
  assert.match(modal, /obtenerFechaCalendario\(afiliado\.vigenciaInicio\)/);
  assert.match(modal, /obtenerFechaCalendario\(afiliado\.vigenciaFin\)/);
  assert.doesNotMatch(
    modal,
    /dayjs\(afiliado\.fechaNacimiento\)\.format\('YYYY-MM-DD'\)/
  );
  assert.match(dashboard, /formatearFechaCalendario\(member\.fechaBaja\)/);
  assert.doesNotMatch(
    dashboard,
    /new Date\(member\.fechaBaja\)\.toLocaleDateString/
  );
  assert.match(detalle, /formatearFechaCalendario\(fechaNacimiento\)/);
  assert.match(detalle, /formatearFechaCalendario\(vigenciaFin\)/);
});

test('el grupo familiar hereda la fecha de baja del titular', () => {
  const servicio = leer('src/services/afiliado.js');
  const contexto = leer('src/context/AfiliadoContext.jsx');

  assert.match(servicio, /fechaBaja: convertirAFecha/);
  assert.match(servicio, /familiar\.usaMismaVigenciaTitular/);
  assert.match(servicio, /\? datosTitular\.fechaBaja/);
  assert.match(servicio, /fechaBaja: titular\.vigenciaFin/);
  assert.match(contexto, /const esTitular = afiliado\?\.parentesco === 'Titular'/);
  assert.match(
    contexto,
    /modificarFechaBajaAfiliado\(\s*afiliado\.id,\s*data\.tieneFechaBaja \? data\.vigenciaFin : null,\s*true/
  );
  assert.match(contexto, /const aplicarAlGrupo = esTitular \|\| aplicarAGrupoFamiliar/);
  assert.match(contexto, /const reincorporarGrupo = esTitular \|\| reincorporarGrupoFamiliar/);
});
