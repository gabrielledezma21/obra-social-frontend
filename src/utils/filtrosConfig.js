import validateFiltrosAgendaTurnos from './validations/validateFiltrosAgendaTurnos.js';
import validateFiltrosPrestadores from './validations/validateFiltrosPrestadores.js';
import validateFiltrosAfiliados from './validations/validateFiltrosAfiliados.js';

export const filtrosConfig = {
  'agenda-de-turnos': {
    fields: [
      {
        name: 'provincia',
        label: 'Provincia',
        type: 'select',
        options: [],
        asyncSearchUrl: '/agenda-turnos/provincias',
      },
      {
        name: 'localidad',
        label: 'Localidad',
        type: 'select',
        options: [],
        asyncSearchUrl: '/agenda-turnos/localidades',
      },
      {
        name: 'dia',
        label: 'Día',
        type: 'select',
        options: [
          { value: 'Lunes', label: 'Lunes' },
          { value: 'Martes', label: 'Martes' },
          { value: 'Miércoles', label: 'Miércoles' },
          { value: 'Jueves', label: 'Jueves' },
          { value: 'Viernes', label: 'Viernes' },
          { value: 'Sábado', label: 'Sábado' },
        ],
      },
      {
        name: 'duracion',
        label: 'Duración de turno',
        type: 'select',
        options: [
          { value: '5', label: '5min' },
          { value: '10', label: '10min' },
          { value: '15', label: '15min' },
          { value: '20', label: '20min' },
          { value: '25', label: '25min' },
          { value: '30', label: '30min' },
          { value: '35', label: '35min' },
          { value: '40', label: '40min' },
        ],
      },
      { name: 'horaInicio', label: 'Horario inicio', type: 'time' },
      { name: 'horaFin', label: 'Horario fin', type: 'time' },
      { name: 'creacionDesde', label: 'Creación desde', type: 'date' },
      { name: 'creacionHasta', label: 'Creación hasta', type: 'date' },
    ],
    validateFn: validateFiltrosAgendaTurnos,
  },

  prestador: {
    fields: [
      {
        name: 'tipoPrestador',
        label: 'Tipo de prestador',
        type: 'select',
        options: [
          { value: 'false', label: 'Médico' },
          { value: 'true', label: 'Centro médico' },
        ],
      },
      {
        name: 'especialidad',
        label: 'Especialidad',
        type: 'select',
        options: [],
        asyncSearchUrl: '/especialidades',
      },
      {
        name: 'localidad',
        label: 'Localidad',
        type: 'select',
        options: [],
        asyncSearchUrl: '/prestadores/localidades',
      },
      {
        name: 'provincia',
        label: 'Provincia',
        type: 'select',
        options: [],
        asyncSearchUrl: '/prestadores/provincias',
      },
      { name: 'creacionDesde', label: 'Creación desde', type: 'date' },
      { name: 'creacionHasta', label: 'Creación hasta', type: 'date' },
    ],
    validateFn: validateFiltrosPrestadores,
  },

  afiliado: {
    fields: [
      {
        name: 'estado',
        label: 'Mostrar afiliados por vigencia',
        type: 'select',
        options: [
          { value: 'Vigentes', label: 'Afiliados vigentes' },
          { value: 'Bajas', label: 'Afiliados dados de baja' },
          { value: 'Vigencia futura', label: 'Afiliados con vigencia futura' },
          { value: 'Todos', label: 'Todos los afiliados' },
        ],
      },
      { name: 'nroAfiliado', label: 'Nro de Afiliado', type: 'text' },
      {
        name: 'tipoDocumento',
        label: 'Tipo de documento',
        type: 'select',
        options: [
          { value: 'DNI', label: 'DNI' },
          { value: 'Pasaporte', label: 'Pasaporte' },
          { value: 'Libreta cívica', label: 'Libreta Cívica' },
        ],
      },
      {
        name: 'planMedico',
        label: 'Plan Médico',
        type: 'select',
        options: [
          { value: '210', label: '210' },
          { value: '310', label: '310' },
          { value: '410', label: '410' },
          { value: '510', label: '510' },
        ],
      },
      {
        name: 'provincia',
        label: 'Provincia',
        type: 'select',
        options: [],
        asyncSearchUrl: '/afiliados/provincias',
      },
      {
        name: 'localidad',
        label: 'Localidad',
        type: 'select',
        options: [],
        asyncSearchUrl: '/afiliados/localidades',
      },
      { name: 'vigenciaDesde', label: 'Vigencia desde', type: 'date' },
      { name: 'vigenciaHasta', label: 'Vigencia hasta', type: 'date' },
      { name: 'creacionDesde', label: 'Creación desde', type: 'date' },
      { name: 'creacionHasta', label: 'Creación hasta', type: 'date' },
      { name: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { name: 'email', label: 'E-mail', type: 'text' },
    ],
    validateFn: validateFiltrosAfiliados,
  },
};
