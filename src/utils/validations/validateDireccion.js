const REGEX_NUMERIC_MIN_2 = /^\d{2,}$/; //mínimo 2 dígitos
const REGEX_ALPHANUMERIC = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\d]{4,}$/; //letras, números. Mínimo 4 caracteres.
const REGEX_CP = /^([A-Za-z]\d{3,4}|\d{4})$/;

// para agenda de turnos
export const validateDireccion = (direccion) => {
  if (!direccion) {
    return { field: 'direccion', message: 'Seleccioná una dirección' };
  }
  return null;
};

/**
 * Valida un solo objeto de dirección (para Centros de Atención o Dirección del Afiliado).
 */
export const validateSingleDireccion = (direccion, id) => {
  const prefijo = id ? `${id}` : '';

  if (!direccion.provincia || !direccion.provincia.id) {
    return {
      field: `${prefijo}provincia`,
      message: 'La provincia es obligatoria.',
    };
  }

  if (!direccion.localidad) {
    return {
      field: `${prefijo}localidad`,
      message: 'La localidad es obligatoria.',
    };
  }
  if (!REGEX_ALPHANUMERIC.test(String(direccion.localidad))) {
    return {
      field: `${prefijo}localidad`,
      message:
        'La localidad no puede contener caracteres especiales (Mín. 4 caracteres).',
    };
  }

  if (!direccion.codigoPostal) {
    return {
      field: `${prefijo}codigoPostal`,
      message: 'El código postal es obligatorio.',
    };
  }
  if (!REGEX_CP.test(String(direccion.codigoPostal))) {
    return {
      field: `${prefijo}codigoPostal`,
      message:
        'El código postal debe ser de 4 dígitos (ej: 1708) o una letra seguida de 3 o 4 dígitos (ej: B123 o B1234).',
    };
  }

  // Calle -> mínimo 3 caracteres alfanuméricos
  if (!direccion.calle) {
    return {
      field: `${prefijo}calle`,
      message: 'La calle es obligatoria.',
    };
  }

  if (!REGEX_ALPHANUMERIC.test(direccion.calle)) {
    return {
      field: `${prefijo}calle`,
      message:
        'La calle no puede contener caracteres espciales (Mín. 4 caracteres).',
    };
  }

  // Altura -> mínimo 2 dígitos

  if (!direccion.altura) {
    return { field: `${prefijo}altura`, message: 'La altura es obligatoria.' };
  }
  if (!REGEX_NUMERIC_MIN_2.test(String(direccion.altura))) {
    return {
      field: `${prefijo}altura`,
      message: 'La altura debe ser numérica (Mín. 2 dígitos).',
    };
  }

  return null;
};

/**
 * Valida un array de direcciones.
 */
export const validateDireccionesArray = (direcciones, fieldPrefix = '') => {
  if (!direcciones || direcciones.length === 0) {
    return {
      field: 'direcciones',
      message: 'Tenés que agregar al menos una dirección.',
    };
  }

  for (const d of direcciones) {
    const error = validateSingleDireccion(
      d,
      `${fieldPrefix}direccion-${d.id}-`
    );
    if (error) return error;
  }
  return null;
};
