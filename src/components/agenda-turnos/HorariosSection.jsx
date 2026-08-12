import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Grid, Autocomplete, TextField } from '@mui/material';
import DiasSemanaSelector from '../common/forms/DiasSemanaSelector';
import EliminarButton from '../common/forms/EliminarButton';
import HorarioPickerGroup from '../common/forms/HorarioPickerGroup';
import { usePrestador } from '../../context/PrestadorAgendaTurnosContext';
import FadeSlide from '../common/animations/FadeSlide';
import { useFormValidationContext } from '../../context/FormValidationContext';

export default function HorariosSection({
  horario,
  index,
  puedeEliminar,
  onEliminar,
  onChange,
}) {
  const { direccionSeleccionada } = usePrestador();
  const { error, clearError, clearErrorsByPrefix } = useFormValidationContext();

  const horarios = React.useMemo(
    () => direccionSeleccionada?.horarios || [],
    [direccionSeleccionada]
  );

  const diasConHorarios = React.useMemo(
    () =>
      horarios.map((h, idx) => ({
        id: `${h?.dia?.id ?? idx}-${h?.horaInicio}-${h?.horaFin}`,
        diaId: h?.dia?.id ?? idx,
        nombre: h?.dia?.nombre ?? '',
        label: `${h?.dia?.nombre} (${h?.horaInicio} - ${h?.horaFin})`,
        _inicio: h?.horaInicio ?? '',
        _fin: h?.horaFin ?? '',
      })),
    [horarios]
  );

  const duraciones = React.useMemo(
    () => Array.from({ length: 24 }, (_, i) => (i + 1) * 5),
    []
  );

  const handleFieldChange = React.useCallback(
    (field, value) => {
      onChange(index, field, value);
      if (value) clearError(`horario-${index}-${field}`);
    },
    [index, onChange, clearError]
  );

  const handleEliminar = () => {
    clearErrorsByPrefix(`horario-${index}-`);
    clearError('horarios');

    onEliminar(index);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
        Horarios de atención
      </Typography>

      <FadeSlide>
        {!direccionSeleccionada ? (
          <Typography variant="body1" color="text.secondary">
            Seleccioná una dirección para configurar los horarios de atención.
          </Typography>
        ) : (
          <>
            <Typography variant="subtitle1" fontWeight="medium">
              Días de la semana
            </Typography>

            <DiasSemanaSelector
              dias={diasConHorarios}
              selected={horario.dias}
              onChange={(newDias) => handleFieldChange('dias', newDias)}
              dataField={`horario-${index}-dias`}
              error={error?.field === `horario-${index}-dias`}
              helperText={
                error?.field === `horario-${index}-dias` ? error?.message : ''
              }
            />

            <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 3 }}>
              Especificaciones del turno
            </Typography>

            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Autocomplete
                  options={duraciones}
                  value={horario.duracion}
                  onChange={(_, newValue) =>
                    handleFieldChange('duracion', newValue)
                  }
                  getOptionLabel={(option) => `${option} min`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Duración del turno (minutos)"
                      placeholder="Seleccioná la duración de los turnos"
                      data-field={`horario-${index}-duracion`}
                      error={error?.field === `horario-${index}-duracion`}
                      helperText={
                        error?.field === `horario-${index}-duracion`
                          ? error?.message
                          : ''
                      }
                    />
                  )}
                />
              </Grid>

              <HorarioPickerGroup
                horario={horario}
                onChange={(field, value) => handleFieldChange(field, value)}
                idPrefix={`horario-${index}`}
              />
            </Grid>

            {puedeEliminar && (
              <EliminarButton
                onEliminar={handleEliminar}
                label="Eliminar horario"
              />
            )}
          </>
        )}
      </FadeSlide>
    </Box>
  );
}

HorariosSection.propTypes = {
  horario: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  puedeEliminar: PropTypes.bool,
  onEliminar: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};
