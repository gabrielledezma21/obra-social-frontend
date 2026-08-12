import PropTypes from 'prop-types';
import { Box, Divider, Typography } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import AgregarButton from '../common/forms/AgregarButton';
import DireccionSection from '../common/DireccionSection';
import HorarioDeAtencion from './HorarioDeAtencion';
import FadeSlide from '../common/animations/FadeSlide';
import { newHorario, newCentroDeAtencion } from '../../utils/prestadores';
import EliminarButton from '../common/forms/EliminarButton';
import { useFormValidationContext } from '../../context/FormValidationContext';

export default function CentroAtencionSection({ centros, onChange }) {
  const { error } = useFormValidationContext();

  const handleAgregarCentro = () => {
    onChange([...centros, newCentroDeAtencion()]);
  };

  const handleActualizarCentro = (id, nuevo) => {
    onChange(centros.map((c) => (c.id === id ? nuevo : c)));
  };

  const handleEliminarCentro = (id) => {
    onChange(centros.filter((c) => c.id !== id));
  };

  const handleAgregarHorario = (centro) => {
    handleActualizarCentro(centro.id, {
      ...centro,
      horarios: [...centro.horarios, newHorario()],
    });
  };

  const handleActualizarHorario = (centro, horarioId, nuevo) => {
    handleActualizarCentro(centro.id, {
      ...centro,
      horarios: centro.horarios.map((h) => (h.id === horarioId ? nuevo : h)),
    });
  };

  const handleEliminarHorario = (centro, horarioId) => {
    handleActualizarCentro(centro.id, {
      ...centro,
      horarios: centro.horarios.filter((h) => h.id !== horarioId),
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Centros de Atención
      </Typography>

      <AnimatePresence>
        {centros.map((centro, index) => (
          <FadeSlide key={centro.id}>
            <Box
              sx={{
                mb: 0,
                p: 3,
                border: '2px solid #ddd',
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 'bold' }}
                  gutterBottom
                >
                  Centro de Atención #{index + 1}
                </Typography>

                {centros.length > 1 && (
                  <EliminarButton
                    onEliminar={() => handleEliminarCentro(centro.id)}
                    label="Eliminar centro"
                  />
                )}
              </Box>

              <DireccionSection
                direccion={centro}
                onChange={(nuevo) => handleActualizarCentro(centro.id, nuevo)}
                idPrefix={`centro-${centro.id}`}
                error={error}
              />

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: 'bold' }}
              >
                Horarios de Atención
              </Typography>

              {centro.horarios.map((horario, hIndex) => (
                <HorarioDeAtencion
                  key={horario.id}
                  horario={horario}
                  numero={hIndex + 1}
                  puedeEliminar={centro.horarios.length > 1}
                  onChange={(nuevo) =>
                    handleActualizarHorario(centro, horario.id, nuevo)
                  }
                  onEliminar={() => handleEliminarHorario(centro, horario.id)}
                  idPrefix={`horario-${horario.id}`}
                  error={error}
                />
              ))}

              <AgregarButton
                onAgregar={() => handleAgregarHorario(centro)}
                label="Agregar horario"
              />
            </Box>
          </FadeSlide>
        ))}
      </AnimatePresence>
      <Box sx={{ mb: 4 }}>
        <AgregarButton
          onAgregar={handleAgregarCentro}
          label="Agregar centro de atención"
        />
      </Box>
    </Box>
  );
}

CentroAtencionSection.propTypes = {
  centros: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};
