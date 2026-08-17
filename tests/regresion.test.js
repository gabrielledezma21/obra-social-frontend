import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  afiliadoToLegacy as adaptarAfiliadoLegado,
  agendaToLegacy as adaptarAgendaLegado,
  filterByText as filtrarPorTexto,
  getId as obtenerId,
  paginate as paginar,
  prestadorToLegacy as adaptarPrestadorLegado,
  rowsToSchedule as convertirFilasAHorario,
  scheduleToRows as convertirHorarioAFilas,
} from '../src/services/apiAdapters.js';

const directorioActual = path.dirname(fileURLToPath(import.meta.url));
const raizProyecto = path.resolve(directorioActual, '..');

const leerFuente = (rutaRelativa) =>
  readFile(path.join(raizProyecto, rutaRelativa), 'utf8');

test('adaptador de afiliado conserva integrante, contrato y parentesco', () => {
  const afiliado = adaptarAfiliadoLegado({
    _id: 'afiliado-3',
    nombre: 'Bart',
    apellido: 'Simpson',
    tipoDocumento: 'DNI',
    dni: 10000003,
    numeroAfiliado: 1000,
    numeroIntegrante: 3,
    parentesco: 'Hijo',
    plan: '210',
    emails: [{ direccion: 'bart@demo.com' }],
    telefonos: [{ numero: '1111111111' }],
    direccionId: {
      _id: 'direccion-1',
      calle: 'Siempre Viva',
      altura: 742,
      localidad: 'Springfield',
      codigoPostal: '1000',
      provincia: 'Buenos Aires',
    },
  });

  assert.equal(afiliado.id, 'afiliado-3');
  assert.equal(afiliado.numeroIntegrante, 3);
  assert.equal(afiliado.numeroDocumento, '10000003');
  assert.equal(afiliado.parentesco.relacion, 'Hijo');
  assert.equal(afiliado.Contrato.nAfiliado, 1000);
  assert.equal(afiliado.Contrato.plan.plan, '210');
  assert.equal(afiliado.domicilios[0].Direccion.calle, 'Siempre Viva');
});

test('adaptadores de prestador y agenda conservan relaciones principales', () => {
  const prestador = adaptarPrestadorLegado({
    _id: 'prestador-1',
    nombre: 'Dr. Demo',
    especialidades: [{ _id: 'esp-1', nombre: 'Cardiologia' }],
    centrosDeAtencion: [
      {
        _id: 'centro-1',
        direccionId: {
          _id: 'direccion-1',
          calle: 'Mitre',
          altura: 100,
          localidad: 'Moron',
          provincia: 'Buenos Aires',
        },
        horarioId: {
          _id: 'horario-1',
          duracionTurno: 30,
          dias: {
            Lunes: {
              atiende: true,
              bloques: [{ horaInicio: 540, horaFin: 720 }],
            },
          },
        },
      },
    ],
  });

  assert.equal(prestador.id, 'prestador-1');
  assert.equal(prestador.Especialidad[0].id, 'esp-1');
  assert.equal(prestador.centrosDeAtencion[0].id, 'centro-1');
  assert.equal(prestador.centrosDeAtencion[0].localidad, 'Moron');
  assert.equal(prestador.centrosDeAtencion[0].horarios[0].horaInicio, '09:00');

  const agenda = adaptarAgendaLegado({
    _id: 'agenda-1',
    prestadorId: {
      _id: 'prestador-1',
      nombre: 'Dr. Demo',
      especialidades: [{ _id: 'esp-1', nombre: 'Cardiologia' }],
    },
    especialidadId: { _id: 'esp-1', nombre: 'Cardiologia' },
    centroDeAtencionId: {
      _id: 'centro-1',
      direccionId: {
        _id: 'direccion-1',
        calle: 'Mitre',
        altura: 100,
        localidad: 'Moron',
        provincia: 'Buenos Aires',
      },
    },
    horario: {
      duracionTurno: 30,
      dias: {
        Lunes: {
          atiende: true,
          bloques: [{ horaInicio: 540, horaFin: 720 }],
        },
      },
    },
  });

  assert.equal(agenda.id, 'agenda-1');
  assert.equal(agenda.prestador.id, 'prestador-1');
  assert.equal(agenda.especialidad.id, 'esp-1');
  assert.equal(agenda.direccion.localidad, 'Moron');
  assert.equal(agenda.horariosAtencion[0].horaFin, '12:00');
});

