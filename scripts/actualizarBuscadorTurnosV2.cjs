const fs = require('fs');

const ruta = 'src/pages/portales/PortalAfiliado.jsx';
let contenido = fs.readFileSync(ruta, 'utf8');

contenido = contenido.replace(
  "import { useEffect, useMemo, useState } from 'react';",
  "import { useCallback, useEffect, useMemo, useState } from 'react';"
);

contenido = contenido.replace(
  "  const [fechaTurno, setFechaTurno] = useState('');\n",
  ''
);

const funcionAnterior = `  const buscarDisponibilidad = async (filtros = {}) => {
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

const funcionNueva = `  const buscarDisponibilidad = useCallback(async (filtros = {}) => {
    try {
      setError('');
      const horarios = await portalAfiliado.obtenerDisponibilidad(filtros);
      setHorariosDisponibles(horarios);
      return horarios;
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
      return null;
    }
  }, []);
`;

if (contenido.includes(funcionAnterior)) {
  contenido = contenido.replace(funcionAnterior, funcionNueva);
}

contenido = contenido.replace(
  `              horarioActual.agendaId === horario.agendaId &&
              horarioActual.hora === horario.hora`,
  `              horarioActual.agendaId === horario.agendaId &&
              horarioActual.fecha === horario.fecha &&
              horarioActual.hora === horario.hora`
);

contenido = contenido.replace(
  `          fechaTurno={fechaTurno}
          setFechaTurno={setFechaTurno}
`,
  ''
);

if (contenido.includes('fechaTurno={fechaTurno}')) {
  throw new Error('No se pudieron retirar las propiedades de fecha del buscador.');
}

if (!contenido.includes('const buscarDisponibilidad = useCallback')) {
  throw new Error('No se pudo actualizar buscarDisponibilidad.');
}

fs.writeFileSync(ruta, contenido);
