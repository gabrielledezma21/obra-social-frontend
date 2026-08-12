import api from './api';
import { formatAfiliadosListado } from '../utils/formats/afiliadoListado';
import {
  afiliadoToLegacy,
  filterByText,
  getId,
  paginate,
  provinceName,
} from './apiAdapters';

const toDate = (value) => value?.format?.('YYYY-MM-DD') ?? value ?? null;

const documentValue = (value) => {
  const type = value?.tipo ?? value?.id ?? value ?? 'DNI';
  const aliases = { Pasaporte: 'CE', 'Libreta cívica': 'LC' };
  return aliases[type] ?? type;
};

const relationshipValue = (value) => {
  const relationship = value?.relacion ?? value?.id ?? value ?? 'Titular';
  return relationship === 'Cónyuge' ? 'Conyuge' : relationship;
};

const addressPayload = (addresses = []) => {
  const address = addresses[0] ?? {};
  return {
    calle: address.calle,
    altura: Number(address.altura),
    pisoDepto: address.pisoDepto || null,
    codigoPostal: address.codigoPostal,
    localidad: address.localidad,
    provincia: provinceName(address.provincia ?? address.provinciaId),
  };
};

const createPayload = (form, options = {}) => ({
  nombre: form.nombre,
  apellido: form.apellido,
  tipoDocumento: documentValue(form.tipoDocumento),
  dni: Number(form.numeroDocumento),
  parentesco: relationshipValue(options.parentesco ?? form.parentesco),
  situacionesTerapeuticas: (form.situacionesTerapeuticas ?? [])
    .map((item) => getId(item.situacion ?? item))
    .filter(Boolean),
  emails: form.emails ?? [],
  telefonos: form.telefonos ?? [],
  direccion: addressPayload(form.direcciones),
  plan: String(
    options.plan ?? form.cobertura?.plan ?? form.cobertura?.id ?? ''
  ),
  fechaAlta: toDate(options.fechaAlta ?? form.vigenciaInicio),
  afiliadoTitularId: options.afiliadoTitularId ?? null,
});

export const createAfiliado = async (afiliadoData) => {
  const titularPayload = createPayload(afiliadoData, { parentesco: 'Titular' });
  if (
    !titularPayload.tipoDocumento ||
    !titularPayload.dni ||
    !titularPayload.nombre ||
    !titularPayload.apellido ||
    !titularPayload.plan ||
    !titularPayload.fechaAlta
  ) {
    throw new Error('Faltan datos obligatorios para crear el afiliado');
  }

  const { data: titular } = await api.post('/afiliados', titularPayload);
  const titularId = getId(titular);

  await Promise.all(
    (afiliadoData.grupoFamiliar ?? []).map((relative) =>
      api.post(
        '/afiliados',
        createPayload(relative, {
          afiliadoTitularId: titularId,
          plan: titularPayload.plan,
          fechaAlta: relative.usaMismaVigenciaTitular
            ? titularPayload.fechaAlta
            : relative.vigenciaInicio,
        })
      )
    )
  );

  return { ...titular, id: titularId };
};

export const deleteAfiliadoById = async (id, fechaBaja = null) => {
  if (fechaBaja) return api.put(`/afiliados/${id}`, { fechaBaja });
  return api.delete(`/afiliados/${id}`);
};

export const modificarFechaBajaAfiliado = async (id, fechaBaja) => {
  const { data } = await api.put(`/afiliados/${id}`, { fechaBaja });
  return data;
};

export const reincorporarAfiliado = async (id) => {
  const { data } = await api.put(`/afiliados/${id}`, { fechaBaja: null });
  return data;
};

export const getTitulares = async (filters = {}, page = 0, limit = 10) => {
  try {
    const { data } = await api.get('/afiliados');
    const legacy = (Array.isArray(data) ? data : [])
      .filter((item) => item.parentesco === 'Titular')
      .map(afiliadoToLegacy);
    const filtered = filterByText(legacy, filters, [
      (item) => `${item.nombre} ${item.apellido}`,
      (item) => item.numeroDocumento,
      (item) => item.Contrato?.nAfiliado,
    ]);
    return formatAfiliadosListado(paginate(filtered, page, limit));
  } catch (err) {
    console.error('Error al obtener listado de afiliados:', err);
    throw err;
  }
};

export const getAfiliadoById = async (id) => {
  if (!id) throw new Error('Se requiere un ID de afiliado');
  const { data } = await api.get(`/afiliados/${id}`);
  return afiliadoToLegacy(data);
};

export const getReporteAfiliadoById = async () => {
  throw new Error('La API actual todavía no ofrece reportes en PDF.');
};

export const updateAfiliadoDatosPersonales = async (id, payload) => {
  const { data } = await api.put(`/afiliados/${id}`, {
    tipoDocumento: documentValue(payload.tipoDocumentoId),
    dni: Number(payload.numeroDocumento),
    nombre: payload.nombre,
    apellido: payload.apellido,
    fechaAlta: payload.vigenciaInicio,
    fechaBaja: payload.tieneFechaBaja ? payload.vigenciaFin : null,
  });
  return data;
};

export const updateAfiliadoCobertura = async (id, payload) => {
  const { data } = await api.put(`/afiliados/${id}`, {
    plan: String(payload.planId),
  });
  return data;
};

export const updateAfiliadoDatosContacto = async (id, payload) => {
  const { data } = await api.put(`/afiliados/${id}`, payload);
  return data;
};

export const updateAfiliadoDirecciones = async (id, payload) => {
  const { data } = await api.put(`/afiliados/${id}`, {
    direccion: addressPayload(payload.direcciones),
  });
  return data;
};

export const addDependiente = async (idAfiliado, dependienteData) => {
  const titular = await getAfiliadoById(idAfiliado);
  const { data } = await api.post(
    '/afiliados',
    createPayload(dependienteData, {
      afiliadoTitularId: idAfiliado,
      plan: titular.Contrato?.plan?.plan,
      fechaAlta: titular.vigenciaInicio,
    })
  );
  return data;
};
