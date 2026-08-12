export const getTiposDocumento = async () =>
  ['DNI', 'LE', 'LC', 'CI', 'CE'].map((tipo) => ({ id: tipo, tipo }));
