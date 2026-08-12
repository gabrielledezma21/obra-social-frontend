const allAgendas = [
  {
    id: 1,
    prestador: 'Clínica Modelo de Morón',
    especialidad: 'Cardiología',
    horariosAtencion: [
      {
        dias: ['Lunes'],
        horaInicio: '10:00',
        horaFin: '20:00',
        duracion: 25,
      },
      {
        dias: ['Martes'],
        horaInicio: '10:00',
        horaFin: '18:00',
        duracion: 25,
      },
    ],
    direccion: {
      calle: 'Av. Rivadavia',
      altura: 8900,
      pisoDepto: null,
      localidad: 'Morón',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 2,
    prestador: 'Clínica Modelo de Morón',
    especialidad: 'Obstetricia',
    horariosAtencion: [
      {
        dias: ['Miércoles'],
        horaInicio: '08:00',
        horaFin: '17:00',
        duracion: 30,
      },
    ],
    direccion: {
      calle: 'Av. Rivadavia',
      altura: 8900,
      pisoDepto: null,
      localidad: 'Morón',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 3,
    prestador: 'Clínica Mariano Moreno',
    especialidad: 'Pediatría',
    horariosAtencion: [
      {
        dias: ['Lunes'],
        horaInicio: '08:00',
        horaFin: '12:00',
        duracion: 20,
      },
      {
        dias: ['Martes'],
        horaInicio: '08:00',
        horaFin: '12:00',
        duracion: 20,
      },
      {
        dias: ['Miércoles'],
        horaInicio: '10:00',
        horaFin: '14:00',
        duracion: 20,
      },
    ],
    direccion: {
      calle: 'Av. San Martín',
      altura: 1234,
      pisoDepto: null,
      localidad: 'Moreno',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 4,
    prestador: 'Dr. Sigmund Freud',
    especialidad: 'Psiquiatría',
    horariosAtencion: [
      {
        dias: ['Martes'],
        horaInicio: '18:00',
        horaFin: '22:00',
        duracion: 10,
      },
      {
        dias: ['Jueves'],
        horaInicio: '14:00',
        horaFin: '20:00',
        duracion: 10,
      },
    ],
    direccion: {
      calle: 'Av. Boulogne',
      altura: 5678,
      pisoDepto: null,
      localidad: 'Boulogne',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 5,
    prestador: 'Hospital Italiano',
    especialidad: 'Dermatología',
    horariosAtencion: [
      {
        dias: ['Lunes'],
        horaInicio: '08:00',
        horaFin: '16:00',
        duracion: 20,
      },
      {
        dias: ['Miércoles'],
        horaInicio: '09:00',
        horaFin: '15:00',
        duracion: 20,
      },
    ],
    direccion: {
      calle: 'Gascón',
      altura: 450,
      pisoDepto: null,
      localidad: 'CABA',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 6,
    prestador: 'Sanatorio Las Lomas',
    especialidad: 'Traumatología',
    horariosAtencion: [
      {
        dias: ['Martes'],
        horaInicio: '10:00',
        horaFin: '18:00',
        duracion: 25,
      },
      {
        dias: ['Jueves'],
        horaInicio: '08:00',
        horaFin: '16:00',
        duracion: 25,
      },
    ],
    direccion: {
      calle: 'Italia',
      altura: 1550,
      pisoDepto: null,
      localidad: 'San Isidro',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 7,
    prestador: 'Centro Médico Ramos',
    especialidad: 'Clínica Médica',
    horariosAtencion: [
      {
        dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        horaInicio: '08:00',
        horaFin: '14:00',
        duracion: 30,
      },
    ],
    direccion: {
      calle: 'Av. de Mayo',
      altura: 123,
      pisoDepto: null,
      localidad: 'Ramos Mejía',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 8,
    prestador: 'Clínica San Justo',
    especialidad: 'Ginecología',
    horariosAtencion: [
      {
        dias: ['Lunes', 'Miércoles'],
        horaInicio: '09:00',
        horaFin: '17:00',
        duracion: 20,
      },
    ],
    direccion: {
      calle: 'Av. Illia',
      altura: 789,
      pisoDepto: null,
      localidad: 'San Justo',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 9,
    prestador: 'Hospital Austral',
    especialidad: 'Neurología',
    horariosAtencion: [
      {
        dias: ['Lunes'],
        horaInicio: '12:00',
        horaFin: '18:00',
        duracion: 25,
      },
      {
        dias: ['Viernes'],
        horaInicio: '13:00',
        horaFin: '20:00',
        duracion: 25,
      },
    ],
    direccion: {
      calle: 'Av. Juan Domingo Perón',
      altura: 1500,
      pisoDepto: null,
      localidad: 'Pilar',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 10,
    prestador: 'Clínica del Sol',
    especialidad: 'Oftalmología',
    horariosAtencion: [
      {
        dias: ['Miércoles'],
        horaInicio: '09:00',
        horaFin: '17:00',
        duracion: 15,
      },
    ],
    direccion: {
      calle: 'Av. Santa Fe',
      altura: 4800,
      pisoDepto: null,
      localidad: 'Palermo',
      provincia: 'CABA',
    },
  },
  {
    id: 11,
    prestador: 'Hospital Posadas',
    especialidad: 'Neumonología',
    horariosAtencion: [
      {
        dias: ['Lunes'],
        horaInicio: '08:00',
        horaFin: '12:00',
        duracion: 25,
      },
      {
        dias: ['Miércoles'],
        horaInicio: '10:00',
        horaFin: '14:00',
        duracion: 25,
      },
    ],
    direccion: {
      calle: 'Av. Illia y Marconi',
      altura: null,
      pisoDepto: null,
      localidad: 'El Palomar',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 12,
    prestador: 'Dr. Carlos Diol',
    especialidad: 'Otorrinolaringología',
    horariosAtencion: [
      {
        dias: ['Martes'],
        horaInicio: '14:00',
        horaFin: '20:00',
        duracion: 20,
      },
      {
        dias: ['Viernes'],
        horaInicio: '08:00',
        horaFin: '13:00',
        duracion: 20,
      },
    ],
    direccion: {
      calle: 'Av. Rivadavia',
      altura: 12000,
      pisoDepto: null,
      localidad: 'Liniers',
      provincia: 'CABA',
    },
  },
  {
    id: 13,
    prestador: 'Clínica San Fernando',
    especialidad: 'Urología',
    horariosAtencion: [
      {
        dias: ['Martes', 'Jueves'],
        horaInicio: '09:00',
        horaFin: '17:00',
        duracion: 30,
      },
    ],
    direccion: {
      calle: 'Constitución',
      altura: 760,
      pisoDepto: null,
      localidad: 'San Fernando',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 14,
    prestador: 'Sanatorio Anchorena',
    especialidad: 'Cardiología',
    horariosAtencion: [
      {
        dias: ['Lunes'],
        horaInicio: '10:00',
        horaFin: '18:00',
        duracion: 25,
      },
      {
        dias: ['Viernes'],
        horaInicio: '09:00',
        horaFin: '15:00',
        duracion: 25,
      },
    ],
    direccion: {
      calle: 'Pueyrredón',
      altura: 1640,
      pisoDepto: null,
      localidad: 'CABA',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 15,
    prestador: 'Dra. Lucía Pérez',
    especialidad: 'Endocrinología',
    horariosAtencion: [
      {
        dias: ['Lunes'],
        horaInicio: '09:00',
        horaFin: '13:00',
        duracion: 20,
      },
      {
        dias: ['Jueves'],
        horaInicio: '10:00',
        horaFin: '18:00',
        duracion: 20,
      },
    ],
    direccion: {
      calle: 'Av. Libertador',
      altura: 5200,
      pisoDepto: null,
      localidad: 'Belgrano',
      provincia: 'CABA',
    },
  },
  {
    id: 16,
    prestador: 'Centro Médico Norte',
    especialidad: 'Reumatología',
    horariosAtencion: [
      {
        dias: ['Martes'],
        horaInicio: '08:00',
        horaFin: '12:00',
        duracion: 30,
      },
      {
        dias: ['Viernes'],
        horaInicio: '12:00',
        horaFin: '16:00',
        duracion: 30,
      },
    ],
    direccion: {
      calle: 'Av. Roca',
      altura: 2300,
      pisoDepto: null,
      localidad: 'Munro',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 17,
    prestador: 'Dr. Pablo González',
    especialidad: 'Kinesiología',
    horariosAtencion: [
      {
        dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        horaInicio: '09:00',
        horaFin: '18:00',
        duracion: 45,
      },
    ],
    direccion: {
      calle: 'Mitre',
      altura: 6700,
      pisoDepto: null,
      localidad: 'Wilde',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 18,
    prestador: 'Clínica Santa Isabel',
    especialidad: 'Pediatría',
    horariosAtencion: [
      {
        dias: ['Lunes'],
        horaInicio: '08:00',
        horaFin: '14:00',
        duracion: 20,
      },
      {
        dias: ['Miércoles'],
        horaInicio: '10:00',
        horaFin: '18:00',
        duracion: 20,
      },
    ],
    direccion: {
      calle: 'Av. Directorio',
      altura: 3500,
      pisoDepto: null,
      localidad: 'CABA',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 19,
    prestador: 'Hospital Español',
    especialidad: 'Dermatología',
    horariosAtencion: [
      {
        dias: ['Martes'],
        horaInicio: '10:00',
        horaFin: '18:00',
        duracion: 25,
      },
    ],
    direccion: {
      calle: 'Av. Belgrano',
      altura: 2975,
      pisoDepto: null,
      localidad: 'CABA',
      provincia: 'Buenos Aires',
    },
  },
  {
    id: 20,
    prestador: 'Clínica Olivos',
    especialidad: 'Gastroenterología',
    horariosAtencion: [
      {
        dias: ['Lunes', 'Miércoles'],
        horaInicio: '08:00',
        horaFin: '15:00',
        duracion: 30,
      },
    ],
    direccion: {
      calle: 'Corrientes',
      altura: 450,
      pisoDepto: null,
      localidad: 'Olivos',
      provincia: 'Buenos Aires',
    },
  },
];

const unique = (arr) => [...new Set(arr.filter(Boolean))];

const dias = unique(
  allAgendas.flatMap((a) => a.horariosAtencion?.flatMap((h) => h.dia) || [])
);

const provincias = unique(allAgendas.map((a) => a.direccion?.provincia));
const localidades = unique(allAgendas.map((a) => a.direccion?.localidad));

export function searchAgendaTurnosMock(filters = {}, page = 1, limit = 10) {
  const text = (filters.textInputSearch || '').toLowerCase();

  const filtered = allAgendas.filter((a) => {
    if (
      text &&
      !a.prestador.toLowerCase().includes(text) &&
      !a.especialidad.toLowerCase().includes(text)
    )
      return false;
    if (
      filters.provincia &&
      a.direccion?.provincia?.toLowerCase() !== filters.provincia.toLowerCase()
    )
      return false;
    if (
      filters.localidad &&
      a.direccion?.localidad?.toLowerCase() !== filters.localidad.toLowerCase()
    )
      return false;
    if (
      filters.dia &&
      !a.horariosAtencion?.some((h) =>
        h.dia.some((d) => d.toLowerCase() === filters.dia.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = filtered.slice(start, end);

  return { items, total, page, limit };
}

const mapOptions = (arr) =>
  arr.map((nombre) => ({ value: nombre, label: nombre }));

export const agendaTurnosFiltrosMocks = {
  '/api/agenda-turnos/provincias': (search = '') =>
    mapOptions(
      provincias.filter((p) => p.toLowerCase().includes(search.toLowerCase()))
    ),
  '/api/agenda-turnos/localidades': (search = '') =>
    mapOptions(
      localidades.filter((l) => l.toLowerCase().includes(search.toLowerCase()))
    ),
  '/api/agenda-turnos/dias': (search = '') =>
    mapOptions(
      dias.filter((d) => d.toLowerCase().includes(search.toLowerCase()))
    ),
};
