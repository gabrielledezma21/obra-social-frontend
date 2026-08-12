import PropTypes from 'prop-types';
import { Box, Typography, Divider } from '@mui/material';
import LugarAtencionDireccion from './LugarAtencionDireccion';
import LugarAtencionHorarioGroup from './LugarAtencionHorarioGroup';
import EliminarButton from '../../common/forms/EliminarButton';

export default function LugarAtencionItem({
  centro,
  provincias,
  index,
  total,
  onUpdate,
  onDelete,
  validationError,
  errorRefMap,
}) {
  const updateCentro = (nuevo) => onUpdate(nuevo);

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 3,
        mb: 4,
      }}
      ref={(el) => errorRefMap.current.set(`centro-${centro.id}`, el)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight="medium">
          Centro de Atención #{index + 1}
        </Typography>

        {total > 1 && (
          <EliminarButton onEliminar={onDelete} label="Eliminar centro" />
        )}
      </Box>

      <LugarAtencionDireccion
        centro={centro}
        provincias={provincias}
        onChange={updateCentro}
        validationError={validationError}
        errorRefMap={errorRefMap}
      />

      <Divider sx={{ my: 3 }} />

      <LugarAtencionHorarioGroup
        centro={centro}
        onChange={updateCentro}
        validationError={validationError}
        errorRefMap={errorRefMap}
      />
    </Box>
  );
}

LugarAtencionItem.propTypes = {
  centro: PropTypes.object.isRequired,
  provincias: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  validationError: PropTypes.object,
  errorRefMap: PropTypes.object,
};
