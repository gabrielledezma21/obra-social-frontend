import { useMemo } from 'react';

/**
 * Hook que prepara los datos para el componente PrestadoresPorLocalidad.
 * Calcula los porcentajes, el total general y agrupa las localidades restantes como "Otros".
 *
 * @param {Array} prestadoresPorLocalidad - Lista de objetos con { localidad, provincia, cantidad }
 * @returns {Object} { chartData, fullData, total }
 */
export const usePrestadoresPorLocalidadData = (prestadoresPorLocalidad) => {
  return useMemo(() => {
    if (!prestadoresPorLocalidad?.length)
      return { chartData: [], fullData: [], total: 0 };

    const total = prestadoresPorLocalidad.reduce(
      (acc, item) => acc + item.cantidad,
      0
    );

    const top3 = prestadoresPorLocalidad.slice(0, 3);
    const otrosCount = prestadoresPorLocalidad
      .slice(3)
      .reduce((acc, item) => acc + item.cantidad, 0);

    const combined = [...top3];
    if (otrosCount > 0) {
      combined.push({
        localidad: 'Otros',
        provincia: '',
        cantidad: otrosCount,
      });
    }

    const chartData = combined.map((item, index) => ({
      id: index,
      value: ((item.cantidad / total) * 100).toFixed(1),
      cantidad: item.cantidad,
      label:
        item.localidad === 'Otros'
          ? 'Otros'
          : `${item.localidad}${item.provincia ? `, ${item.provincia}` : ''}`,
    }));

    const fullData = prestadoresPorLocalidad.map((item, index) => ({
      id: index,
      value: ((item.cantidad / total) * 100).toFixed(1),
      label: `${item.localidad}${item.provincia ? `, ${item.provincia}` : ''}`,
    }));

    return { chartData, fullData, total };
  }, [prestadoresPorLocalidad]);
};
