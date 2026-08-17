import dayjs from 'dayjs';

const seleccionValida = (valor) =>
  !valor ||
  (typeof valor === 'object' &&
    (valor.value !== undefined || valor.id !== undefined));

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
  ].some((valor) => valor !== null && valor !== undefined && valor !== '');

  if (!algunoCargado) {
    return {
      field: null,
      message:
        'Tenés que completar al menos un filtro para realizar la búsqueda.',
    };
  }

  if (!seleccionValida(prestador)) {
    return {
      field: 'prestador',
      message: 'Seleccioná un prestador válido de la lista.',
    };
  }

  if (!seleccionValida(especialidad)) {
    return {
      field: 'especialidad',
      message: 'Seleccioná una especialidad válida de la lista.',
    };
  }

  if (!seleccionValida(provincia)) {
    return {
      field: 'provincia',
      message: 'Seleccioná una provincia válida.',
    };
  }

  if (!seleccionValida(localidad)) {
    return {
      field: 'localidad',
      message: 'Seleccioná una localidad válida.',
    };
  }

  if (!seleccionValida(dia)) {
    return {
      field: 'dia',
      message: 'Seleccioná un día válido.',
    };
  }

  if (!seleccionValida(duracion)) {
    return {
      field: 'duracion',
      message: 'Seleccioná una duración válida.',
    };
  }

  const hoy = dayjs().endOf('day');

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

    if (desde.isSame(hasta, 'day')) {
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
    if (horaInicio > horaFin) {
      return {
        field: 'horaFin',
        message: 'El horario de inicio debe ser anterior al de fin.',
      };
    }

    if (horaInicio === horaFin) {
      return {
        field: 'horaFin',
        message: 'El inicio y el fin no pueden ser iguales.',
      };
    }
  }

  return null;
}
