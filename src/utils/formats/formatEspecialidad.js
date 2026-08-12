export const formatEspecialidad = (especialidades) => {
  if (!Array.isArray(especialidades) || especialidades.length === 0) {
    return 'Sin especialidad';
  }

  const nombres = especialidades.map((e) => e?.nombre?.trim()).filter(Boolean);

  return nombres.length > 0 ? nombres.join(', ') : 'Sin especialidad';
};
