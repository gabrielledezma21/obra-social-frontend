import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const normalizarHora = (valor) =>
  dayjs(valor)
    .set('year', 2000)
    .set('month', 0)
    .set('date', 1)
    .set('second', 0)
    .set('millisecond', 0);

const obtenerNombreDia = (diaRaw) => {
  if (!diaRaw) return '';
  if (typeof diaRaw === 'object' && diaRaw.nombre) return diaRaw.nombre;
  if (typeof diaRaw === 'string') return diaRaw.split('(')[0].trim();
  return '';
};

const normalizarHorarios = (horario) => {
  const inicioRaw = horario.inicio || horario.horaInicio;
  const finRaw = horario.fin || horario.horaFin;

  const inicio = dayjs(inicioRaw, ['HH:mm', 'H:mm']);
  const fin = dayjs(finRaw, ['HH:mm', 'H:mm']);

  return { inicio, fin };
};

export const validateHorarioBasico = (horario) => {
  const { inicio, fin } = normalizarHorarios(horario);

  if (!horario.dias || horario.dias.length === 0) {
    return {
      field: `horario-${horario.id}-dias`,
      message: 'Seleccioná al menos un día de la semana',
    };
  }

  if (!inicio || !inicio.isValid()) {
    return {
      field: `horario-${horario.id}-inicio`,
      message: 'Seleccioná un horario de inicio',
    };
  }

  if (!fin || !fin.isValid()) {
    return {
      field: `horario-${horario.id}-fin`,
      message: 'Seleccioná un horario de fin',
    };
  }

  if (inicio.isSame(fin)) {
    return {
      field: `horario-${horario.id}-horario`,
      message: 'El inicio y el fin no pueden ser iguales',
    };
  }

  if (inicio.isAfter(fin)) {
    return {
      field: `horario-${horario.id}-horario`,
      message: 'El horario de inicio debe ser anterior al de fin',
    };
  }

  return null;
};

export const validateHorarioDentroDireccion = (horario, direccion) => {
  const rangoMin = normalizarHora(horario.inicio);
  const rangoMax = normalizarHora(horario.fin);
  for (const diaRaw of horario.dias) {
    const diaNombre =
      typeof diaRaw === 'object' && diaRaw.nombre ? diaRaw.nombre : diaRaw;

    const match = direccion.horarios?.some((dh) => {
      const nombre = typeof dh.dia === 'object' ? dh.dia.nombre : dh.dia;

      const dhInicio = normalizarHora(dayjs(dh.horaInicio, 'HH:mm'));
      const dhFin = normalizarHora(dayjs(dh.horaFin, 'HH:mm'));

      const inicioOK = rangoMin.isSame(dhInicio) || rangoMin.isAfter(dhInicio);
      const finOK = rangoMax.isSame(dhFin) || rangoMax.isBefore(dhFin);

      return nombre === diaNombre && inicioOK && finOK;
    });

    if (!match) {
      return {
        field: `horario-${horario.id}-horario`,
        message: `El rango definido para ${diaNombre} no está dentro de los horarios de atención del centro`,
      };
    }
  }

  return null;
};

export const validateDuracionVsRango = (horario) => {
  const { inicio, fin } = normalizarHorarios(horario);
  if (!inicio.isValid() || !fin.isValid()) return null;

  const rangoMinutos = fin.diff(inicio, 'minute');
  if (Number(horario.duracion) > rangoMinutos) {
    return {
      field: `horario-${horario.id}-duracion`,
      message: 'La duración del turno no puede ser mayor que el rango horario',
    };
  }

  return null;
};

export const validateSolapamiento = (horario, horarios) => {
  const { inicio, fin } = normalizarHorarios(horario);
  if (!inicio.isValid() || !fin.isValid()) return null;

  const index = horarios.findIndex((h) => h.id === horario.id);

  for (let j = 0; j < horarios.length; j++) {
    if (j === index) continue;

    const other = horarios[j];
    const { inicio: oInicio, fin: oFin } = normalizarHorarios(other);

    if (!oInicio.isValid() || !oFin.isValid()) continue;

    const diasSolapados = (horario.dias || [])
      .map(obtenerNombreDia)
      .filter((d) => (other.dias || []).map(obtenerNombreDia).includes(d));

    if (diasSolapados.length === 0) continue;

    const empiezaDuranteOtro = inicio.isAfter(oInicio) && inicio.isBefore(oFin);
    const terminaDuranteOtro = fin.isAfter(oInicio) && fin.isBefore(oFin);
    const cubreTotalmente =
      inicio.isSameOrBefore(oInicio) && fin.isSameOrAfter(oFin);

    if (empiezaDuranteOtro || terminaDuranteOtro || cubreTotalmente) {
      const indexOther = j;
      const ultimoIndex = Math.max(index, indexOther);
      const ultimo = horarios[ultimoIndex];

      return {
        field: `horario-${ultimo.id}-horario`,
        message: `El rango horario se solapa con otro horario para el ${diasSolapados.join(', ')}`,
      };
    }
  }

  return null;
};

export const validateSolapamientoEntreCentros = (centros) => {
  const todosLosHorarios = [];

  for (const centro of centros) {
    for (const h of centro.horarios || []) {
      todosLosHorarios.push({
        ...h,
        centroId: centro.id,
      });
    }
  }

  for (let i = 0; i < todosLosHorarios.length; i++) {
    const h1 = todosLosHorarios[i];
    const { inicio: i1, fin: f1 } = normalizarHorarios(h1);

    for (let j = i + 1; j < todosLosHorarios.length; j++) {
      const h2 = todosLosHorarios[j];

      if (h1.centroId === h2.centroId) continue;

      const { inicio: i2, fin: f2 } = normalizarHorarios(h2);

      const dias1 = (h1.dias || []).map(obtenerNombreDia);
      const dias2 = (h2.dias || []).map(obtenerNombreDia);
      const diasSolapados = dias1.filter((d) => dias2.includes(d));

      if (diasSolapados.length === 0) continue;

      const empieza1 = i1.isAfter(i2) && i1.isBefore(f2);
      const termina1 = f1.isAfter(i2) && f1.isBefore(f2);
      const cubre1 = i1.isSameOrBefore(i2) && f1.isSameOrAfter(f2);
      const empieza2 = i2.isAfter(i1) && i2.isBefore(f1);

      if (empieza1 || termina1 || cubre1 || empieza2) {
        const ultimo = todosLosHorarios[j];

        const indiceCentro = centros.findIndex((c) => c.id === h1.centroId) + 1;

        return {
          field: `horario-${ultimo.id}-horario`,
          message: `El horario se solapa con otro horario del Centro de Atención #${indiceCentro} para el día ${diasSolapados.join(', ')}`,
        };
      }
    }
  }

  return null;
};
