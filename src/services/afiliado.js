import clienteApi from './api';
import { formatAfiliadosListado as formatearListadoAfiliados } from '../utils/formats/afiliadoListado';
import {
  afiliadoToLegacy as adaptarAfiliadoLegado,
  getId as obtenerId,
  paginate as paginar,
  provinceName as obtenerNombreProvincia,
} from './apiAdapters';
import { filtrarAfiliados } from '../utils/filtrosListados';

const convertirAFecha = (valor) =>
  valor?.format?.('YYYY-MM-DD') ?? valor ?? null;

const obtenerTipoDocumento = (valor) => {
  const tipo = valor?.tipo ?? valor?.id ?? valor ?? 'DNI';
  const equivalencias = { Pasaporte: 'CE', 'Libreta cívica': 'LC' };
  return equivalencias[tipo] ?? tipo;
};

const obtenerParentesco = (valor) => {
  const parentesco = valor?.relacion ?? valor?.id ?? valor ?? 'Titular';
  return parentesco === 'Cónyuge' ? 'Conyuge' : parentesco;
};

const construirDireccion = (direccion = {}) => ({
  calle: direccion.calle,
  altura: Number(direccion.altura),
  pisoDepto: direccion.pisoDepto || null,
  codigoPostal: direccion.codigoPostal,
  localidad: direccion.localidad,
  provincia: obtenerNombreProvincia(
    direccion.provincia ?? direccion.provinciaId
  ),
});

const construirDirecciones = (direcciones = []) =>
  direcciones.filter(Boolean).map(construirDireccion);

const construirDatosAfiliado = (formulario, opciones = {}) => ({
  nombre: formulario.nombre,
  apellido: formulario.apellido,
  fechaNacimiento: convertirAFecha(formulario.fechaNacimiento),
  tipoDocumento: obtenerTipoDocumento(formulario.tipoDocumento),
  dni: Number(formulario.numeroDocumento),
  parentesco: obtenerParentesco(opciones.parentesco ?? formulario.parentesco),
  situacionesTerapeuticas: (formulario.situacionesTerapeuticas ?? [])
    .map((elemento) => obtenerId(elemento.situacion ?? elemento))
    .filter(Boolean),
  emails: formulario.emails ?? [],
  telefonos: formulario.telefonos ?? [],
  direcciones: construirDirecciones(formulario.direcciones),
  plan: String(
    opciones.plan ??
      formulario.cobertura?.plan ??
      formulario.cobertura?.id ??
      ''
  ),
  fechaAlta: convertirAFecha(opciones.fechaAlta ?? formulario.vigenciaInicio),
  afiliadoTitularId: opciones.afiliadoTitularId ?? null,
});

const obtenerListado = async (
  filtros = {},
  pagina = 0,
  limite = 10,
  soloTitulares = false
) => {
  const { data: datos } = await clienteApi.get('/afiliados');
  const afiliadosCrudos = (Array.isArray(datos) ? datos : []).filter(
    (elemento) => !soloTitulares || elemento.parentesco === 'Titular'
  );
  const afiliadosFiltrados = filtrarAfiliados(afiliadosCrudos, filtros).map(
    adaptarAfiliadoLegado
  );

  return formatearListadoAfiliados(paginar(afiliadosFiltrados, pagina, limite));
};

// Esta API pública pertenece al frontend original y se conserva únicamente
// para no romper sus consumidores heredados. Toda la implementación nueva y
// los portales agregados en esta mejora utilizan identificadores en español.
export const createAfiliado = async (datosAfiliado) => {
  const datosTitular = construirDatosAfiliado(datosAfiliado, {
    parentesco: 'Titular',
  });

  if (
    !datosTitular.tipoDocumento ||
    !datosTitular.dni ||
    !datosTitular.nombre ||
    !datosTitular.apellido ||
    !datosTitular.fechaNacimiento ||
    !datosTitular.plan ||
    !datosTitular.fechaAlta ||
    !datosTitular.direcciones.length
  ) {
    throw new Error('Faltan datos obligatorios para crear el afiliado');
  }

  const { data: titular } = await clienteApi.post('/afiliados', datosTitular);
  const titularId = obtenerId(titular);

  await Promise.all(
    (datosAfiliado.grupoFamiliar ?? []).map((familiar) =>
      clienteApi.post(
        '/afiliados',
        construirDatosAfiliado(familiar, {
          afiliadoTitularId: titularId,
          plan: datosTitular.plan,
          fechaAlta: familiar.usaMismaVigenciaTitular
            ? datosTitular.fechaAlta
            : familiar.vigenciaInicio,
        })
      )
    )
  );

  return { ...titular, id: titularId };
};

