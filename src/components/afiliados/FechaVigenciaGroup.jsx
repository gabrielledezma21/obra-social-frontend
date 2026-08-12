import PropTypes from 'prop-types';
import { Box, Grid, FormControlLabel, Switch } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormValidationContext } from '../../context/FormValidationContext';
import { getErrorProps } from '../../utils/formHelper';

const DEFAULT_LABEL_DESDE = 'Vigencia desde';
const DEFAULT_LABEL_HASTA = 'Vigencia hasta';
const DEFAULT_LABEL_SWITCH = 'Registrar fecha baja';

export default function FechaVigenciaGroup({
  data,
  onDateChange,
  onSwitchChange,
  dateDesdeField,
  switchFinField,
  dateHastaField,
  labelDesde,
  labelHasta,
  labelSwitch,
  idPrefix,
  disabledFields = [],
}) {
  const safeData = data || {};

  const FIELD_DESDE = dateDesdeField || 'vigenciaInicio';
  const FIELD_SWITCH = switchFinField || 'tieneFechaBaja';
  const FIELD_HASTA = dateHastaField || 'vigenciaFin';

  const currentLabelDesde = labelDesde || DEFAULT_LABEL_DESDE;
  const currentLabelHasta = labelHasta || DEFAULT_LABEL_HASTA;
  const currentLabelSwitch = labelSwitch || DEFAULT_LABEL_SWITCH;

  const { error } = useFormValidationContext();

  const isFieldDisabled = (fieldName) => disabledFields.includes(fieldName);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DatePicker
            label={currentLabelDesde}
            value={safeData[FIELD_DESDE]}
            onChange={(newValue) => onDateChange(FIELD_DESDE, newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                ...getErrorProps(error, `${FIELD_DESDE}`, idPrefix),
                inputProps: {
                  'data-field': idPrefix
                    ? `${idPrefix}${FIELD_DESDE}`
                    : FIELD_DESDE,
                },
              },
            }}
            disabled={isFieldDisabled(FIELD_DESDE)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControlLabel
            control={
              <Switch
                checked={safeData[FIELD_SWITCH]}
                onChange={onSwitchChange}
                name={FIELD_SWITCH}
                disabled={isFieldDisabled(FIELD_SWITCH)}
              />
            }
            label={currentLabelSwitch}
          />
        </Grid>
        {safeData[FIELD_SWITCH] && (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DatePicker
              label={currentLabelHasta}
              value={safeData[FIELD_HASTA]}
              onChange={(newValue) => onDateChange(FIELD_HASTA, newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  ...getErrorProps(error, `${FIELD_HASTA}`, idPrefix),
                  inputProps: {
                    'data-field': idPrefix
                      ? `${idPrefix}${FIELD_HASTA}`
                      : FIELD_HASTA,
                  },
                },
              }}
              disabled={isFieldDisabled(FIELD_HASTA)}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

FechaVigenciaGroup.propTypes = {
  data: PropTypes.object.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onSwitchChange: PropTypes.func.isRequired,
  dateDesdeField: PropTypes.string,
  switchFinField: PropTypes.string,
  dateHastaField: PropTypes.string,
  labelDesde: PropTypes.string,
  labelHasta: PropTypes.string,
  labelSwitch: PropTypes.string,
  idPrefix: PropTypes.string,
  disabledFields: PropTypes.arrayOf(PropTypes.string),
};

FechaVigenciaGroup.defaultProps = { disabledFields: [] };
