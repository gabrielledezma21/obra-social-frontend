import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Collapse,
  Divider,
} from '@mui/material';
import FadeSlide from '../common/animations/FadeSlide';
import { AnimatePresence } from 'framer-motion';
import AgregarButton from '../common/forms/AgregarButton';
import EliminarButton from '../common/forms/EliminarButton';
import ValidatedAutocomplete from '../common/forms/ValidatedAutocomplete';
import DatosPersonales from './DatosPersonales';
import DatosDeContacto from '../common/DatosDeContacto';
import SituacionesTerapeuticasSection from './SituacionesTerapeuticasSection';
import { newMiembroGrupoFamiliar } from '../../utils/afiliados';
import { useEffect, useState } from 'react';
import { getParentescos } from '../../services/parentesco';
import { useFormValidationContext } from '../../context/FormValidationContext';
import { getErrorProps } from '../../utils/formHelper';
import ConfiguracionMiembroSection from './ConfiguracionMiembroSection';

export default function GrupoFamiliarSection({
  afiliadoData,
  onSwitchChange,
  onArrayChange,
  listaTiposDocumento,
  listaSituaciones,
}) {
  const { tieneGrupoFamiliar, grupoFamiliar } = afiliadoData;
  const [listaParentescos, setListaParentescos] = useState([]);

  useEffect(() => {
    const fetchParentescos = async () => {
      const data = await getParentescos();
      setListaParentescos(data);
    };
    fetchParentescos();
  }, []);

  const handleSwitch = (e) => {
    const isChecked = e.target.checked;
    onSwitchChange(e);

    if (isChecked && grupoFamiliar.length === 0) {
      handleAgregarMiembro();
    }

    if (!isChecked) {
      onArrayChange('grupoFamiliar', []);
    }
  };

  const handleAgregarMiembro = () => {
    const nuevoMiembro = newMiembroGrupoFamiliar();
    onArrayChange('grupoFamiliar', [...grupoFamiliar, nuevoMiembro]);
  };

  const handleEliminarMiembro = (id) => {
    const nuevoArray = grupoFamiliar.filter((m) => m.id !== id);
    onArrayChange('grupoFamiliar', nuevoArray);
  };

  const handleActualizarMiembro = (id, field, value) => {
    const nuevoArray = grupoFamiliar.map((m) =>
      m.id === id
        ? {
            ...m,
            [field]: Array.isArray(value) ? [...value] : value,
          }
        : m
    );
    onArrayChange('grupoFamiliar', [...nuevoArray]);
  };

  const { error } = useFormValidationContext();

  return (
    <Box data-section="grupo-familiar">
      <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
        Grupo Familiar
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={tieneGrupoFamiliar}
            onChange={handleSwitch}
            name="tieneGrupoFamiliar"
          />
        }
        label="¿El afiliado presenta al menos un miembro de grupo familiar?"
      />

      <Collapse in={tieneGrupoFamiliar} timeout={400}>
        <AnimatePresence>
          {grupoFamiliar.map((miembro, index) => (
            <FadeSlide key={miembro.id}>
              <Box
                sx={{
                  p: 3,
                  mt: 3,
                  border: '2px solid #ddd',
                  borderRadius: 2,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Miembro de grupo familiar {index + 1}
                  </Typography>
                  {grupoFamiliar.length > 1 && (
                    <EliminarButton
                      onEliminar={() => handleEliminarMiembro(miembro.id)}
                      label="Eliminar miembro"
                    />
                  )}
                </Box>

                <ValidatedAutocomplete
                  value={miembro.parentesco}
                  onChange={(_, newValue) =>
                    handleActualizarMiembro(miembro.id, 'parentesco', newValue)
                  }
                  options={listaParentescos}
                  getOptionLabel={(option) => option?.relacion || ''}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  label="Parentesco"
                  dataField={`grupoFamiliar-${index}-parentesco`}
                  required
                  {...getErrorProps(
                    error,
                    'parentesco',
                    `grupoFamiliar-${index}`
                  )}
                />

                <Divider sx={{ my: 3 }} />

                <DatosPersonales
                  afiliadoData={miembro}
                  onChange={(e) =>
                    handleActualizarMiembro(
                      miembro.id,
                      e.target.name,
                      e.target.value
                    )
                  }
                  onAutocompleteChange={(field, value) =>
                    handleActualizarMiembro(miembro.id, field, value)
                  }
                  listaTiposDocumento={listaTiposDocumento}
                  idPrefix={`grupoFamiliar-${index}-`}
                />

                <Divider sx={{ my: 3 }} />

                <SituacionesTerapeuticasSection
                  afiliadoData={miembro}
                  onSwitchChange={(e) =>
                    handleActualizarMiembro(
                      miembro.id,
                      e.target.name,
                      e.target.checked
                    )
                  }
                  onArrayChange={(field, value) =>
                    handleActualizarMiembro(miembro.id, field, value)
                  }
                  listaSituaciones={listaSituaciones}
                  idPrefix={`grupoFamiliar-${index}-`}
                />

                <Divider sx={{ my: 3 }} />

                <DatosDeContacto
                  contactoData={miembro}
                  handleArray={(field, value) =>
                    handleActualizarMiembro(miembro.id, field, value)
                  }
                  idPrefix={`grupoFamiliar-${index}-`}
                />

                <Divider sx={{ my: 3 }} />

                <ConfiguracionMiembroSection
                  miembro={miembro}
                  onMiembroChange={(field, value) =>
                    handleActualizarMiembro(miembro.id, field, value)
                  }
                  idPrefix={`grupoFamiliar-${index}-`}
                />
              </Box>
            </FadeSlide>
          ))}
        </AnimatePresence>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <AgregarButton
            onAgregar={handleAgregarMiembro}
            label="Agregar otro miembro al grupo familiar"
          />
        </Box>
      </Collapse>
    </Box>
  );
}

GrupoFamiliarSection.propTypes = {
  afiliadoData: PropTypes.object.isRequired,
  onSwitchChange: PropTypes.func.isRequired,
  onArrayChange: PropTypes.func.isRequired,
  listaTiposDocumento: PropTypes.array.isRequired,
  listaSituaciones: PropTypes.array.isRequired,
};
