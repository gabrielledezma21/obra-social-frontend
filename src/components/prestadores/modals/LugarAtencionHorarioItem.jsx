import PropTypes from 'prop-types';
import { Box, Grid, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DiasSemanaSelector from '../../common/forms/DiasSemanaSelector';
import { DIAS_SEMANA } from '../../../utils/prestadores';
import dayjs from 'dayjs';
import EliminarButton from '../../common/forms/EliminarButton';
import { useEffect, useState } from 'react';

export default function LugarAtencionHorarioItem({
  horario,
  puedeEliminar,
  onChange,
  onEliminar,
  validationError,
  errorRefMap,
}) {
  const [localDias, setLocalDias] = useState([]);

  useEffect(() => {
    if (Array.isArray(horario.dias)) setLocalDias(horario.dias);
  }, [horario.dias]);

  const update = (field, value) => {
    onChange({ ...horario, [field]: value });
  };

  const baseKey = `horario-${horario.id}-`;

  const isFieldError = (suffix) =>
    validationError?.field === `${baseKey}${suffix}`;

  const isGroupError = validationError?.field === `${baseKey}horario`;

  const registerRef = (suffix) => (el) => {
    if (!el) return;
    errorRefMap?.current.set(`${baseKey}${suffix}`, el);
  };

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 3,
        mb: 3,
      }}
    >
      <Typography variant="body2" fontWeight="medium">
        Días de la semana
      </Typography>
      <DiasSemanaSelector
        dias={DIAS_SEMANA}
        selected={localDias}
        onChange={(v) => {
          setLocalDias(v);
          update('dias', v);
        }}
        multiple
        error={isFieldError('dias')}
        helperText={isFieldError('dias') ? validationError?.message : ''}
        inputRef={registerRef('dias')}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={2} sx={{ my: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MobileTimePicker
              label="Horario inicio"
              ampm={false}
              value={
                horario.horaInicio &&
                dayjs(horario.horaInicio, 'HH:mm').isValid()
                  ? dayjs(horario.horaInicio, 'HH:mm')
                  : null
              }
              onChange={(v) => update('horaInicio', v?.format('HH:mm') || '')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: isFieldError('inicio') || isGroupError,
                  helperText: isFieldError('inicio')
                    ? validationError?.message
                    : '',
                  inputRef: registerRef('inicio'),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <MobileTimePicker
              label="Horario fin"
              ampm={false}
              value={
                horario.horaFin && dayjs(horario.horaFin, 'HH:mm').isValid()
                  ? dayjs(horario.horaFin, 'HH:mm')
                  : null
              }
              onChange={(v) => update('horaFin', v?.format('HH:mm') || '')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: isFieldError('fin') || isGroupError,
                  helperText: isFieldError('fin')
                    ? validationError?.message
                    : '',
                  inputRef: registerRef('fin'),
                },
              }}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>

      {isGroupError && (
        <Typography
          color="error"
          variant="body2"
          sx={{ mt: 1, ml: 0.5 }}
          data-field={`${baseKey}horario`}
          ref={(el) => errorRefMap?.current.set(`${baseKey}horario`, el)}
        >
          {validationError?.message}
        </Typography>
      )}

      {puedeEliminar && (
        <Box sx={{ mt: 1 }}>
          <EliminarButton onEliminar={onEliminar} label="Eliminar horario" />
        </Box>
      )}
    </Box>
  );
}

LugarAtencionHorarioItem.propTypes = {
  horario: PropTypes.object.isRequired,
  centroId: PropTypes.string,
  puedeEliminar: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
  validationError: PropTypes.object,
  errorRefMap: PropTypes.object,
};
