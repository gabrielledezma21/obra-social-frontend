import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LugarAtencionHorarioItem from './LugarAtencionHorarioItem';

export default function LugarAtencionHorarios({ centro, onChange }) {
  const addHorario = () => {
    onChange({
      ...centro,
      horarios: [
        ...centro.horarios,
        { id: crypto.randomUUID(), dias: [], horaInicio: '', horaFin: '' },
      ],
    });
  };

  const updateHorario = (id, nuevo) => {
    onChange({
      ...centro,
      horarios: centro.horarios.map((h) => (h.id === id ? nuevo : h)),
    });
  };

  const deleteHorario = (id) => {
    onChange({
      ...centro,
      horarios: centro.horarios.filter((h) => h.id !== id),
    });
  };

  return (
    <Box>
      {centro.horarios.map((h) => (
        <LugarAtencionHorarioItem
          key={h.id}
          horario={h}
          puedeEliminar={centro.horarios.length > 1}
          onChange={(nuevo) => updateHorario(h.id, nuevo)}
          onEliminar={() => deleteHorario(h.id)}
        />
      ))}

      <Button
        size="small"
        startIcon={<AddCircleOutlineIcon />}
        onClick={addHorario}
      >
        Agregar horario
      </Button>
    </Box>
  );
}

LugarAtencionHorarios.propTypes = {
  centro: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
