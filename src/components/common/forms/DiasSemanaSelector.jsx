import {
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from '@mui/material';
import PropTypes from 'prop-types';

export default function DiasSemanaSelector({
  dias,
  selected = [],
  onChange,
  error,
  helperText,
  dataField,
}) {
  const handleToggle = (dia) => {
    const isSelected = selected.some((d) => d.id === dia.id);

    const newValue = isSelected
      ? selected.filter((d) => d.id !== dia.id)
      : [...selected, dia];

    onChange(newValue);
  };

  const hasError = Boolean(error);
  const helper = hasError ? (helperText ?? '') : '';

  return (
    <FormGroup sx={{ mb: 1, width: '100%', mt: 1 }}>
      <Grid container spacing={2} sx={{ mt: 1 }} data-field={dataField}>
        {dias.map((dia) => (
          <Grid sx={{ xs: 6, sm: 3, md: 2 }} key={dia.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selected.some((d) => d.id === dia.id)}
                  onChange={() => handleToggle(dia)}
                />
              }
              label={dia.label}
            />
          </Grid>
        ))}
      </Grid>
      {hasError && <FormHelperText error>{helper}</FormHelperText>}
    </FormGroup>
  );
}

DiasSemanaSelector.propTypes = {
  dias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selected: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  dataField: PropTypes.string,
};
