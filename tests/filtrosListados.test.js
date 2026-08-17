import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filtrarAfiliados,
  filtrarPrestadores,
} from '../src/utils/filtrosListados.js';

const afiliados = [
  {
    _id: '66c000000000000000000001',
    nombre: 'Homero',
    apellido: 'Simpson',
    dni: 10000001,
    numeroAfiliado: 1000,
    numeroIntegrante: 1,
    parentesco: 'Titular',
    tipoDocumento: 'DNI',
    plan: '310',
    fechaNacimiento: '1980-05-12T00:00:00.000Z',
    fechaAlta: '2025-01-01T00:00:00.000Z',
    fechaBaja: null,
    creadoEn: '2025-01-01T10:00:00.000Z',
    emails: [{ direccion: 'homero@simpson.com' }],
    telefonos: [{ numero: '1111111111' }],
    direccionId: {
      _id: '66c000000000000000000101',
      provincia: 'Buenos Aires',
      localidad: 'Moron',
    },
    direccionesIds: [],
  },
  {
    _id: '66c000000000000000000002',
    nombre: 'Lucia',
    apellido: 'Fernandez',
    dni: 20000001,
    numeroAfiliado: 2000,
    numeroIntegrante: 1,
    parentesco: 'Titular',
    tipoDocumento: 'CE',
    plan: '210',
    fechaNacimiento: '1990-03-15T00:00:00.000Z',
    fechaAlta: '2024-01-01T00:00:00.000Z',
    fechaBaja: '2026-01-01T00:00:00.000Z',
    creadoEn: '2024-01-01T10:00:00.000Z',
    emails: [{ direccion: 'lucia@demo.com' }],
    telefonos: [{ numero: '2222222222' }],
    direccionId: {
      _id: '66c000000000000000000102',
      provincia: 'Cordoba',
      localidad: 'Cordoba',
    },
    direccionesIds: [
      {
        _id: '66c000000000000000000103',
        provincia: 'Buenos Aires',
        localidad: 'Haedo',
      },
    ],
  },
  {
    _id: '66c000000000000000000003',
    nombre: 'Futuro',
    apellido: 'Afiliado',
    dni: 30000001,
    numeroAfiliado: 3000,
    numeroIntegrante: 1,
    parentesco: 'Titular',
    tipoDocumento: 'DNI',
    plan: '410',
    fechaNacimiento: '2000-01-01T00:00:00.000Z',
    fechaAlta: '2027-01-01T00:00:00.000Z',
    fechaBaja: null,
    creadoEn: '2026-08-01T10:00:00.000Z',
    emails: [{ direccion: 'futuro@demo.com' }],
    telefonos: [{ numero: '3333333333' }],
    direccionId: {
      _id: '66c000000000000000000104',
      provincia: 'Santa Fe',
      localidad: 'Rosario',
    },
    direccionesIds: [],
  },
];

const prestadores = [
  {
    _id: '66c000000000000000000011',
    nombre: 'Dr. House',
    cuilCuit: '20123456789',
    esCentroMedico: false,
    especialidades: [
      { _id: '66c000000000000000000201', nombre: 'Cardiologia' },
      { _id: '66c000000000000000000202', nombre: 'Clinica Medica' },
    ],
    centrosDeAtencion: [
      {
        direccionId: {
          provincia: 'Buenos Aires',
          localidad: 'CABA',
          codigoPostal: '1000',
        },
      },
    ],
  },
  {
    _id: '66d000000000000000000012',
    nombre: 'Centro MedIntegral Oeste',
    cuilCuit: '30222222222',
    esCentroMedico: true,
    especialidades: [
      { _id: '66c000000000000000000203', nombre: 'Pediatria' },
    ],
    centrosDeAtencion: [
      {
        direccionId: {
          provincia: 'Buenos Aires',
          localidad: 'Moron',
          codigoPostal: '1708',
        },
      },
    ],
  },
];

test('los filtros de afiliados aplican estado, plan, ubicación y contacto', () => {
  const ahora = new Date('2026-08-17T12:00:00.000Z');

  assert.deepEqual(
    filtrarAfiliados(afiliados, { estado: { value: 'Vigentes' } }, ahora).map(
      (item) => item.nombre
    ),
    ['Homero']
  );
  assert.deepEqual(
    filtrarAfiliados(afiliados, { estado: { value: 'Bajas' } }, ahora).map(
      (item) => item.nombre
    ),
    ['Lucia']
  );
  assert.deepEqual(
    filtrarAfiliados(
      afiliados,
      { estado: { value: 'Vigencia futura' } },
      ahora
    ).map((item) => item.nombre),
    ['Futuro']
  );

  assert.equal(
    filtrarAfiliados(afiliados, { planMedico: { value: '210' } }, ahora)[0]
      .nombre,
    'Lucia'
  );
  assert.equal(
    filtrarAfiliados(
      afiliados,
      { localidad: { value: 'Haedo', label: 'Haedo' } },
      ahora
    )[0].nombre,
    'Lucia'
  );
  assert.equal(
    filtrarAfiliados(afiliados, { email: 'simpson.com' }, ahora)[0].nombre,
    'Homero'
  );
  assert.equal(
    filtrarAfiliados(
      afiliados,
      { tipoDocumento: { value: 'Pasaporte', label: 'Pasaporte' } },
      ahora
    )[0].nombre,
    'Lucia'
  );
});

test('los filtros de afiliados se combinan y respetan fechas', () => {
  const ahora = new Date('2026-08-17T12:00:00.000Z');
  const resultado = filtrarAfiliados(
    afiliados,
    {
      textInputSearch: 'homero',
      estado: { value: 'Vigentes' },
      planMedico: { value: '310' },
      provincia: { value: 'Buenos Aires', label: 'Buenos Aires' },
      fechaNacimiento: '1980-05-12',
      creacionDesde: '2025-01-01',
      creacionHasta: '2025-12-31',
    },
    ahora
  );

  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].dni, 10000001);
});

test('los filtros de prestadores aplican tipo, especialidad, ubicación y texto', () => {
  assert.deepEqual(
    filtrarPrestadores(prestadores, {
      tipoPrestador: { value: 'true', label: 'Centro médico' },
    }).map((item) => item.nombre),
    ['Centro MedIntegral Oeste']
  );

  assert.deepEqual(
    filtrarPrestadores(prestadores, {
      especialidad: {
        value: '66c000000000000000000201',
        label: 'Cardiologia',
      },
    }).map((item) => item.nombre),
    ['Dr. House']
  );

  assert.deepEqual(
    filtrarPrestadores(prestadores, {
      localidad: { value: 'Moron', label: 'Moron' },
      provincia: { value: 'Buenos Aires', label: 'Buenos Aires' },
    }).map((item) => item.nombre),
    ['Centro MedIntegral Oeste']
  );

  assert.deepEqual(
    filtrarPrestadores(prestadores, { textInputSearch: '1708' }).map(
      (item) => item.nombre
    ),
    ['Centro MedIntegral Oeste']
  );
});
