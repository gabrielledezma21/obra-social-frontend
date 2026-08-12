const afiliados = [
  {
    id: 1,
    nombre: 'Emiliano',
    apellido: 'Lopez',
    tipoDocumento: { id: 1, tipo: 'DNI' },
    numeroDocumento: '12345678',
    nroAfiliado: '0000001-01',
    cobertura: { id: 2, plan: '310' },
    vigenciaInicio: '01/08/2023',
    emails: [{ id: 1, direccion: 'emilopez@email.com' }],
    telefonos: [{ id: 1, numero: '11 1234-5678' }],
    direcciones: [
      {
        id: 1,
        calle: 'Av. Libertador',
        altura: '500',
        pisoDepto: '10A',
        codigoPostal: '1426',
        localidad: 'Palermo',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
    ],
  },
  {
    id: 2,
    nombre: 'Lucía',
    apellido: 'Pérez',
    tipoDocumento: { id: 1, tipo: 'DNI' },
    numeroDocumento: '32569874',
    nroAfiliado: '0000002-01',
    cobertura: { id: 2, plan: '310' },
    vigenciaInicio: '15/09/2022',
    emails: [{ id: 2, direccion: 'lucia.perez@email.com' }],
    telefonos: [{ id: 2, numero: '11 9988-7766' }],
    direcciones: [
      {
        id: 2,
        calle: 'Córdoba',
        altura: '2100',
        pisoDepto: '3B',
        codigoPostal: '1425',
        localidad: 'Recoleta',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
    ],
  },
  {
    id: 3,
    nombre: 'Martín',
    apellido: 'González',
    tipoDocumento: { id: 2, tipo: 'PAS' },
    numeroDocumento: '28956321',
    nroAfiliado: '0000003-01',
    cobertura: { id: 4, plan: '510' },
    vigenciaInicio: '10/03/2024',
    emails: [
      { id: 3, direccion: 'martin.gonzalez@email.com' },
      { id: 4, direccion: 'mgonzalez@workmail.com' },
    ],
    telefonos: [
      { id: 3, numero: '11 3344-2211' },
      { id: 4, numero: '11 8877-6655' },
    ],
    direcciones: [
      {
        id: 3,
        calle: 'Santa Fe',
        altura: '3300',
        pisoDepto: '7C',
        codigoPostal: '1426',
        localidad: 'Palermo',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
      {
        id: 4,
        calle: 'Av. San Martín',
        altura: '4500',
        codigoPostal: '1416',
        localidad: 'Villa Devoto',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
    ],
  },
  {
    id: 4,
    nombre: 'Sofía',
    apellido: 'Ramírez',
    tipoDocumento: { id: 1, tipo: 'DNI' },
    numeroDocumento: '41236598',
    nroAfiliado: '0000004-01',
    cobertura: { id: 1, plan: '210' },
    vigenciaInicio: '05/01/2023',
    emails: [{ id: 5, direccion: 'sofia.ramirez@email.com' }],
    telefonos: [{ id: 5, numero: '11 6677-8899' }],
    direcciones: [
      {
        id: 5,
        calle: 'Rivadavia',
        altura: '9500',
        codigoPostal: '1408',
        localidad: 'Flores',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
    ],
  },
  {
    id: 5,
    nombre: 'Federico',
    apellido: 'Sánchez',
    tipoDocumento: { id: 1, tipo: 'DNI' },
    numeroDocumento: '30548765',
    nroAfiliado: '0000005-01',
    cobertura: { id: 3, plan: '410' },
    vigenciaInicio: '20/02/2022',
    emails: [
      { id: 6, direccion: 'fede.sanchez@email.com' },
      { id: 7, direccion: 'fsanchez@empresa.com' },
    ],
    telefonos: [{ id: 6, numero: '11 4455-3311' }],
    direcciones: [
      {
        id: 6,
        calle: 'Av. Belgrano',
        altura: '2300',
        pisoDepto: '4A',
        codigoPostal: '1090',
        localidad: 'Monserrat',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
    ],
  },
  {
    id: 6,
    nombre: 'Valentina',
    apellido: 'Torres',
    tipoDocumento: { id: 1, tipo: 'DNI' },
    numeroDocumento: '37569852',
    nroAfiliado: '0000006-01',
    cobertura: { id: 4, plan: '510' },
    vigenciaInicio: '12/11/2021',
    emails: [{ id: 8, direccion: 'valentina.torres@email.com' }],
    telefonos: [
      { id: 7, numero: '11 6677-5522' },
      { id: 8, numero: '11 1111-2222' },
    ],
    direcciones: [
      {
        id: 7,
        calle: 'Callao',
        altura: '1800',
        codigoPostal: '1024',
        localidad: 'Recoleta',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
    ],
  },
  {
    id: 7,
    nombre: 'Diego',
    apellido: 'Martínez',
    tipoDocumento: { id: 2, tipo: 'PAS' },
    numeroDocumento: '29984562',
    nroAfiliado: '0000007-01',
    cobertura: { id: 3, plan: '410' },
    vigenciaInicio: '01/05/2020',
    emails: [{ id: 9, direccion: 'diego.martinez@email.com' }],
    telefonos: [{ id: 9, numero: '11 7777-8888' }],
    direcciones: [
      {
        id: 8,
        calle: 'Juan B. Justo',
        altura: '4300',
        codigoPostal: '1416',
        localidad: 'Villa Crespo',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
    ],
  },
  {
    id: 8,
    nombre: 'Carolina',
    apellido: 'Fernández',
    tipoDocumento: { id: 1, tipo: 'DNI' },
    numeroDocumento: '26548931',
    nroAfiliado: '0000008-01',
    cobertura: { id: 2, plan: '310' },
    vigenciaInicio: '09/07/2019',
    emails: [{ id: 10, direccion: 'caro.fernandez@email.com' }],
    telefonos: [{ id: 10, numero: '11 9999-1234' }],
    direcciones: [
      {
        id: 9,
        calle: 'Cabildo',
        altura: '2900',
        codigoPostal: '1428',
        localidad: 'Belgrano',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
    ],
  },
  {
    id: 9,
    nombre: 'Juan',
    apellido: 'Alvarez',
    tipoDocumento: { id: 1, tipo: 'DNI' },
    numeroDocumento: '20365498',
    nroAfiliado: '0000009-01',
    cobertura: { id: 4, plan: '510' },
    vigenciaInicio: '22/03/2022',
    emails: [
      { id: 11, direccion: 'juan.alvarez@email.com' },
      { id: 12, direccion: 'jalvarez@empresa.com' },
    ],
    telefonos: [{ id: 11, numero: '11 3333-5555' }],
    direcciones: [
      {
        id: 10,
        calle: 'Corrientes',
        altura: '4600',
        codigoPostal: '1414',
        localidad: 'Almagro',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
    ],
  },
  {
    id: 10,
    nombre: 'Laura',
    apellido: 'Giménez',
    tipoDocumento: { id: 3, tipo: 'LC' },
    numeroDocumento: '31547895',
    nroAfiliado: '0000010-01',
    cobertura: { id: 1, plan: '210' },
    vigenciaInicio: '11/12/2023',
    emails: [{ id: 13, direccion: 'laura.gimenez@email.com' }],
    telefonos: [{ id: 12, numero: '11 2222-9999' }],
    direcciones: [
      {
        id: 11,
        calle: 'Directorio',
        altura: '3700',
        codigoPostal: '1407',
        localidad: 'Flores',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
    ],
  },
  {
    id: 11,
    nombre: 'Nicolás',
    apellido: 'Ruiz',
    tipoDocumento: { id: 1, tipo: 'DNI' },
    numeroDocumento: '28954736',
    nroAfiliado: '0000011-01',
    cobertura: { id: 4, plan: '510' },
    vigenciaInicio: '10/04/2021',
    emails: [{ id: 14, direccion: 'nicolas.ruiz@email.com' }],
    telefonos: [
      { id: 13, numero: '11 5555-6666' },
      { id: 14, numero: '11 7777-3333' },
    ],
    direcciones: [
      {
        id: 12,
        calle: 'Las Heras',
        altura: '2100',
        pisoDepto: '5B',
        codigoPostal: '1425',
        localidad: 'Recoleta',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
    ],
  },
  {
    id: 12,
    nombre: 'Julieta',
    apellido: 'Cáceres',
    tipoDocumento: { id: 1, tipo: 'DNI' },
    numeroDocumento: '33456982',
    nroAfiliado: '0000012-01',
    cobertura: { id: 1, plan: '210' },
    vigenciaInicio: '04/06/2020',
    emails: [
      { id: 15, direccion: 'julieta.caceres@email.com' },
      { id: 16, direccion: 'jcaceres@corp.com' },
    ],
    telefonos: [{ id: 15, numero: '11 1111-4444' }],
    direcciones: [
      {
        id: 13,
        calle: 'Medrano',
        altura: '800',
        codigoPostal: '1179',
        localidad: 'Almagro',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
    ],
  },
  {
    id: 13,
    nombre: 'Camila',
    apellido: 'Domínguez',
    tipoDocumento: { id: 1, tipo: 'DNI' },
    numeroDocumento: '30214567',
    nroAfiliado: '0000013-01',
    cobertura: { id: 4, plan: '510' },
    vigenciaInicio: '23/09/2023',
    emails: [{ id: 17, direccion: 'camila.dominguez@email.com' }],
    telefonos: [{ id: 16, numero: '11 9876-5432' }],
    direcciones: [
      {
        id: 14,
        calle: 'Arenales',
        altura: '1500',
        pisoDepto: '2C',
        codigoPostal: '1061',
        localidad: 'Retiro',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
    ],
  },
  {
    id: 14,
    nombre: 'Gonzalo',
    apellido: 'Moreno',
    tipoDocumento: { id: 1, tipo: 'DNI' },
    numeroDocumento: '27659874',
    nroAfiliado: '0000014-01',
    cobertura: { id: 1, plan: '210' },
    vigenciaInicio: '02/02/2022',
    emails: [{ id: 18, direccion: 'gonzalo.moreno@email.com' }],
    telefonos: [{ id: 17, numero: '11 8765-4321' }],
    direcciones: [
      {
        id: 15,
        calle: 'Juramento',
        altura: '2600',
        codigoPostal: '1428',
        localidad: 'Belgrano',
        provincia: { id: 1, nombre: 'Buenos Aires' },
      },
    ],
  },
  {
    id: 15,
    nombre: 'Paula',
    apellido: 'Herrera',
    tipoDocumento: { id: 1, tipo: 'DNI' },
    numeroDocumento: '31598742',
    nroAfiliado: '0000015-01',
    cobertura: { id: 3, plan: '410' },
    vigenciaInicio: '14/07/2021',
    emails: [
      { id: 19, direccion: 'paula.herrera@email.com' },
      { id: 20, direccion: 'pherrera@empresa.com' },
    ],
    telefonos: [
      { id: 18, numero: '11 6543-2109' },
      { id: 19, numero: '11 7777-1111' },
    ],
    direcciones: [
      {
        id: 16,
        calle: 'Scalabrini Ortiz',
        altura: '1300',
        codigoPostal: '1414',
        localidad: 'Cachi',
        provincia: { id: 1, nombre: 'Salta' },
      },
      {
        id: 17,
        calle: 'Honduras',
        altura: '5000',
        codigoPostal: '1414',
        localidad: 'Cafayate',
        provincia: { id: 1, nombre: 'Salta' },
      },
    ],
  },
];

const unique = (arr) => [...new Set(arr.filter(Boolean))];
const provincias = unique(
  afiliados.flatMap((a) => a.direcciones.map((d) => d.provincia.nombre))
);

const localidades = unique(
  afiliados.flatMap((a) => a.direcciones.map((d) => d.localidad))
);

export function searchAfiliadosMock(filters = {}, page = 1, limit = 10) {
  const text = (filters.textInputSearch || '').toLowerCase();

  const filtered = afiliados.filter((a) => {
    if (
      text &&
      !(
        a.nombre.toLowerCase().includes(text) &&
        a.apellido.toLowerCase().includes(text) &&
        a.numeroDocumento.includes(text) &&
        a.nroAfiliado.includes(text)
      )
    )
      return false;

    if (filters.tipoDocumento && filters.tipoDocumento !== a.tipoDocumento.id)
      return false;

    if (filters.planMedico && filters.planMedico !== a.cobertura.id)
      return false;

    if (
      filters.numeroDocumento &&
      filters.numeroDocumento !== a.numeroDocumento
    )
      return false;

    if (
      filters.provincia &&
      !a.direcciones?.some((d) =>
        d.provincia?.nombre
          ?.toLowerCase()
          .includes(filters.provincia.toLowerCase())
      )
    )
      return false;

    if (
      filters.localidad &&
      !a.direcciones?.some((d) =>
        d.localidad
          .toLowerCase()
          .includes(filters.localidad.toLowerCase().trim())
      )
    )
      return false;

    if (
      filters.telefono &&
      !a.telefonos?.some((t) => t.numero?.includes(filters.telefono))
    )
      return false;

    if (
      filters.email &&
      !a.emails?.some((e) => e.direccion?.includes(filters.email))
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

export const afiliadosFiltrosMock = {
  '/api/afiliados/provincias': (search = '') =>
    mapOptions(
      provincias.filter((p) => p.toLowerCase().includes(search.toLowerCase()))
    ),
  '/api/afiliados/localidades': (search = '') =>
    mapOptions(
      localidades.filter((l) => l.toLowerCase().includes(search.toLowerCase()))
    ),
};
