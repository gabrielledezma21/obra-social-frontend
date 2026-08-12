import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Collapse,
  Divider,
} from '@mui/material';
import FechaVigenciaGroup from './FechaVigenciaGroup';
import DireccionAfiliadoSection from './DireccionAfiliadoSection';
import PropTypes from 'prop-types';
import { newDireccion } from '../../utils/afiliados';
import { useEffect } from 'react';

export default function ConfiguracionMiembroSection({
  miembro,
  onMiembroChange,
  idPrefix,
}) {
  const {
    usaMismaVigenciaTitular,
    usaMismaDireccionTitular,
    vigenciaInicio,
    vigenciaFin,
    tieneFechaBaja,
    direcciones,
  } = miembro;

  useEffect(() => {
    if (
      usaMismaVigenciaTitular &&
      (vigenciaInicio !== null || vigenciaFin !== null || tieneFechaBaja)
    ) {
      onMiembroChange('vigenciaInicio', null);
      onMiembroChange('vigenciaFin', null);
      onMiembroChange('tieneFechaBaja', false);
    }

    if (usaMismaDireccionTitular) {
      const primeraDireccion = direcciones[0];
      const tieneDatosDireccion =
        primeraDireccion &&
        (primeraDireccion.calle ||
          primeraDireccion.altura ||
          primeraDireccion.pisoDepto ||
          primeraDireccion.codigoPostal ||
          primeraDireccion.localidad ||
          primeraDireccion.provincia);

      if (tieneDatosDireccion) {
        onMiembroChange('direcciones', [newDireccion()]);
      }
    }
  }, [
    usaMismaVigenciaTitular,
    usaMismaDireccionTitular,
    vigenciaInicio,
    vigenciaFin,
    tieneFechaBaja,
    direcciones,
    onMiembroChange,
  ]);

  const handleSwitchChange = (field, value) => {
    onMiembroChange(field, value);
  };

  const handleDireccionChange = (field, value) => {
    if (field === 'direcciones') {
      onMiembroChange('direcciones', value);
    }
  };

  const handleVigenciaChange = (field, value) => {
    onMiembroChange(field, value);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={usaMismaVigenciaTitular ?? true}
              onChange={(e) =>
                handleSwitchChange('usaMismaVigenciaTitular', e.target.checked)
              }
              name="usaMismaVigenciaTitular"
            />
          }
          label="¿Usa la misma vigencia que el titular?"
        />

        <Collapse in={!usaMismaVigenciaTitular}>
          <Box sx={{ mt: 2, pl: 1 }}>
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
              Vigencia
            </Typography>
            <FechaVigenciaGroup
              data={miembro}
              onDateChange={handleVigenciaChange}
              onSwitchChange={(e) =>
                handleVigenciaChange(e.target.name, e.target.checked)
              }
              idPrefix={idPrefix}
            />
          </Box>
        </Collapse>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={usaMismaDireccionTitular ?? true}
              onChange={(e) =>
                handleSwitchChange('usaMismaDireccionTitular', e.target.checked)
              }
              name="usaMismaDireccionTitular"
            />
          }
          label="¿Usa la misma dirección que el titular?"
        />

        <Collapse in={!usaMismaDireccionTitular}>
          <Box sx={{ mt: 2, pl: 1 }}>
            <DireccionAfiliadoSection
              direcciones={direcciones}
              onChange={handleDireccionChange}
              idPrefix={idPrefix}
            />
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}

ConfiguracionMiembroSection.propTypes = {
  miembro: PropTypes.object.isRequired,
  onMiembroChange: PropTypes.func.isRequired,
  idPrefix: PropTypes.string,
};
