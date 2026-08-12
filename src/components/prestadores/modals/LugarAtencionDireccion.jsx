import PropTypes from 'prop-types';
import { Grid, TextField } from '@mui/material';

export default function LugarAtencionDireccion({
  centro,
  provincias,
  onChange,
  validationError,
  errorRefMap,
}) {
  const base = `centro-${centro.id}-`;

  const updateField = (field, value) => {
    onChange({
      ...centro,
      direccion: {
        ...centro.direccion,
        [field]: value,
      },
    });
  };

  const isErr = (k) => validationError?.field === base + k;
  const register = (k) => (el) => el && errorRefMap?.current.set(base + k, el);

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          SelectProps={{ native: true }}
          label="Provincia"
          fullWidth
          inputRef={register('provincia')}
          error={isErr('provincia')}
          helperText={isErr('provincia') ? validationError.message : ''}
          value={centro.direccion.provincia?.id || ''}
          onChange={(e) => {
            const selected =
              provincias.find((p) => p.id === Number(e.target.value)) || null;
            updateField('provincia', selected);
          }}
        >
          <option value=""></option>
          {provincias.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Localidad"
          fullWidth
          inputRef={register('localidad')}
          error={isErr('localidad')}
          helperText={isErr('localidad') ? validationError.message : ''}
          value={centro.direccion.localidad}
          onChange={(e) => updateField('localidad', e.target.value)}
        />
      </Grid>

      <Grid size={{ xs: 6, sm: 3 }}>
        <TextField
          label="Código Postal"
          fullWidth
          inputRef={register('codigoPostal')}
          error={isErr('codigoPostal')}
          helperText={isErr('codigoPostal') ? validationError.message : ''}
          value={centro.direccion.codigoPostal}
          onChange={(e) => updateField('codigoPostal', e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <TextField
          label="Calle"
          fullWidth
          inputRef={register('calle')}
          error={isErr('calle')}
          helperText={isErr('calle') ? validationError.message : ''}
          value={centro.direccion.calle}
          onChange={(e) => updateField('calle', e.target.value)}
        />
      </Grid>

      <Grid size={{ xs: 6, sm: 3 }}>
        <TextField
          label="Altura"
          fullWidth
          inputRef={register('altura')}
          error={isErr('altura')}
          helperText={isErr('altura') ? validationError.message : ''}
          value={centro.direccion.altura}
          onChange={(e) => updateField('altura', e.target.value)}
        />
      </Grid>

      <Grid size={{ xs: 6, sm: 3 }}>
        <TextField
          label="Piso/Depto"
          fullWidth
          value={centro.direccion.pisoDepto}
          onChange={(e) => updateField('pisoDepto', e.target.value)}
        />
      </Grid>
    </Grid>
  );
}

LugarAtencionDireccion.propTypes = {
  centro: PropTypes.object.isRequired,
  provincias: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  validationError: PropTypes.object,
  errorRefMap: PropTypes.object,
};
