import { Box, Typography, Grid, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useFormValidationContext } from '../../context/FormValidationContext';

export default function DatosPersonalesSection({ prestadorData, onChange }) {
  const { error } = useFormValidationContext();

  const getErrorProps = (fieldName) => {
    const hasError = error?.field === fieldName;
    return {
      error: hasError,
      helperText: hasError ? error.message : '',
    };
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Datos del prestador
      </Typography>

      {/* cuil / cuit */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 5 }}>
          <TextField
            fullWidth
            label="CUIL / CUIT"
            name="cuilCuit"
            placeholder="Ingresá un CUIL/CUIT sin puntos ni guiones"
            value={prestadorData.cuilCuit}
            onChange={onChange}
            data-field="cuilCuit"
            {...getErrorProps('cuilCuit')}
          />
        </Grid>

        {/* nombre */}
        <Grid size={{ xs: 12, sm: 6, md: 7 }}>
          <TextField
            fullWidth
            label="Nombre completo"
            name="nombre"
            placeholder="Ingresá el nombre completo"
            value={prestadorData.nombre}
            onChange={onChange}
            data-field="nombre"
            {...getErrorProps('nombre')}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

DatosPersonalesSection.propTypes = {
  prestadorData: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    cuilCuit: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};
