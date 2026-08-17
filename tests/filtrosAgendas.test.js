import test from 'node:test';
import assert from 'node:assert/strict';
import { filtrarAgendas } from '../src/utils/filtrosAgendas.js';

const agendas = [
  {
    _id: '6a7914800000000000000001',
    id: '6a7914800000000000000001',
    prestador: { id: 'prestador-house', nombre: 'Dr. Gregory House' },
    especialidad: { id: 'especialidad-cardio', nombre: 'Cardiologia' },
    direccion: {
      provincia: 'Buenos Aires',
      localidad: 'Ramos Mejia',
      codigoPostal: '1704',
    },
    horariosAtencion: [
      {
        dia: 'Lunes',
        horaInicio: '08:00',
        horaFin: '12:00',
        duracionTurno: 20,
      },
      {
        dia: 'Miércoles',
        horaInicio: '14:00',
        horaFin: '18:00',
        duracionTurno: 20,
      },
    ],
  },
  {
    _id: '6a4458800000000000000002',
    id: '6a4458800000000000000002',
    prestador: { id: 'prestador-grey', nombre: 'Dra. Meredith Grey' },
    especialidad: { id: 'especialidad-clinica', nombre: 'Clinica Medica' },
    direccion: {
      provincia: 'CABA',
      localidad: 'Palermo',
      codigoPostal: '1425',
    },
    horariosAtencion: [
      {
        dia: 'Martes',
        horaInicio: '09:00',
        horaFin: '13:00',
        duracionTurno: 30,
      },
    ],
  },
];

test('los filtros de agendas aplican ubicación, día, duración y horarios', () => {
  assert.deepEqual(
    filtrarAgendas(agendas, {
      provincia: { value: 'Buenos Aires', label: 'Buenos Aires' },
      localidad: { value: 'Ramos Mejia', label: 'Ramos Mejia' },
      dia: { value: 'Lunes', label: 'Lunes' },
      duracion: { value: '20', label: '20min' },
      horaInicio: '08:00',
      horaFin: '12:00',
    }).map((agenda) => agenda.prestador.nombre),
    ['Dr. Gregory House']
  );
});

test('los filtros de agendas combinan búsqueda general con día y especialidad', () => {
  assert.deepEqual(
    filtrarAgendas(agendas, {
      textInputSearch: 'house',
      dia: { value: 'Miércoles', label: 'Miércoles' },
      especialidad: {
        value: 'especialidad-cardio',
        label: 'Cardiologia',
      },
    }).map((agenda) => agenda.especialidad.nombre),
    ['Cardiologia']
  );

  assert.equal(
    filtrarAgendas(agendas, {
      textInputSearch: '1425',
    })[0].prestador.nombre,
    'Dra. Meredith Grey'
  );
});

test('los filtros de agendas respetan la fecha de creación derivada del ObjectId', () => {
  assert.deepEqual(
    filtrarAgendas(agendas, {
      creacionDesde: '2026-08-01',
      creacionHasta: '2026-08-17',
    }).map((agenda) => agenda.prestador.nombre),
    ['Dr. Gregory House']
  );
});

test('los filtros de horarios deben coincidir dentro del mismo bloque', () => {
  assert.equal(
    filtrarAgendas(agendas, {
      dia: { value: 'Lunes', label: 'Lunes' },
      horaInicio: '14:00',
    }).length,
    0
  );
});
