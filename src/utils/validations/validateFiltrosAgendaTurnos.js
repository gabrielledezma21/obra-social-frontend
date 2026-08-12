import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default function validateFiltrosAgendaTurnos(filtros) {
  const {
    prestador,
    especialidad,
    provincia,
    localidad,
    dia,
    duracion,
    horaInicio,
    horaFin,
    creacionDesde,
    creacionHasta,
  } = filtros;

  const algunoCargado = [
    prestador,
    especialidad,
    provincia,
    localidad,
    dia,
    duracion,
    horaInicio,
    horaFin,
    creacionDesde,
    creacionHasta,
  ].some((v) => !!v && v !== '');

  if (!algunoCargado) {
    return {
      field: null,
      message:
        'Tenés que completar al menos un filtro para realizar la búsqueda.',
    };
  }

  if (prestador && typeof prestador === 'string') {
    return {
      field: 'prestador',
      message: 'Seleccioná un prestador válido de la lista.',
    };
  }

  if (especialidad && typeof especialidad === 'string') {
    return {
      field: 'especialidad',
      message: 'Seleccioná una especialidad válida de la lista.',
    };
  }

  if (provincia && typeof provincia === 'string') {
    return {
      field: 'provincia',
      message: 'Seleccioná una provincia válida.',
    };
  }

  if (dia && typeof provincia === 'string') {
    return {
      field: 'dia',
      message: 'Seleccioná un día válido.',
    };
  }

  if (duracion && typeof provincia === 'string') {
    return {
      field: 'duracion',
      message: 'Seleccioná una duracion válida.',
    };
  }

  if (localidad && localidad.length < 3) {
    return {
      field: 'localidad',
      message: 'Ingrese al menos 3 caracteres para buscar una localidad.',
    };
  }

  const hoy = dayjs();

  if (creacionDesde && dayjs(creacionDesde).isAfter(hoy)) {
    return {
      field: 'creacionDesde',
      message: 'La fecha no puede ser posterior a hoy.',
    };
  }

  if (creacionHasta && dayjs(creacionHasta).isAfter(hoy)) {
    return {
      field: 'creacionHasta',
      message: 'La fecha no puede ser posterior a hoy.',
    };
  }

  if (creacionDesde && creacionHasta) {
    const desde = dayjs(creacionDesde);
    const hasta = dayjs(creacionHasta);

    if (desde.isSame(hasta)) {
      return {
        field: 'creacionHasta',
        message: 'Las fechas no pueden ser iguales.',
      };
    }

    if (desde.isAfter(hasta)) {
      return {
        field: 'creacionHasta',
        message: 'La fecha "hasta" no puede ser anterior a la fecha "desde".',
      };
    }
  }

  if (horaInicio && horaFin) {
    const inicio = dayjs(horaInicio, 'HH:mm');
    const fin = dayjs(horaFin, 'HH:mm');

    if (inicio.isAfter(fin)) {
      return {
        field: 'horaFin',
        message: 'El horario de inicio debe ser anterior al de fin.',
      };
    }

    if (inicio.isSame(fin)) {
      return {
        field: 'horaFin',
        message: 'El inicio y el fin no pueden ser iguales.',
      };
    }
  }

  return null;
}
