import { useMemo } from 'react';

export const usePrestadoresPorEspecialidadData = (data = []) => {
  return useMemo(() => {
    if (!data.length) return { chartData: [], fullData: [], total: 0 };

    const total = data.reduce((acc, item) => acc + item.cantidad, 0);

    const top5 = data.slice(0, 5);
    const otrosCount = data
      .slice(5)
      .reduce((acc, item) => acc + item.cantidad, 0);

    const combined = [...top5];
    if (otrosCount > 0) {
      combined.push({ nombre: 'Otros', cantidad: otrosCount });
    }

    const chartData = combined.map((item, index) => ({
      id: index,
      label: item.nombre,
      cantidad: item.cantidad,
    }));

    const fullData = data.map((item, index) => ({
      id: index,
      label: item.nombre,
      cantidad: item.cantidad,
    }));

    return { chartData, fullData, total };
  }, [data]);
};
