import clienteApi from './api';
import { formatAfiliadosListado: formatearListadoAfiliados } from '../utils/formats/afiliadoListado';
import {
  afiliadoToLegacy: adaptarAfiliadoLegado,
  filterByText: filtrarPorTexto,
  getId: obtenerId,
  paginate: paginar,
  provinceName: obtenerNombreProvincia,
} from './apiAdapters';

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
  fechaAlta: convertirAFecha(
    opciones.fechaAlta ?? formulario.vigenciaInicio
  ),
  afiliadoTitularId: opciones.afiliadoTitularId ?? null,
});

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

export const modificarFechaBajaAfiliado = async (id, fechaBaja) =>
  (await clienteApi.put(`/afiliados/${id}`, { fechaBaja })).data;

export const reincorporarAfiliado = async (id) =>
  (await clienteApi.put(`/afiliados/${id}`, { fechaBaja: null })).data;

export const getTitulares = async (filtros = {}, pagina = 0, limite = 10) => {
  try {
    const { data: datos } = await clienteApi.get('/afiliados');
    const afiliadosLegados = (Array.isArray(datos) ? datos : [])
      .filter((elemento) => elemento.parentesco === 'Titular')
      .map(adaptarAfiliadoLegado);
    const afiliadosFiltrados = filtrarPorTexto(
      afiliadosLegados,
      filtros,
      [
        (elemento) => `${elemento.nombre} ${elemento.apellido}`,
        (elemento) => elemento.numeroDocumento,
        (elemento) =>
          elemento.credencial ?? elemento.Contrato?.nAfiliado,
      ]
    );

    return formatearListadoAfiliados(
      paginar(afiliadosFiltrados, pagina, limite)
    );
  } catch (error) {
    console.error('Error al obtener listado de afiliados:', error);
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
