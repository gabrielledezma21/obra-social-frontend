const fs = require('fs');

const ruta = 'src/pages/portales/PortalAfiliado.jsx';
let contenido = fs.readFileSync(ruta, 'utf8');

const importacion =
  "import GestionTurnosAfiliado from '../../components/portales/GestionTurnosAfiliado';";
if (!contenido.includes(importacion)) {
  contenido = contenido.replace(
    "import PropTypes from 'prop-types';",
    `import PropTypes from 'prop-types';\n${importacion}`
  );
}

const inicioFuncion = contenido.indexOf(
  '  const buscarDisponibilidad = async () => {'
);
const finFuncion = contenido.indexOf(
  '\n  const reservarTurno = async',
  inicioFuncion
);
if (inicioFuncion < 0 || finFuncion < 0) {
  throw new Error('No se encontró buscarDisponibilidad.');
}

const nuevaFuncion = `  const buscarDisponibilidad = async (filtros = {}) => {
    if (!fechaTurno) {
      setError('Elegí una fecha para buscar turnos.');
      return null;
    }

    try {
      setError('');
      const horarios = await portalAfiliado.obtenerDisponibilidad(
        fechaTurno,
        filtros
      );
      setHorariosDisponibles(horarios);
      return horarios;
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
      return null;
    }
  };
`;

contenido =
  contenido.slice(0, inicioFuncion) +
  nuevaFuncion +
  contenido.slice(finFuncion + 1);

const inicioTurnos = contenido.indexOf('      {pestana === 2 && (');
const inicioCartilla = contenido.indexOf('      {pestana === 3 && (');
if (inicioTurnos < 0 || inicioCartilla <= inicioTurnos) {
  throw new Error('No se encontró el bloque de turnos.');
}

const nuevoBloque = `      {pestana === 2 && (
        <GestionTurnosAfiliado
          integrantes={integrantes}
          cartilla={cartilla}
          fechaTurno={fechaTurno}
          setFechaTurno={setFechaTurno}
          afiliadoTurnoId={afiliadoTurnoId}
          setAfiliadoTurnoId={setAfiliadoTurnoId}
          horariosDisponibles={horariosDisponibles}
          buscarDisponibilidad={buscarDisponibilidad}
          reservarTurno={reservarTurno}
          turnos={turnos}
          cancelarTurno={cancelarTurno}
        />
      )}

`;

contenido =
  contenido.slice(0, inicioTurnos) +
  nuevoBloque +
  contenido.slice(inicioCartilla);

fs.writeFileSync(ruta, contenido);
