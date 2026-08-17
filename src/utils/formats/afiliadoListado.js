export const formatAfiliadosListado = (data) => {
  try {
    if (!data) {
      return {
        items: [],
        total: 0,
      };
    }
    const afiliadosArray = Array.isArray(data) ? data : data.items || [];

    const itemsFormateados = afiliadosArray.map((afiliado) => {
      const afiliadoNombre =
        `${afiliado.nombre || ''} ${afiliado.apellido || ''}`.trim();

      const documento =
        `${afiliado.tipoDocumento?.tipo || ''} ${afiliado.numeroDocumento || ''}`.trim();

      const planMedico = afiliado.Contrato?.plan?.plan;
      const nAfiliado = afiliado.Contrato?.nAfiliado;
      const numeroIntegrante = Number(afiliado.numeroIntegrante || 1);

      const nAfiliadoFormateado = nAfiliado
        ? nAfiliado.toString().padStart(7, '0')
        : '0000000';

      const nroAfiliadoCompleto = `${nAfiliadoFormateado}-${String(
        numeroIntegrante
      ).padStart(2, '0')}`;

      const direcciones =
        afiliado.domicilios?.map((domicilio) => {
          const dir = domicilio.Direccion;
          if (!dir) return '';
          const calleCompleta = `${dir.calle || ''} ${dir.altura || ''}`.trim();
          return `${calleCompleta}, ${dir.localidad}, ${dir.Provincia?.nombre}`;
        }) || [];

      const emails = afiliado.emails?.map((e) => e.direccion || '');
      const telefonos = afiliado.telefonos?.map((t) => t.numero || '');

      return {
        id: afiliado.id,
        afiliado: afiliadoNombre,
        nroAfiliado: nroAfiliadoCompleto,
        documento,
        planMedico,
        parentesco:
          afiliado.parentesco?.relacion || afiliado.parentesco || 'Titular',
        direcciones,
        telefonos,
        emails,
        url: afiliado.id
          ? `/administracion/afiliados/detalle/${afiliado.id}`
          : null,
      };
    });
    return {
      items: itemsFormateados,
      total: data.total,
    };
  } catch (err) {
    console.error('Error al formatear afiliados:', err);
    return {
      ...data,
      items: data?.items || [],
      error: true,
      errorMessage: err.message,
    };
  }
};
