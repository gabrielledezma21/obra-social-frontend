import api from './api';
import { getId, normalizeAddress } from './apiAdapters';
import { formatDireccion } from '../utils/formats/formatDireccion';

let dashboardRequest = null;

const ORDEN_PLANES_PRINCIPALES = ['210', '310', '410', '510'];

const loadDashboardData = () => {
  if (!dashboardRequest) {
    dashboardRequest = Promise.all([
      api.get('/afiliados'),
      api.get('/prestadores'),
      api.get('/agendas'),
      api.get('/especialidades'),
    ])
      .then(([afiliados, prestadores, agendas, especialidades]) => ({
        afiliados: Array.isArray(afiliados.data) ? afiliados.data : [],
        prestadores: Array.isArray(prestadores.data) ? prestadores.data : [],
        agendas: Array.isArray(agendas.data) ? agendas.data : [],
        especialidades: Array.isArray(especialidades.data)
          ? especialidades.data
          : [],
      }))
      .finally(() => {
        window.setTimeout(() => {
          dashboardRequest = null;
        }, 5000);
      });
  }
  return dashboardRequest;
};

const compararPorCantidadDescendente = (primero, segundo) => {
  const diferenciaCantidad = segundo.cantidad - primero.cantidad;
  if (diferenciaCantidad !== 0) return diferenciaCantidad;
  return String(primero.nombre || '').localeCompare(
    String(segundo.nombre || ''),
    'es'
  );
};

const groupCount = (values, fallback) =>
  Object.entries(
    values.reduce((result, value) => {
      const key = value || fallback;
      result[key] = (result[key] ?? 0) + 1;
      return result;
    }, {})
  )
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort(compararPorCantidadDescendente);

const ordenarPlanes = (planes) => {
  const planesPrincipales = ORDEN_PLANES_PRINCIPALES.filter((plan) =>
    planes.includes(plan)
  );
  const planesAdicionales = planes
    .filter((plan) => !ORDEN_PLANES_PRINCIPALES.includes(plan))
    .sort((primero, segundo) =>
      primero.localeCompare(segundo, 'es', { numeric: true })
    );

  return [...planesPrincipales, ...planesAdicionales];
};

export const getAfiliadosTotales = async () =>
  (await loadDashboardData()).afiliados.length;

export const getPrestadoresTotales = async () =>
  (await loadDashboardData()).prestadores.length;

export const getAgendasTotales = async () =>
  (await loadDashboardData()).agendas.length;

export const getCantidadEspecialidades = async () =>
  (await loadDashboardData()).especialidades.length;

export const getPrestadoresPorLocalidad = async () => {
  const { prestadores } = await loadDashboardData();
  const locations = prestadores.flatMap((provider) =>
    (provider.centrosDeAtencion ?? []).map((center) => {
      const address = normalizeAddress(center);
      return `${address.localidad || 'Sin localidad'}|${address.provincia || ''}`;
    })
  );
  return groupCount(locations, 'Sin localidad|').map(({ nombre, cantidad }) => {
    const [localidad, provincia] = nombre.split('|');
    return { localidad, provincia, cantidad };
  });
};

export const getPrestadoresPorEspecialidad = async () => {
  const { prestadores } = await loadDashboardData();
  return groupCount(
    prestadores.flatMap((provider) =>
      (provider.especialidades ?? []).map((specialty) => specialty.nombre)
    ),
    'Sin especialidad'
  );
};

export const getAfiliadosConBaja = async () => {
  const { afiliados } = await loadDashboardData();
  return afiliados
    .filter((member) => member.fechaBaja)
    .map((member) => ({
      id: getId(member),
      nombre: `${member.nombre ?? ''} ${member.apellido ?? ''}`.trim(),
      fecha: new Date(member.fechaBaja).toLocaleDateString('es-AR'),
    }));
};

export const getPrestadoresSinAgenda = async () => {
  const { prestadores, agendas } = await loadDashboardData();
  const providerIds = new Set(
    agendas.map((agenda) => getId(agenda.prestadorId))
  );
  return prestadores
    .filter((provider) => !providerIds.has(getId(provider)))
    .map((provider) => ({
      id: getId(provider),
      nombre: provider.nombre ?? 'Sin nombre',
      especialidades:
        (provider.especialidades ?? []).map((item) => item.nombre).join(', ') ||
        'Sin datos',
      direcciones:
        (provider.centrosDeAtencion ?? [])
          .map((center) => formatDireccion(normalizeAddress(center)))
          .filter(Boolean)
          .join(' | ') || 'Sin dirección',
    }));
};

export const getPlanesMedicosPorMes = async () => {
  const { afiliados } = await loadDashboardData();
  const planesDisponibles = new Set(ORDEN_PLANES_PRINCIPALES);

  const grouped = afiliados.reduce((result, member) => {
    if (!member.fechaAlta) return result;

    const date = new Date(member.fechaAlta);
    if (Number.isNaN(date.getTime())) return result;

    const claveMes = `${date.getUTCFullYear()}-${String(
      date.getUTCMonth() + 1
    ).padStart(2, '0')}`;
    const mes = new Intl.DateTimeFormat('es-AR', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
    const plan = member.plan ?? 'Sin plan';

    planesDisponibles.add(plan);
    result[claveMes] ??= {
      mes,
      orden: Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
      planes: {},
    };
    result[claveMes].planes[plan] = (result[claveMes].planes[plan] ?? 0) + 1;
    return result;
  }, {});

  const planes = ordenarPlanes([...planesDisponibles]);

  return Object.values(grouped)
    .sort((primero, segundo) => primero.orden - segundo.orden)
    .map(({ mes, planes: cantidades }) => ({
      mes,
      planes: Object.fromEntries(
        planes.map((plan) => [plan, cantidades[plan] ?? 0])
      ),
    }));
};
