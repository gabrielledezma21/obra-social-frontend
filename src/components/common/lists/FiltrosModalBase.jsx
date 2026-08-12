import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  Autocomplete,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import ErrorSnackbar from '../ErrorSnackbar';
import { debouncedFetch } from '../../../utils/debouncedFetch';

export default function FiltrosModalBase({
  open,
  onClose,
  fields,
  validateFn,
  chipValues = {},
}) {
  const [values, setValues] = useState({});
  const [error, setError] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [optionsMap, setOptionsMap] = useState({});
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    fields?.forEach((field) => {
      if (field.asyncSearchUrl && !optionsMap[field.name]) {
        handleAsyncSearch(field, '');
      }
    });
  }, [fields, optionsMap]);

  useEffect(() => {
    if (open || Object.keys(values).length === 0) {
      setValues(chipValues);
    }
  }, [open, chipValues]);

  const isFieldError = (name) => error?.field === name;
  const getHelperText = (name) => (isFieldError(name) ? error.message : '');

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleClear = (name) => {
    handleChange(name, null);
  };

  const handleBuscar = () => {
    if (validateFn) {
      const validation = validateFn(values);
      if (validation) {
        setError(validation);
        if (!validation.field) setToastOpen(true);
        return;
      }
    }
    onClose(values);
  };

  const handleBorrar = () => {
    setValues({});
    setError(null);
    onClose({ __clearFilters: true });
  };

  const handleCerrar = () => {
    onClose(null);
  };

  const handleAsyncSearch = (field, inputValue) => {
    if (!field.asyncSearchUrl) return;
    debouncedFetch(
      field.asyncSearchUrl,
      inputValue,
      (opts) =>
        setOptionsMap((prev) => ({
          ...prev,
          [field.name]: opts,
        })),
      field.debounceDelay || 400,
      field.formatter
    );
  };

  const handleCheckBoxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCerrar}
        maxWidth="md"
        PaperProps={{
          component: Paper,
          elevation: 2,
          sx: { borderRadius: 3, p: 3, width: '100%', maxWidth: 750 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          Filtros de búsqueda
        </DialogTitle>

        <DialogContent>
          <Grid rowSpacing={4} columnSpacing={2} container>
            {fields?.map((field) => (
              <Grid key={field.name} size={{ xs: 12, sm: 6 }}>
                {field.type === 'date' || field.type === 'time' ? (
                  <TextField
                    fullWidth
                    label={field.label}
                    size="medium"
                    type={field.type}
                    value={values[field.name] ?? ''}
                    onChange={(e) =>
                      handleChange(
                        field.name,
                        e.target.value === '' ? null : e.target.value
                      )
                    }
                    error={isFieldError(field.name)}
                    helperText={getHelperText(field.name)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment:
                        values[field.name] !== undefined &&
                        values[field.name] !== null &&
                        values[field.name] !== '' ? (
                          <InputAdornment position="end">
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                onClick={() => handleClear(field.name)}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ) : null,
                    }}
                  />
                ) : field.type === 'select' ? (
                  <Autocomplete
                    fullWidth
                    size="medium"
                    options={
                      field.asyncSearchUrl
                        ? optionsMap[field.name] || []
                        : field.options || []
                    }
                    getOptionLabel={(opt) =>
                      typeof opt === 'string' ? opt : opt.label
                    }
                    value={values[field.name] ?? null}
                    isOptionEqualToValue={(opt, val) =>
                      opt?.value === val?.value
                    }
                    onInputChange={(_, inputValue) =>
                      field.asyncSearchUrl &&
                      handleAsyncSearch(field, inputValue)
                    }
                    onChange={(_, newValue) =>
                      handleChange(field.name, newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={field.label}
                        variant="outlined"
                        error={isFieldError(field.name)}
                        helperText={getHelperText(field.name)}
                      />
                    )}
                  />
                ) : field.type === 'checkbox' ? (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isChecked}
                          onChange={handleCheckBoxChange}
                          color="primary"
                        />
                      }
                      label={field.label}
                    />
                  </FormGroup>
                ) : (
                  <TextField
                    fullWidth
                    label={field.label}
                    size="medium"
                    value={values[field.name] ?? ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    error={isFieldError(field.name)}
                    helperText={getHelperText(field.name)}
                    InputProps={{
                      endAdornment: values[field.name] ? (
                        <InputAdornment position="end">
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              onClick={() => handleClear(field.name)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                )}
              </Grid>
            ))}
          </Grid>

          <Box
            mt={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              color="error"
              sx={{ textTransform: 'none' }}
              onClick={handleBorrar}
            >
              Borrar filtros
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: 'none' }}
              onClick={handleBuscar}
            >
              Buscar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <ErrorSnackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        message={error?.message || 'Error de validación.'}
      />
    </>
  );
}

FiltrosModalBase.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fields: PropTypes.array,
  validateFn: PropTypes.func,
  chipValues: PropTypes.object,
};