export const deleteAfiliadoById = async (id, fechaBaja = null) =>
  fechaBaja
    ? clienteApi.put(`/afiliados/${id}`, { fechaBaja })
    : clienteApi.delete(`/afiliados/${id}`);

export const modificarFechaBajaAfiliado = async (
  id,
  fechaBaja,
  aplicarAGrupoFamiliar = false
) =>
  (
    await clienteApi.put(`/afiliados/${id}`, {
      fechaBaja,
      aplicarAGrupoFamiliar,
    })
  ).data;

export const reincorporarAfiliado = async (
  id,
  reincorporarGrupoFamiliar = false
) =>
  (
    await clienteApi.put(`/afiliados/${id}`, {
      fechaBaja: null,
      aplicarAGrupoFamiliar: reincorporarGrupoFamiliar,
    })
  ).data;

export const obtenerAfiliadosListado = async (
  filtros = {},
  pagina = 0,
  limite = 10
) => {
  try {
    return await obtenerListado(filtros, pagina, limite, false);
  } catch (error) {
    console.error('Error al obtener listado de afiliados:', error);
    throw error;
  }
};

export const getTitulares = async (filtros = {}, pagina = 0, limite = 10) => {
  try {
    return await obtenerListado(filtros, pagina, limite, true);
  } catch (error) {
    console.error('Error al obtener listado de titulares:', error);
    throw error;
  }
};

export const getAfiliadoById = async (id) => {
  if (!id) throw new Error('Se requiere un ID de afiliado');
  const { data: datos } = await clienteApi.get(`/afiliados/${id}`);
  return adaptarAfiliadoLegado(datos);
};

export const getReporteAfiliadoById = async () => {
  throw new Error('La API actual todavía no ofrece reportes en PDF.');
};

export const updateAfiliadoDatosPersonales = async (id, datos) =>
  (
    await clienteApi.put(`/afiliados/${id}`, {
      tipoDocumento: obtenerTipoDocumento(datos.tipoDocumentoId),
      dni: Number(datos.numeroDocumento),
      nombre: datos.nombre,
      apellido: datos.apellido,
      fechaNacimiento: convertirAFecha(datos.fechaNacimiento),
      fechaAlta: datos.vigenciaInicio,
      fechaBaja: datos.tieneFechaBaja ? datos.vigenciaFin : null,
    })
  ).data;

export const updateAfiliadoCobertura = async (id, datos) =>
  (await clienteApi.put(`/afiliados/${id}`, { plan: String(datos.planId) }))
    .data;

export const updateAfiliadoDatosContacto = async (id, datos) =>
  (await clienteApi.put(`/afiliados/${id}`, datos)).data;

export const updateAfiliadoDirecciones = async (id, datos) =>
  (
    await clienteApi.put(`/afiliados/${id}`, {
      direcciones: construirDirecciones(datos.direcciones),
    })
  ).data;

export const addDependiente = async (idAfiliado, datosDependiente) => {
  const titular = await getAfiliadoById(idAfiliado);
  return (
    await clienteApi.post(
      '/afiliados',
      construirDatosAfiliado(datosDependiente, {
        afiliadoTitularId: idAfiliado,
        plan: titular.Contrato?.plan?.plan,
        fechaAlta: titular.vigenciaInicio,
      })
    )
  ).data;
};
