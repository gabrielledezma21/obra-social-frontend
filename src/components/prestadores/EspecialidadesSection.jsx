import PropTypes from 'prop-types';
import { Box, Typography, Grid, TextField, Autocomplete } from '@mui/material';

import CentroMedicoSection from './CentroMedicoSection';
import { useFormValidationContext } from '../../context/FormValidationContext';
import { getErrorProps } from '../../utils/formHelper';

export default function EspecialidadesSection({
  especialidades,
  onChange,
  listaEspecialidades,
  listaCentrosMedicos,
  isCentroMedico,
  integraCentroMedico,
  centroMedicoId,
  onSwitchChange,
  onCentroMedicoChange,
}) {
  const { error } = useFormValidationContext();

  return (
    <>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
          Especialidades
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              multiple
              data-field="especialidades"
              value={especialidades}
              onChange={(_, val) => onChange('especialidades', val)}
              options={listaEspecialidades}
              getOptionLabel={(o) => o?.nombre || ''}
              isOptionEqualToValue={(o, v) => o.id === v.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Especialidades"
                  placeholder="Seleccioná o ingresá una o más especialidades"
                  fullWidth
                  {...getErrorProps(error, 'especialidades')}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <CentroMedicoSection
          isCentroMedico={isCentroMedico}
          integraCentroMedico={integraCentroMedico}
          centroMedicoId={centroMedicoId}
          listaCentrosMedicos={listaCentrosMedicos}
          onSwitchChange={onSwitchChange}
          onCentroMedicoChange={onCentroMedicoChange}
        />
      </Box>
    </>
  );
}

EspecialidadesSection.propTypes = {
  especialidades: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  listaEspecialidades: PropTypes.array.isRequired,
  listaCentrosMedicos: PropTypes.array.isRequired,
  isCentroMedico: PropTypes.bool.isRequired,
  integraCentroMedico: PropTypes.bool.isRequired,
  centroMedicoId: PropTypes.number,
  onSwitchChange: PropTypes.func.isRequired,
  onCentroMedicoChange: PropTypes.func.isRequired,
};
