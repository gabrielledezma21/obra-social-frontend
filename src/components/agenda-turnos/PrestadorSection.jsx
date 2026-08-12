import { useLayoutEffect, useRef } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { usePrestador } from '../../context/PrestadorAgendaTurnosContext';
import { useHorarios } from '../../context/HorariosContext';
import ValidatedAutocomplete from '../common/forms/ValidatedAutocomplete';
import { useFormValidationContext } from '../../context/FormValidationContext';

export default function PrestadorSection() {
  const {
    prestador,
    prestadores,
    seleccionarPrestador,
    especialidadSeleccionada,
    setEspecialidadSeleccionada,
    direccionSeleccionada,
    setDireccionSeleccionada,
  } = usePrestador();

  const { resetHorarios } = useHorarios();
  const { clearError, clearErrorsByPrefix } = useFormValidationContext();
  const especialidadRef = useRef(null);

  useLayoutEffect(() => {
    if (prestador?.especialidades?.length > 0) {
      especialidadRef.current?.querySelector('input')?.focus();
    }
  }, [prestador?.especialidades]);

  const handleChange = (setter, clearKey) => (_, newValue) => {
    setter(newValue);
    if (newValue) clearError(clearKey);
  };

  const handleDireccionChange = (_, newValue) => {
    resetHorarios();
    clearErrorsByPrefix('horario-');
    clearError('horarios');
    setDireccionSeleccionada(newValue);
    if (newValue) clearError('direccion');
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
        Datos del prestador
      </Typography>

      <Grid container spacing={3}>
        {/* Prestador */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ValidatedAutocomplete
            value={prestador}
            onChange={handleChange(seleccionarPrestador, 'prestador')}
            options={prestadores}
            getOptionLabel={(option) => option?.nombre || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            label="Prestador"
            placeholder="Seleccioná el prestador"
            dataField="prestador"
          />
        </Grid>

        {/* Especialidad */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ValidatedAutocomplete
            value={especialidadSeleccionada}
            onChange={handleChange(setEspecialidadSeleccionada, 'especialidad')}
            options={prestador?.especialidades || []}
            getOptionLabel={(option) => option?.nombre || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            label="Especialidad"
            placeholder="Seleccioná la especialidad"
            dataField="especialidad"
            disabled={!prestador}
            inputRef={especialidadRef}
          />
        </Grid>

        {/* Dirección */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ValidatedAutocomplete
            value={direccionSeleccionada}
            onChange={handleDireccionChange}
            options={prestador?.centrosDeAtencion || []}
            getOptionLabel={(option) =>
              option?.calle ? `${option.calle} ${option.altura || ''}` : ''
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            label="Dirección"
            placeholder="Seleccioná la dirección"
            dataField="direccion"
            disabled={!prestador}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
