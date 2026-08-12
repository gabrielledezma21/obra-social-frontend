import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import AgregarButton from '../../common/forms/AgregarButton';
import LugarAtencionHorarioItem from './LugarAtencionHorarioItem';

export default function LugarAtencionHorarioGroup({
  centro,
  onChange,
  validationError,
  errorRefMap,
}) {
  const updateHorario = (id, nuevoHorario) => {
    onChange({
      ...centro,
      horarios: centro.horarios.map((h) => (h.id === id ? nuevoHorario : h)),
    });
  };

  const addHorario = () => {
    onChange({
      ...centro,
      horarios: [
        ...centro.horarios,
        {
          id: crypto.randomUUID(),
          dias: [],
          horaInicio: '',
          horaFin: '',
          duracion: null,
        },
      ],
    });
  };

  const deleteHorario = (id) => {
    if (centro.horarios.length === 1) return;
    onChange({
      ...centro,
      horarios: centro.horarios.filter((h) => h.id !== id),
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
        Horarios de Atención
      </Typography>

      {centro.horarios.map((h) => (
        <LugarAtencionHorarioItem
          key={h.id}
          horario={h}
          centroId={centro.id}
          puedeEliminar={centro.horarios.length > 1}
          onChange={(nuevo) => updateHorario(h.id, nuevo)}
          onEliminar={() => deleteHorario(h.id)}
          validationError={validationError}
          errorRefMap={errorRefMap}
        />
      ))}

      <AgregarButton
        onAgregar={() => addHorario(centro)}
        label="Agregar horario"
      />
    </Box>
  );
}

LugarAtencionHorarioGroup.propTypes = {
  centro: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  validationError: PropTypes.object,
  errorRefMap: PropTypes.object,
};
