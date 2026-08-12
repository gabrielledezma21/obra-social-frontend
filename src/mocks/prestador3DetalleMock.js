export const prestador3DetalleMock = {
  id: 3,
  nombre: 'Dra. María López',
  cuilCuit: '27-98765432-1',
  esCentroMedico: false,

  especialidades: [{ id: 5, nombre: 'Dermatología' }],

  emails: [{ id: 4, direccion: 'maria.lopez@dermatologia.com' }],

  telefonos: [{ id: 4, numero: '+54 11 1234-5678' }],

  centrosDeAtencion: [
    {
      id: 4,
      calle: 'San Martín',
      altura: '789',
      pisoDepto: null,
      codigoPostal: '1706',
      localidad: 'Haedo',
      provincia: { id: 1, nombre: 'Buenos Aires' },
      horarios: [
        {
          id: 6,
          dia: { id: 2, nombre: 'Martes' },
          horaInicio: '10:00',
          horaFin: '13:00',
        },
        {
          id: 7,
          dia: { id: 5, nombre: 'Viernes' },
          horaInicio: '15:00',
          horaFin: '19:00',
        },
      ],
    },
  ],

  agendaTurnos: [],
};
