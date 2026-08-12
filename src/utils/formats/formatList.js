export const formatList = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  const lastTwo = items.slice(-2).join(' y ');
  return `${items.slice(0, -2).join(', ')}, ${lastTwo}`;
};
