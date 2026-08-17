const fs = require('fs');

const ruta = 'src/pages/portales/PortalAfiliado.jsx';
let contenido = fs.readFileSync(ruta, 'utf8');

const reemplazar = (buscar, reemplazo, descripcion) => {
  if (!contenido.includes(buscar)) {
    throw new Error(`No se encontró el bloque para ${descripcion}`);
  }
  contenido = contenido.replace(buscar, reemplazo);
};

reemplazar(
  "import GestionTurnosAfiliado from '../../components/portales/GestionTurnosAfiliado';\nimport MisTurnosAfiliado from '../../components/portales/MisTurnosAfiliado';\n",
  "import TurnosAfiliado from '../../components/portales/TurnosAfiliado';\n",
  'actualizar imports de turnos'
);

reemplazar(
  "      await cargarDatos();\n      setPestana(2);\n    } catch (errorPeticion) {\n      setError(obtenerMensajeError(errorPeticion));\n    }\n  };",
  "      await cargarDatos();\n      return true;\n    } catch (errorPeticion) {\n      setError(obtenerMensajeError(errorPeticion));\n      return false;\n    }\n  };",
  'devolver resultado de la reserva'
);

reemplazar(
  '        <Tab label="Mis próximos turnos" />\n        <Tab label="Sacar turno" />\n        <Tab label="Cartilla médica" />',
  '        <Tab label="Turnos" />\n        <Tab label="Cartilla médica" />',
  'unificar pestañas de turnos'
);

reemplazar(
  `      {pestana === 2 && (\n        <MisTurnosAfiliado turnos={turnos} cancelarTurno={cancelarTurno} />\n      )}\n\n      {pestana === 3 && (\n        <GestionTurnosAfiliado\n          integrantes={integrantes}\n          cartilla={cartilla}\n          afiliadoTurnoId={afiliadoTurnoId}\n          setAfiliadoTurnoId={setAfiliadoTurnoId}\n          horariosDisponibles={horariosDisponibles}\n          buscarDisponibilidad={buscarDisponibilidad}\n          reservarTurno={reservarTurno}\n        />\n      )}\n\n      {pestana === 4 && <CartillaMedicaAfiliado cartilla={cartilla} />}`,
  `      {pestana === 2 && (\n        <TurnosAfiliado\n          turnos={turnos}\n          integrantes={integrantes}\n          cartilla={cartilla}\n          afiliadoTurnoId={afiliadoTurnoId}\n          setAfiliadoTurnoId={setAfiliadoTurnoId}\n          horariosDisponibles={horariosDisponibles}\n          buscarDisponibilidad={buscarDisponibilidad}\n          reservarTurno={reservarTurno}\n          cancelarTurno={cancelarTurno}\n        />\n      )}\n\n      {pestana === 3 && <CartillaMedicaAfiliado cartilla={cartilla} />}`,
  'reemplazar vistas de turnos'
);

fs.writeFileSync(ruta, contenido);
