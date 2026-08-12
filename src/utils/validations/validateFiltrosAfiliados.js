import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const REGEX_NUMERIC = /^\d+$/;
const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const REGEX_TELEFONO_CLEAN = /^\d{8,15}$/;

const validateVigenciaDesde = (vigencia, hoy, estado) => {
  if (
    vigencia.isAfter(hoy) &&
    (!estado || estado.value === 'Vigentes' || estado.value === 'Bajas')
  ) {
    return {
      field: 'vigenciaDesde',
      message: 'La fecha no puede ser posterior a hoy',
    };
  } else if (vigencia.isBefore(hoy) && estado?.value === 'Vigencia futura') {
    return {
      field: 'vigenciaDesde',
      message: 'La fecha debe ser posterior a hoy',
    };
  }
  return null;
};

const validateVigenciaHasta = (vigencia, hoy, estado) => {
  if (
    vigencia.isBefore(hoy) &&
    (!estado ||
      estado.value === 'Vigentes' ||
      estado.value === 'Vigencia futura')
  ) {
    return {
      field: 'vigenciaHasta',
      message: 'La fecha debe ser posterior a hoy.',
    };
  } else if (vigencia.isAfter(hoy) && estado?.value === 'Bajas') {
    return {
      field: 'vigenciaHasta',
      message: 'La fecha no puede ser posterior a hoy',
    };
  }
  return null;
};

const validateRangoDeFechas = (fechaDesde, fechaHasta, fieldName) => {
  if (fechaDesde.isSame(fechaHasta)) {
    return {
      field: `${fieldName}`,
      message: 'Las fechas no pueden ser iguales',
    };
  }

  if (fechaDesde.isAfter(fechaHasta)) {
    return {
      field: `${fieldName}`,
      message: 'La fecha "hasta" no puede ser anterior a la fecha "desde".',
    };
  }

  return null;
};

export default function validateFiltrosAgendaTurnos(filtros) {
  const {
    tipoDocumento,
    nroAfiliado,
    fechaNacimiento,
    planMedico,
    provincia,
    localidad,
    telefono,
    email,
    vigenciaDesde,
    vigenciaHasta,
    creacionDesde,
    creacionHasta,
    estado,
  } = filtros;

  const algunoCargado = [
    tipoDocumento,
    nroAfiliado,
    fechaNacimiento,
    planMedico,
    provincia,
    localidad,
    telefono,
    email,
    vigenciaDesde,
    vigenciaHasta,
    creacionDesde,
    creacionHasta,
    estado,
  ].some((v) => !!v && v !== '');

  if (!algunoCargado) {
    return {
      field: null,
      message:
        'Tenés que completar al menos un filtro para realizar la búsqueda.',
    };
  }

  if (
    nroAfiliado &&
    (!REGEX_NUMERIC.test(nroAfiliado) || nroAfiliado.length > 7)
  ) {
    return {
      field: 'nroAfiliado',
      message:
        'El número de afiliado no puede contener más de 7 números ni caracteres especiales.',
    };
  }

  if (fechaNacimiento && dayjs(fechaNacimiento).isAfter(dayjs())) {
    return {
      field: 'fechaNacimiento',
      message: 'La fecha de nacimiento no puede ser posterior a hoy.',
    };
  }

  if (provincia && typeof provincia === 'string') {
    return {
      field: 'provincia',
      message: 'Seleccione una provincia válida de la lista.',
    };
  }

  if (localidad && localidad.length < 3) {
    return {
      field: 'localidad',
      message: 'Ingrese al menos 3 caracteres para buscar una localidad.',
    };
  }

  if (telefono && !REGEX_TELEFONO_CLEAN.test(telefono)) {
    return {
      field: 'telefono',
      message: 'El teléfono debe tener solo números entre 8 y 15 dígitos.',
    };
  }

  if (email && !REGEX_EMAIL.test(email)) {
    return {
      field: 'email',
      message: 'El email debe tener un formato válido (ej: usuario@gmail.com).',
    };
  }

  const hoy = dayjs();
  const fechaDesde = dayjs(vigenciaDesde);
  const fechaHasta = dayjs(vigenciaHasta);

  if (vigenciaDesde) {
    const error = validateVigenciaDesde(fechaDesde, hoy, estado);
    if (error) return error;
  }

  if (vigenciaHasta) {
    const error = validateVigenciaHasta(fechaHasta, hoy, estado);
    if (error) return error;
  }

  if (vigenciaDesde && vigenciaHasta) {
    const error = validateRangoDeFechas(
      fechaDesde,
      fechaHasta,
      'vigenciaHasta'
    );
    if (error) return error;
  }

  const desde = dayjs(creacionDesde);
  const hasta = dayjs(creacionHasta);

  if (creacionDesde && desde.isAfter(hoy)) {
    return {
      field: 'creacionDesde',
      message: 'La fecha no puede ser posterior a hoy.',
    };
  }

  if (creacionHasta && hasta.isAfter(hoy)) {
    return {
      field: 'creacionHasta',
      message: 'La fecha no puede ser posterior a hoy.',
    };
  }

  if (creacionDesde && creacionHasta) {
    const error = validateRangoDeFechas(desde, hasta, 'creacionHasta');
    if (error) return error;
  }

  return null;
}
