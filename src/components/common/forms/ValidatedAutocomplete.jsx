import { Autocomplete, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useFormValidationContext } from '../../../context/FormValidationContext';

export default function ValidatedAutocomplete({
  value,
  onChange,
  options,
  getOptionLabel,
  isOptionEqualToValue,
  label,
  dataField,
  disabled = false,
  inputRef,
  placeholder,
}) {
  const { error } = useFormValidationContext();
  const hasError = error?.field === dataField;
  const helperText = hasError ? error.message : '';

  return (
    <Autocomplete
      fullWidth
      disabled={disabled}
      value={value}
      onChange={onChange}
      options={options || []}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder} // ← agregado
          data-field={dataField}
          error={hasError}
          helperText={helperText}
          inputRef={inputRef}
        />
      )}
    />
  );
}

ValidatedAutocomplete.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  getOptionLabel: PropTypes.func.isRequired,
  isOptionEqualToValue: PropTypes.func,
  label: PropTypes.string.isRequired,
  dataField: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  inputRef: PropTypes.object,
  placeholder: PropTypes.string,
};
