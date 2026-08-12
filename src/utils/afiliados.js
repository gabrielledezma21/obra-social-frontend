import dayjs from 'dayjs';
const generateId = () => crypto.randomUUID?.();

export const newSituacionTerapeutica = () => ({
  id: generateId(),
  situacion: null,
  fechaInicio: dayjs(),
  finaliza: false,
  fechaFin: null,
});

export const newDireccion = () => ({
  id: generateId(),
  calle: '',
  altura: '',
  pisoDepto: '',
  codigoPostal: '',
  localidad: '',
  provincia: null,
});

export const newMiembroGrupoFamiliar = () => ({
  id: generateId(),
  parentesco: null,
  tipoDocumento: null,
  numeroDocumento: '',
  fechaNacimiento: null,
  nombre: '',
  apellido: '',
  usaMismaVigenciaTitular: true,
  vigenciaInicio: null,
  tieneFechaBaja: false,
  vigenciaFin: null,
  direcciones: [newDireccion()],
  usaMismaDireccionTitular: true,
  emails: [],
  telefonos: [],
  tieneSituacionTerapeutica: false,
  situacionesTerapeuticas: [],
});
