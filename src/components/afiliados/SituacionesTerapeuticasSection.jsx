import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Collapse,
} from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import AgregarButton from '../common/forms/AgregarButton';
import SituacionTerapeuticaItem from './SituacionTerapeuticaItem';
import { newSituacionTerapeutica } from '../../utils/afiliados';
import { useEffect } from 'react';
import { useCallback } from 'react';

export default function SituacionesTerapeuticasSection({
  afiliadoData,
  onSwitchChange,
  onArrayChange,
  listaSituaciones,
  idPrefix,
}) {
  const { tieneSituacionTerapeutica, situacionesTerapeuticas } = afiliadoData;

  const handleSwitchPrincipalChange = (event) => {
    onSwitchChange(event);
  };

  const handleAgregarSituacion = useCallback(() => {
    const nuevaSituacion = newSituacionTerapeutica();
    onArrayChange('situacionesTerapeuticas', [
      ...situacionesTerapeuticas,
      nuevaSituacion,
    ]);
  }, [situacionesTerapeuticas, onArrayChange]);

  useEffect(() => {
    if (!tieneSituacionTerapeutica && situacionesTerapeuticas.length > 0) {
      onArrayChange('situacionesTerapeuticas', []);
    }

    if (tieneSituacionTerapeutica && situacionesTerapeuticas.length === 0) {
      handleAgregarSituacion();
    }
  }, [
    tieneSituacionTerapeutica,
    situacionesTerapeuticas.length,
    onArrayChange,
    handleAgregarSituacion,
  ]);

  const handleEliminarSituacion = (id) => {
    const nuevoArray = situacionesTerapeuticas.filter((s) => s.id !== id);
    onArrayChange('situacionesTerapeuticas', nuevoArray);
  };

  const handleActualizarSituacion = (id, nuevoObjeto) => {
    const nuevoArray = situacionesTerapeuticas.map((s) =>
      s.id === id ? nuevoObjeto : s
    );
    onArrayChange('situacionesTerapeuticas', nuevoArray);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
        Situaciones Terapéuticas
      </Typography>

      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={tieneSituacionTerapeutica}
              onChange={handleSwitchPrincipalChange}
              name="tieneSituacionTerapeutica"
            />
          }
          label="¿El afiliado presenta al menos una situación terapeútica?"
        />
      </Box>

      <Collapse in={tieneSituacionTerapeutica} timeout={400}>
        <Box>
          <AnimatePresence>
            {tieneSituacionTerapeutica &&
              situacionesTerapeuticas.map((situacion, index) => (
                <SituacionTerapeuticaItem
                  key={situacion.id}
                  situacion={situacion}
                  numero={index + 1}
                  puedeEliminar={situacionesTerapeuticas.length > 1}
                  listaSituaciones={listaSituaciones}
                  onChange={(nuevo) =>
                    handleActualizarSituacion(situacion.id, nuevo)
                  }
                  onEliminar={() => handleEliminarSituacion(situacion.id)}
                  idPrefix={idPrefix}
                  index={index}
                />
              ))}
          </AnimatePresence>

          <AgregarButton
            onAgregar={handleAgregarSituacion}
            label="Agregar otra situación terapeútica"
          />
        </Box>
      </Collapse>
    </Box>
  );
}

SituacionesTerapeuticasSection.propTypes = {
  afiliadoData: PropTypes.object.isRequired,
  onSwitchChange: PropTypes.func.isRequired,
  onArrayChange: PropTypes.func.isRequired,
  listaSituaciones: PropTypes.array.isRequired,
  idPrefix: PropTypes.string,
};
