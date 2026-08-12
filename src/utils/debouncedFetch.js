import api from '../services/api';

const debounceTimers = new Map();

export const debouncedFetch = (
  baseUrl,
  query,
  setOptions,
  delay = 400,
  formatter,
  extraParams = {}
) => {
  if (debounceTimers.has(baseUrl)) clearTimeout(debounceTimers.get(baseUrl));

  const timer = setTimeout(async () => {
    const trimmed = query.trim();

    try {
      const params =
        trimmed.length === 0
          ? { ...extraParams }
          : { textInputSearch: trimmed, ...extraParams };

      const { data } = await api.get(baseUrl, { params });

      const formatted =
        formatter?.(data) ||
        data.map((item) => ({
          label:
            item.nombreCompleto ||
            item.nombre ||
            item.descripcion ||
            item.label ||
            'Sin nombre',
          value: item.id || item.value,
        }));

      setOptions(formatted);
    } catch (err) {
      console.error(`Error al buscar en ${baseUrl}:`, err);
      setOptions([]);
    }
  }, delay);

  debounceTimers.set(baseUrl, timer);
};