test('conversión de horarios mantiene días, horas y duración', () => {
  const filas = [
    {
      dia: 'Miércoles',
      horaInicio: '09:30',
      horaFin: '12:00',
      duracion: 30,
    },
    {
      dia: 'Viernes',
      horaInicio: '14:00',
      horaFin: '17:00',
      duracion: 30,
    },
  ];

  const horario = convertirFilasAHorario(filas);
  assert.equal(horario.dias.Miercoles.atiende, true);
  assert.equal(horario.dias.Miercoles.bloques[0].horaInicio, '09:30');
  assert.equal(horario.dias.Viernes.atiende, true);
  assert.equal(horario.duracionTurno, 30);

  const filasRecuperadas = convertirHorarioAFilas(horario);
  assert.ok(filasRecuperadas.some((fila) => fila.dia === 'Miércoles'));
  assert.ok(filasRecuperadas.some((fila) => fila.dia === 'Viernes'));
});

test('paginación y búsqueda funcionan sobre datos adaptados', () => {
  const elementos = [
    { nombre: 'Ana Lopez', dni: '11111111' },
    { nombre: 'Bruno Perez', dni: '22222222' },
    { nombre: 'Carla Gomez', dni: '33333333' },
  ];

  const filtrados = filtrarPorTexto(
    elementos,
    { textInputSearch: 'perez' },
    [(elemento) => elemento.nombre, (elemento) => elemento.dni]
  );
  assert.equal(filtrados.length, 1);
  assert.equal(filtrados[0].nombre, 'Bruno Perez');

  const pagina = paginar(elementos, 1, 2);
  assert.equal(pagina.total, 3);
  assert.equal(pagina.page, 2);
  assert.equal(pagina.items.length, 1);
  assert.equal(pagina.items[0].nombre, 'Carla Gomez');

  assert.equal(obtenerId({ _id: 'mongo-id' }), 'mongo-id');
  assert.equal(obtenerId({ id: 'legacy-id' }), 'legacy-id');
});

test('las rutas administrativas de listados, detalles y altas no regresan a URLs antiguas', async () => {
  const [
    afiliados,
    prestadores,
    agendas,
    encabezadoListado,
    aplicacion,
  ] = await Promise.all([
    leerFuente('src/utils/formats/afiliadoListado.js'),
    leerFuente('src/utils/formats/prestadoresListado.js'),
    leerFuente('src/utils/formats/agendaTurnosListado.js'),
    leerFuente('src/components/common/lists/PageListHeader.jsx'),
    leerFuente('src/App.jsx'),
  ]);

  assert.match(afiliados, /\/administracion\/afiliados\/detalle\//);
  assert.match(afiliados, /numeroIntegrante/);
  assert.match(afiliados, /parentesco/);
  assert.match(prestadores, /\/administracion\/prestadores\/detalle\//);
  assert.match(agendas, /\/administracion\/agenda-turnos\/detalle\//);

  assert.match(encabezadoListado, /\/administracion\/afiliados\/alta/);
  assert.match(encabezadoListado, /\/administracion\/prestadores\/alta/);
  assert.match(encabezadoListado, /\/administracion\/agenda-turnos\/alta/);

  assert.match(aplicacion, /path="\/administracion"/);
  assert.match(aplicacion, /path="prestadores"/);
  assert.match(aplicacion, /path="agenda-turnos"/);
  assert.match(aplicacion, /path="afiliados"/);
});
