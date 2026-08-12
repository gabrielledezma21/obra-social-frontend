import { Box, Grid, TextField, Typography } from '@mui/material';
import ValidatedAutocomplete from '../common/forms/ValidatedAutocomplete';
import { useFormValidationContext } from '../../context/FormValidationContext';
import PropTypes from 'prop-types';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { getErrorProps } from '../../utils/formHelper';

export default function DatosPersonales({
  afiliadoData,
  onChange,
  onAutocompleteChange,
  listaTiposDocumento,
  idPrefix,
}) {
  const { error } = useFormValidationContext();

  const dateValue = afiliadoData.fechaNacimiento
    ? typeof afiliadoData.fechaNacimiento === 'string'
      ? dayjs(afiliadoData.fechaNacimiento)
      : afiliadoData.fechaNacimiento
    : null;

  return (
    <Box>
      <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
        Datos Personales
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ValidatedAutocomplete
            value={afiliadoData.tipoDocumento}
            onChange={(_, newValue) =>
              onAutocompleteChange('tipoDocumento', newValue)
            }
            options={listaTiposDocumento}
            getOptionLabel={(option) => option?.tipo || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            label="Tipo Documento"
            dataField={idPrefix ? `${idPrefix}tipoDocumento` : 'tipoDocumento'}
            {...getErrorProps(error, 'tipoDocumento', idPrefix)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            required
            name="numeroDocumento"
            label="Número Documento"
            value={afiliadoData.numeroDocumento}
            onChange={onChange}
            fullWidth
            data-field={
              idPrefix ? `${idPrefix}numeroDocumento` : 'numeroDocumento'
            }
            {...getErrorProps(error, 'numeroDocumento', idPrefix)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <DatePicker
            value={dateValue}
            onChange={(newDate) => {
              onAutocompleteChange('fechaNacimiento', newDate);
            }}
            label="Fecha de Nacimiento"
            name="fechaNacimiento"
            slotProps={{
              textField: {
                required: true,
                fullWidth: true,
                'data-field': idPrefix
                  ? `${idPrefix}fechaNacimiento`
                  : 'fechaNacimiento',
                ...getErrorProps(error, 'fechaNacimiento', idPrefix),
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <TextField
            required
            name="nombre"
            label="Nombre"
            value={afiliadoData.nombre}
            onChange={onChange}
            fullWidth
            data-field={idPrefix ? `${idPrefix}nombre` : 'nombre'}
            {...getErrorProps(error, 'nombre', idPrefix)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <TextField
            required
            name="apellido"
            label="Apellido"
            value={afiliadoData.apellido}
            onChange={onChange}
            fullWidth
            data-field={idPrefix ? `${idPrefix}apellido` : 'apellido'}
            {...getErrorProps(error, 'apellido', idPrefix)}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

DatosPersonales.propTypes = {
  afiliadoData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onAutocompleteChange: PropTypes.func.isRequired,
  listaTiposDocumento: PropTypes.array.isRequired,
  idPrefix: PropTypes.string,
};
