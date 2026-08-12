import PropTypes from 'prop-types';
import { Box, Typography, Grid } from '@mui/material';
import FadeSlide from '../common/animations/FadeSlide';
import EliminarButton from '../common/forms/EliminarButton';
import ValidatedAutocomplete from '../common/forms/ValidatedAutocomplete';
import FechaVigenciaGroup from './FechaVigenciaGroup';
import { getErrorProps } from '../../utils/formHelper';
import { useFormValidationContext } from '../../context/FormValidationContext';

export default function SituacionTerapeuticaItem({
  situacion,
  numero,
  puedeEliminar,
  onChange,
  onEliminar,
  listaSituaciones,
  idPrefix,
  index,
}) {
  const { error } = useFormValidationContext();

  const getFieldName = (field) => {
    if (idPrefix) {
      return `${idPrefix}situacionesTerapeuticas-${index}-${field}`;
    } else {
      return `situacionesTerapeuticas-${index}-${field}`;
    }
  };

  const handleFieldChange = (field, value) => {
    let situacionActualizada = { ...situacion, [field]: value };

    if (field === 'finaliza' && value === false) {
      situacionActualizada = { ...situacionActualizada, fechaFin: null };
    }

    onChange(situacionActualizada);
  };

  const handleAutocompleteChange = (_, newValue) => {
    handleFieldChange('situacion', newValue);
  };

  const handleDateChange = (field, newValue) => {
    handleFieldChange(field, newValue);
  };

  const handleSwitchChange = (event) => {
    handleFieldChange('finaliza', event.target.checked);
  };

  return (
    <FadeSlide>
      <Box sx={{ p: 3, border: '2px solid #ddd', borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Situación Terapéutica #{numero}
          </Typography>
          {puedeEliminar && (
            <EliminarButton
              onEliminar={onEliminar}
              label="Eliminar situación"
            />
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 7 }}>
            <ValidatedAutocomplete
              value={situacion.situacion}
              onChange={handleAutocompleteChange}
              options={listaSituaciones}
              getOptionLabel={(option) => option?.nombre || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              label="Situación Terapéutica"
              dataField={getFieldName('situacion')}
              required
              {...getErrorProps(error, getFieldName('situacion'))}
              inputProps={{
                'data-field': getFieldName('situacion'),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FechaVigenciaGroup
              data={situacion}
              onDateChange={handleDateChange}
              onSwitchChange={handleSwitchChange}
              dateDesdeField="fechaInicio"
              switchFinField="finaliza"
              dateHastaField="fechaFin"
              labelDesde="Desde"
              labelHasta="Hasta"
              labelSwitch="Registrar fecha de finalización"
              idPrefix={
                idPrefix
                  ? `${idPrefix}situacionesTerapeuticas-${index}-`
                  : `situacionesTerapeuticas-${index}-`
              }
            />
          </Grid>
        </Grid>
      </Box>
    </FadeSlide>
  );
}

SituacionTerapeuticaItem.propTypes = {
  situacion: PropTypes.object.isRequired,
  numero: PropTypes.number.isRequired,
  puedeEliminar: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
  listaSituaciones: PropTypes.array.isRequired,
  idPrefix: PropTypes.string,
  index: PropTypes.number.isRequired,
};
