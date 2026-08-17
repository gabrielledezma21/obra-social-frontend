const fs = require('fs');

const reemplazarObligatorio = (contenido, patron, reemplazo, descripcion) => {
  const actualizado = contenido.replace(patron, reemplazo);
  if (actualizado === contenido) {
    throw new Error(`No se pudo aplicar: ${descripcion}`);
  }
  return actualizado;
};

const rutaPortal = 'src/pages/portales/PortalAfiliado.jsx';
let portal = fs.readFileSync(rutaPortal, 'utf8');

portal = reemplazarObligatorio(
  portal,
  '  Divider,\n',
  '',
  'quitar Divider sin uso'
);

portal = reemplazarObligatorio(
  portal,
  "import GestionTurnosAfiliado from '../../components/portales/GestionTurnosAfiliado';\n",
  "import GestionTurnosAfiliado from '../../components/portales/GestionTurnosAfiliado';\nimport MisTurnosAfiliado from '../../components/portales/MisTurnosAfiliado';\nimport CartillaMedicaAfiliado from '../../components/portales/CartillaMedicaAfiliado';\n",
  'agregar componentes separados'
);

portal = reemplazarObligatorio(
  portal,
  /(setHorariosDisponibles\([\s\S]*?\n      \);\n      await cargarDatos\(\);)/,
  '$1\n      setPestana(2);',
  'volver a próximos turnos después de reservar'
);

portal = reemplazarObligatorio(
  portal,
  '        <Tab label="Turnos" />\n        <Tab label="Cartilla" />',
  '        <Tab label="Mis próximos turnos" />\n        <Tab label="Sacar turno" />\n        <Tab label="Cartilla médica" />',
  'separar pestañas de turnos'
);

portal = reemplazarObligatorio(
  portal,
  /\n      \{pestana === 2 && \([\s\S]*?\n      \{pestana === 3 && \([\s\S]*?\n      \)\}(?=\n    <\/Stack>)/,
  `
      {pestana === 2 && (
        <MisTurnosAfiliado turnos={turnos} cancelarTurno={cancelarTurno} />
      )}

      {pestana === 3 && (
        <GestionTurnosAfiliado
          integrantes={integrantes}
          cartilla={cartilla}
          afiliadoTurnoId={afiliadoTurnoId}
          setAfiliadoTurnoId={setAfiliadoTurnoId}
          horariosDisponibles={horariosDisponibles}
          buscarDisponibilidad={buscarDisponibilidad}
          reservarTurno={reservarTurno}
        />
      )}

      {pestana === 4 && <CartillaMedicaAfiliado cartilla={cartilla} />}`,
  'reemplazar contenido de turnos y cartilla'
);

fs.writeFileSync(rutaPortal, portal);

const rutaBuscador = 'src/components/portales/GestionTurnosAfiliado.jsx';
let buscador = fs.readFileSync(rutaBuscador, 'utf8');

buscador = reemplazarObligatorio(
  buscador,
  '  Chip,\n',
  '',
  'quitar Chip del buscador'
);

buscador = reemplazarObligatorio(
  buscador,
  '  reservarTurno,\n  turnos,\n  cancelarTurno,\n',
  '  reservarTurno,\n',
  'quitar props de próximos turnos del buscador'
);

buscador = reemplazarObligatorio(
  buscador,
  /\n      <Box>\n        <Typography variant="h6" mb=\{1\}>\n          Mis turnos[\s\S]*?\n      <\/Box>(?=\n    <\/Stack>)/,
  '',
  'quitar listado de mis turnos del buscador'
);

buscador = reemplazarObligatorio(
  buscador,
  '  reservarTurno: PropTypes.func.isRequired,\n  turnos: PropTypes.array.isRequired,\n  cancelarTurno: PropTypes.func.isRequired,\n',
  '  reservarTurno: PropTypes.func.isRequired,\n',
  'actualizar PropTypes del buscador'
);

fs.writeFileSync(rutaBuscador, buscador);
