import { Box, Grid, Typography } from '@mui/material';
import ValidatedAutocomplete from '../common/forms/ValidatedAutocomplete';
import PropTypes from 'prop-types';

export default function Cobertura({
  afiliadoData,
  onAutocompleteChange,
  listaPlanesMedicos,
}) {
  return (
    <Box>
      <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
        Cobertura
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ValidatedAutocomplete
            value={afiliadoData.cobertura}
            onChange={(_, newValue) =>
              onAutocompleteChange('cobertura', newValue)
            }
            options={listaPlanesMedicos}
            getOptionLabel={(option) => option?.plan || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            label="Plan médico"
            dataField="cobertura"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

Cobertura.propTypes = {
  afiliadoData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onAutocompleteChange: PropTypes.func.isRequired,
  listaPlanesMedicos: PropTypes.array.isRequired,
};
