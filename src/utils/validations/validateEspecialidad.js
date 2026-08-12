export const validateEspecialidad = (especialidad) => {
  if (!especialidad) {
    return {
      field: 'especialidad',
      message: 'Seleccioná una especialidad',
    };
  }
  return null;
};
