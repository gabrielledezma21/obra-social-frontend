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
  direcciones: construirDirecciones(
    opciones.direcciones ?? formulario.direcciones
  ),
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

const crearFamiliar = (familiar, titularId, datosTitular, datosAfiliado) =>
  clienteApi.post(
    '/afiliados',
    construirDatosAfiliado(familiar, {
      afiliadoTitularId: titularId,
      plan: datosTitular.plan,
      fechaAlta: familiar.usaMismaVigenciaTitular
        ? datosTitular.fechaAlta
        : familiar.vigenciaInicio,
      direcciones: familiar.usaMismaDireccionTitular
        ? datosAfiliado.direcciones
        : familiar.direcciones,
    })
  );

const revertirAltaIncompleta = async (titularId) => {
  try {
    await clienteApi.delete(`/afiliados/${titularId}`);
  } catch (errorRollback) {
    console.error(
      'No se pudo revertir el alta incompleta del grupo familiar:',
      errorRollback
    );
  }
};

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

  try {
    await Promise.all(
      (datosAfiliado.grupoFamiliar ?? []).map((familiar) =>
        crearFamiliar(familiar, titularId, datosTitular, datosAfiliado)
      )
    );
  } catch (error) {
    await revertirAltaIncompleta(titularId);
    throw error;
  }

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

const completarGrupoFamiliar = async (datos) => {
  if (datos?.parentesco === 'Titular' || !datos?.afiliadoTitularId) {
    return datos;
  }

  const titularId = obtenerId(datos.afiliadoTitularId);
  if (!titularId) return datos;

  try {
    const { data: titular } = await clienteApi.get(`/afiliados/${titularId}`);
    const grupo = [titular, ...(titular.familiares ?? [])].filter(
      (integrante) => String(obtenerId(integrante)) !== String(obtenerId(datos))
    );
    return { ...datos, familiares: grupo };
  } catch {
    return datos;
  }
};

const completarSituacionesTerapeuticas = async (datos) => {
  try {
    const { data: reporte } = await clienteApi.get(
      `/reportes/situaciones/${obtenerId(datos)}`
    );
    const idObjetivo = String(obtenerId(datos));
    const novedades = (reporte?.novedades ?? []).filter(
      (novedad) => String(obtenerId(novedad.afiliadoId)) === idObjetivo
    );

    const porSituacion = new Map(
      (datos.situacionesTerapeuticas ?? []).map((situacion) => [
        String(obtenerId(situacion)),
        { ...situacion },
      ])
    );

    novedades.forEach((novedad) => {
      const situacion = novedad.situacionTerapeuticaId;
      const idSituacion = String(obtenerId(situacion));
      if (!idSituacion) return;
      const actual = porSituacion.get(idSituacion) ?? situacion ?? {};
      porSituacion.set(idSituacion, {
        ...actual,
        fechaInicio: novedad.fechaInicio ?? actual.fechaInicio ?? null,
        fechaFin: novedad.fechaFin ?? actual.fechaFin ?? null,
        activa: novedad.activa ?? actual.activa ?? true,
      });
    });

    return {
      ...datos,
      situacionesTerapeuticas: [...porSituacion.values()],
    };
  } catch {
    return datos;
  }
};

export const getAfiliadoById = async (id) => {
  if (!id) throw new Error('Se requiere un ID de afiliado');
  const { data } = await clienteApi.get(`/afiliados/${id}`);
  const conGrupo = await completarGrupoFamiliar(data);
  const completo = await completarSituacionesTerapeuticas(conGrupo);
  return adaptarAfiliadoLegado(completo);
};

export const getReporteAfiliadoById = async (id) => {
  if (!id) throw new Error('Se requiere un ID de afiliado');
  const { data } = await clienteApi.get(`/reportes/afiliados/${id}/pdf`, {
    responseType: 'blob',
  });
  return data;
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
