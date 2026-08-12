export const validateCentroMedico = ({
  esCentroMedico,
  integraCentroMedico,
  centroMedicoId,
}) => {
  if (esCentroMedico && integraCentroMedico) {
    return {
      field: 'form',
      message:
        'Un prestador NO puede ser Centro Médico e integrar otro centro a la vez.',
    };
  }

  if (integraCentroMedico && !centroMedicoId) {
    return {
      field: 'centroMedicoId',
      message: 'Seleccioná el centro médico al que integra.',
    };
  }

  return null;
};
