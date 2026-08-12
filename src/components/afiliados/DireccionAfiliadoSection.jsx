import { Box, Typography } from '@mui/material';
import DireccionSection from '../common/DireccionSection';
import PropTypes from 'prop-types';
import FadeSlide from '../common/animations/FadeSlide';
import { AnimatePresence } from 'framer-motion';
import AgregarButton from '../common/forms/AgregarButton';
import { newDireccion } from '../../utils/afiliados';
import EliminarButton from '../common/forms/EliminarButton';

export default function DireccionAfiliadoSection({
  direcciones,
  onChange,
  idPrefix = '',
}) {
  const handleAgregarDireccion = () => {
    onChange('direcciones', [...direcciones, newDireccion()]);
  };

  const handleActualizarDireccion = (id, nuevoObjeto) => {
    const nuevoArray = direcciones.map((d) => (d.id === id ? nuevoObjeto : d));
    onChange('direcciones', nuevoArray);
  };

  const handleEliminarDireccion = (id) => {
    const nuevoArray = direcciones.filter((d) => d.id !== id);
    onChange('direcciones', nuevoArray);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
        Dirección
      </Typography>

      <AnimatePresence>
        {direcciones.map((direccion, index) => (
          <FadeSlide key={direccion.id}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{ mb: 2 }}
              >
                Dirección {index + 1}
              </Typography>

              {direcciones.length > 1 && (
                <EliminarButton
                  onEliminar={() => handleEliminarDireccion(direccion.id)}
                  label="Eliminar dirección"
                />
              )}
            </Box>
            <Box sx={{ mb: 5 }}>
              <DireccionSection
                direccion={direccion}
                onChange={(nuevo) =>
                  handleActualizarDireccion(direccion.id, nuevo)
                }
                idPrefix={`${idPrefix}direccion-${direccion.id}-`}
              />
            </Box>
          </FadeSlide>
        ))}
      </AnimatePresence>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <AgregarButton
          onAgregar={handleAgregarDireccion}
          label="Agregar otra dirección"
        />
      </Box>
    </Box>
  );
}

DireccionAfiliadoSection.propTypes = {
  direcciones: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  idPrefix: PropTypes.string,
};
