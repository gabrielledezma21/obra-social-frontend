import { Box, Typography, Grid, TextField, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import { useFormValidationContext } from '../../context/FormValidationContext';
import { getErrorProps } from '../../utils/formHelper';

export default function DatosDeContacto({
  contactoData,
  handleArray,
  idPrefix,
}) {
  const { error } = useFormValidationContext();

  const telefonosValues = contactoData.telefonos.map((t) => t.numero || '');
  const emailsValues = contactoData.emails.map((e) => e.direccion || '');

  const handleTelefonosChange = (_, newValues) => {
    const nuevosTelefonos = newValues.map((numero) => ({ numero }));
    handleArray('telefonos', nuevosTelefonos);
  };

  const handleEmailsChange = (_, newValues) => {
    const nuevosEmails = newValues.map((direccion) => ({ direccion }));
    handleArray('emails', nuevosEmails);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Datos de contacto
      </Typography>

      <Grid container spacing={3}>
        {/* telefonos */}
        <Grid size={{ xs: 12, sm: 6, md: 5 }}>
          <Autocomplete
            multiple
            options={[]}
            freeSolo
            value={telefonosValues}
            onChange={handleTelefonosChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Teléfonos"
                placeholder="Ingresá un teléfono y presioná Enter"
                {...getErrorProps(error, 'telefonos', idPrefix)}
                data-field={idPrefix ? `${idPrefix}telefonos` : 'telefonos'}
              />
            )}
          />
        </Grid>

        {/* emails */}
        <Grid size={{ xs: 12, sm: 6, md: 7 }}>
          <Autocomplete
            multiple
            options={[]}
            freeSolo
            value={emailsValues}
            onChange={handleEmailsChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Emails"
                placeholder="Ingresá un email y presioná Enter"
                {...getErrorProps(error, 'emails', idPrefix)}
                data-field={idPrefix ? `${idPrefix}emails` : 'emails'}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

DatosDeContacto.propTypes = {
  contactoData: PropTypes.shape({
    emails: PropTypes.array.isRequired,
    telefonos: PropTypes.array.isRequired,
  }).isRequired,
  handleArray: PropTypes.func.isRequired,
  idPrefix: PropTypes.string,
};
