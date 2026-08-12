export const formatDias = (dias = []) => {
  if (!Array.isArray(dias) || dias.length === 0) return '';
  if (dias.length === 1) return dias[0];
  if (dias.length === 2) return `${dias[0]} y ${dias[1]}`;
  const ultimosDos = dias.slice(-2).join(' y ');
  return `${dias.slice(0, -2).join(', ')}, ${ultimosDos}`;
};
