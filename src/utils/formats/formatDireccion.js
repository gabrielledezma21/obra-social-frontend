export const formatDireccion = (dir) => {
  if (!dir) return '';

  const partes = [];

  if (dir.calle && dir.altura) {
    partes.push(`${dir.calle.trim()} ${String(dir.altura).trim()}`);
  } else if (dir.calle) {
    partes.push(dir.calle.trim());
  } else if (dir.altura) {
    partes.push(String(dir.altura).trim());
  }

  if (dir.pisoDepto && dir.pisoDepto.trim()) {
    partes.push(`Piso/Depto ${dir.pisoDepto.trim()}`);
  }

  let localidadStr = '';
  if (dir.localidad && dir.localidad.trim()) {
    localidadStr = dir.localidad.trim();
  }

  if (dir.codigoPostal && String(dir.codigoPostal).trim()) {
    localidadStr += ` (${String(dir.codigoPostal).trim()})`;
  }

  if (localidadStr) partes.push(localidadStr);

  const provinciaObj = dir.provincia || dir.Provincia;

  if (provinciaObj) {
    const provinciaStr =
      typeof provinciaObj === 'object'
        ? (provinciaObj.nombre ?? '').trim()
        : String(provinciaObj).trim();

    if (provinciaStr) partes.push(provinciaStr);
  }

  return partes.join(', ');
};

export const getDireccionesFormateadas = (direcciones) => {
  if (!Array.isArray(direcciones) || direcciones.length === 0) {
    return 'Sin dirección';
  }

  const direccionesFormateadas = direcciones
    .map((dir) => formatDireccion(dir)?.trim())
    .filter((d) => d && d.length > 0);

  return direccionesFormateadas.length > 0
    ? direccionesFormateadas.join(' | ')
    : 'Sin dirección';
};
