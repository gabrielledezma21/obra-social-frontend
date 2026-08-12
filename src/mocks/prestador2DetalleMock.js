export const prestador2DetalleMock = {
  id: 2,
  nombre: 'Dr. Juan Pérez',
  cuilCuit: '20-23456789-0',
  esCentroMedico: false,

  especialidades: [
    { id: 3, nombre: 'Clínica Médica' },
    { id: 4, nombre: 'Medicina General' },
  ],

  emails: [{ id: 3, direccion: 'juan.perez@clinica.com' }],

  telefonos: [{ id: 3, numero: '+54 11 5555-8888' }],

  centrosDeAtencion: [
    {
      id: 3,
      calle: 'Calle Falsa',
      altura: '123',
      pisoDepto: '1A',
      codigoPostal: '1602',
      localidad: 'Vicente López',
      provincia: { id: 1, nombre: 'Buenos Aires' },
      horarios: [
        {
          id: 4,
          dia: { id: 1, nombre: 'Lunes' },
          horaInicio: '08:00',
          horaFin: '12:00',
        },
        {
          id: 5,
          dia: { id: 3, nombre: 'Miércoles' },
          horaInicio: '14:00',
          horaFin: '18:00',
        },
      ],
    },
  ],

  agendaTurnos: [],
};
