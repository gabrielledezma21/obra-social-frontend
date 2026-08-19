export const leerCredencialesTurnoDesdeUbicacion = (
  ubicacion = window.location
) => {
  const parametros = new URLSearchParams(ubicacion.search || '');
  const fragmento = new URLSearchParams(
    String(ubicacion.hash || '').replace(/^#/, '')
  );

  return {
    codigoReserva: String(parametros.get('codigo') || '')
      .trim()
      .toUpperCase(),
    tokenGestion: String(fragmento.get('token') || '').trim(),
    accion: String(fragmento.get('accion') || 'ver')
      .trim()
      .toLowerCase(),
  };
};

export const limpiarFragmentoSensible = () => {
  if (!window.location.hash) return;

  const urlLimpia = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(window.history.state, '', urlLimpia);
};
