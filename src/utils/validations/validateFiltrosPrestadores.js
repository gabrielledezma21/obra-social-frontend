import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default function validateFiltrosAgendaTurnos(filtros) {
  const {
    tipoPrestador,
    especialidad,
    localidad,
    provincia,
    creacionDesde,
    creacionHasta,
  } = filtros;

  const algunoCargado = [
    tipoPrestador,
    especialidad,
    localidad,
    provincia,
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

  if (especialidad && typeof especialidad === 'string') {
    return {
      field: 'especialidad',
      message: 'Seleccioná una especialidad válida de la lista.',
    };
  }

  if (localidad && localidad.length < 3) {
    return {
      field: 'localidad',
      message: 'Ingrese al menos 3 caracteres para buscar una localidad.',
    };
  }

  if (provincia && typeof provincia === 'string') {
    return {
      field: 'provincia',
      message: 'Seleccioná una provincia válida de la lista.',
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
}
