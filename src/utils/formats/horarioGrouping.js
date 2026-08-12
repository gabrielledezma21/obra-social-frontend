import { toMinutes } from './dateUtils';

export const buildDuraciones = () =>
  Array.from({ length: 24 }, (_, i) => (i + 1) * 5);

export const isWithin = (start, end, rangeStart, rangeEnd) => {
  const [s, e, rs, re] = [start, end, rangeStart, rangeEnd].map(toMinutes);
  if ([s, e, rs, re].some(Number.isNaN)) return false;
  return s >= rs && e <= re;
};

export const groupHorarios = (rawHorarios, diasConHorarios) => {
  const groups = new Map();

  rawHorarios.forEach((ha) => {
    const key = `${ha.horaInicio}|${ha.horaFin}|${ha.duracion}`;
    if (!groups.has(key)) {
      groups.set(key, {
        id: String(groups.size + 1),
        dias: [],
        horaInicio: ha.horaInicio,
        horaFin: ha.horaFin,
        duracion: Number(ha.duracion),
      });
    }

    const group = groups.get(key);

    diasConHorarios
      .filter((d) => Number(d.diaId) === Number(ha.dia?.id))
      .filter((d) => isWithin(ha.horaInicio, ha.horaFin, d._inicio, d._fin))
      .forEach((opt) => {
        if (!group.dias.some((o) => o.id === opt.id)) {
          group.dias.push(opt);
        }
      });
  });

  return Array.from(groups.values());
};

export const groupHorariosSimple = (horarios = []) => {
  const groups = new Map();

  horarios.forEach((h) => {
    const key = `${h.horaInicio}|${h.horaFin}|${h.duracionTurno}`;
    if (!groups.has(key)) {
      groups.set(key, {
        dias: [],
        horaInicio: h.horaInicio,
        horaFin: h.horaFin,
        duracion: Number(h.duracionTurno),
      });
    }

    const group = groups.get(key);
    const dia = h.dia || h.dia?.nombre;

    if (dia && !group.dias.includes(dia)) {
      group.dias.push(dia);
    }
  });

  return Array.from(groups.values());
};

export const groupHorariosCentros = (horarios = []) => {
  const groups = new Map();

  horarios.forEach((h) => {
    const key = `${h.horaInicio}|${h.horaFin}`;

    if (!groups.has(key)) {
      groups.set(key, {
        id: crypto.randomUUID(),
        dias: [],
        horaInicio: h.horaInicio ?? '',
        horaFin: h.horaFin ?? '',
      });
    }

    const group = groups.get(key);

    if (h.dia?.id && h.dia?.nombre) {
      const exists = group.dias.some((d) => d.id === h.dia.id);
      if (!exists) {
        group.dias.push({ id: h.dia.id, nombre: h.dia.nombre });
      }
    }
  });

  return Array.from(groups.values());
};

export const groupHorariosSimpleDetalle = (horarios = []) => {
  const groups = new Map();

  horarios.forEach((h) => {
    const key = `${h.horaInicio}|${h.horaFin}|${h.duracion}`;

    if (!groups.has(key)) {
      groups.set(key, {
        dias: [],
        horaInicio: h.horaInicio,
        horaFin: h.horaFin,
        duracion: h.duracion,
      });
    }

    const group = groups.get(key);

    if (h.dia?.id && h.dia?.nombre) {
      const exists = group.dias.some((d) => d.id === h.dia.id);
      if (!exists) {
        group.dias.push({ id: h.dia.id, nombre: h.dia.nombre });
      }
    }
  });

  return Array.from(groups.values()).sort((a, b) => {
    const aId = a.dias[0]?.id ?? 999;
    const bId = b.dias[0]?.id ?? 999;
    return aId - bId;
  });
};

export const mergeHorarios = (horarios = []) => {
  if (!Array.isArray(horarios)) return [];

  const normalizados = horarios.map((h) => ({
    id: h.id ?? null,
    dia: h.dia,
    horaInicio: h.horaInicio,
    horaFin: h.horaFin,
    duracion: h.duracion ?? h.duracionTurno ?? null,
  }));

  const ordenados = normalizados.sort((a, b) => {
    const diffDia = (a.dia?.id ?? 999) - (b.dia?.id ?? 999);
    if (diffDia !== 0) return diffDia;
    return a.horaInicio.localeCompare(b.horaInicio);
  });

  const resultado = [];
  let actual = null;

  const toMin = (str) => {
    const [h, m] = (str ?? '').split(':').map(Number);
    return h * 60 + m;
  };

  for (const h of ordenados) {
    if (!actual) {
      actual = { ...h };
      continue;
    }

    const mismoDia = actual.dia?.id === h.dia?.id;

    const finA = toMin(actual.horaFin);
    const inicioB = toMin(h.horaInicio);
    const finB = toMin(h.horaFin);

    const seSolapa = mismoDia && inicioB <= finA;
    const esConsecutivo = mismoDia && inicioB === finA;

    if (seSolapa || esConsecutivo) {
      actual.horaFin = finB > finA ? h.horaFin : actual.horaFin;
    } else {
      resultado.push(actual);
      actual = { ...h };
    }
  }

  if (actual) resultado.push(actual);

  return resultado;
};
