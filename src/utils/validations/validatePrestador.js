export const validatePrestador = (prestador) => {
  if (!prestador) {
    return { field: 'prestador', message: 'Seleccioná un prestador' };
  }
  return null;
};
