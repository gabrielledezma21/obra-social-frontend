import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  Switch,
  TextField,
  Autocomplete,
  Typography,
  Collapse,
} from '@mui/material';

export default function CentroMedicoSectionForModal({
  isCentroMedico,
  integraCentroMedico,
  centroMedicoId,
  listaCentrosMedicos = [],
  onSwitchChange,
  onCentroMedicoChange,
  error,
  helperText,
  disabled = false,
  useFullWidth = false,
}) {
  const centrosOptions = Array.isArray(listaCentrosMedicos)
    ? listaCentrosMedicos
    : [];

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body1" fontWeight="600">
          Es Centro Médico
        </Typography>
        <Switch
          checked={isCentroMedico}
          onChange={onSwitchChange('esCentroMedico')}
          disabled={disabled}
        />
      </Stack>

      {!isCentroMedico && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body1" fontWeight="600">
            Integra Centro Médico
          </Typography>
          <Switch
            checked={integraCentroMedico}
            onChange={onSwitchChange('integraCentroMedico')}
            disabled={disabled}
          />
        </Stack>
      )}

      {integraCentroMedico && !isCentroMedico && (
        <Collapse
          in={integraCentroMedico}
          orientation="horizontal"
          sx={{
            width: useFullWidth ? '100%' : 'auto',
            '& .MuiCollapse-wrapper': {
              width: '100%',
              paddingLeft: '0 !important',
            },
            '& .MuiCollapse-wrapperInner': {
              width: '100%',
              paddingLeft: '0 !important',
            },
          }}
        >
          <Autocomplete
            sx={{
              width: useFullWidth ? '100% !important' : 300,
              flexGrow: useFullWidth ? 1 : 0,
              minWidth: useFullWidth ? '100% !important' : 'auto',
            }}
            disabled={disabled}
            options={centrosOptions}
            value={centrosOptions.find((c) => c.id === centroMedicoId) || null}
            onChange={(_, newValue) =>
              onCentroMedicoChange(newValue?.id ?? null)
            }
            getOptionLabel={(opt) => opt?.nombre || opt?.centro || ''}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Centro Médico que integra"
                placeholder="Seleccioná el centro médico"
                error={error}
                helperText={helperText}
              />
            )}
          />
        </Collapse>
      )}
    </Box>
  );
}

CentroMedicoSectionForModal.propTypes = {
  isCentroMedico: PropTypes.bool.isRequired,
  integraCentroMedico: PropTypes.bool.isRequired,
  centroMedicoId: PropTypes.number,
  listaCentrosMedicos: PropTypes.array.isRequired,
  onSwitchChange: PropTypes.func.isRequired,
  onCentroMedicoChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  useFullWidth: PropTypes.bool,
};
