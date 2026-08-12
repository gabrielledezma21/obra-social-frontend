import { Box, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import DiasSemanaSelector from '../common/forms/DiasSemanaSelector';
import HorarioPickerGroup from '../common/forms/HorarioPickerGroup';
import EliminarButton from '../common/forms/EliminarButton';
import { DIAS_SEMANA } from '../../utils/prestadores';
import { useFormValidationContext } from '../../context/FormValidationContext';

export default function HorarioSection({
  horario,
  puedeEliminar,
  onChange,
  onEliminar,
}) {
  const { error } = useFormValidationContext();
  const idPrefix = `horario-${horario.id}`;

  const isError = (suffix) => error?.field === `${idPrefix}-${suffix}`;
  const getHelper = (suffix) => (isError(suffix) ? error?.message : '');

  const handleFieldChange = (field, value) => {
    onChange({ ...horario, [field]: value });
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, mb: 3 }}>
      <Grid container spacing={3} gap={2}>
        <Grid size={{ xs: 12, sm: 6, md: 12 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Días de la semana
          </Typography>
          <DiasSemanaSelector
            dias={DIAS_SEMANA}
            selected={horario.dias}
            onChange={(newDias) => handleFieldChange('dias', newDias)}
            dataField={`${idPrefix}-dias`}
            error={isError('dias')}
            helperText={getHelper('dias')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 12 }}>
          <HorarioPickerGroup
            horario={horario}
            onChange={handleFieldChange}
            idPrefix={idPrefix}
          />
        </Grid>

        {puedeEliminar && (
          <Grid size={{ xs: 12, sm: 6, md: 12 }}>
            <EliminarButton onEliminar={onEliminar} label="Eliminar horario" />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

HorarioSection.propTypes = {
  horario: PropTypes.object.isRequired,
  puedeEliminar: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
};
