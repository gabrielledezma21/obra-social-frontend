import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAfiliado } from '../../../context/AfiliadoContext';

import { newMiembroGrupoFamiliar } from '../../../utils/afiliados';
import { getParentescos } from '../../../services/parentesco';
import { getTiposDocumento } from '../../../services/tipoDocumento';
import { getSituacionesTerapeuticas } from '../../../services/situacionesTerapeuticas';
import { getProvincias } from '../../../services/provincias';

import ValidatedAutocomplete from '../../common/forms/ValidatedAutocomplete';
import DatosPersonales from '../DatosPersonales';
import DatosDeContacto from '../../common/DatosDeContacto';
import SituacionesTerapeuticasSection from '../SituacionesTerapeuticasSection';
import ConfiguracionMiembroSection from '../ConfiguracionMiembroSection';

import { formatNuevoMiembro } from '../../../utils/formats/formatNuevoMiembro';
import { validateNuevoMiembro } from '../../../utils/validations/validateNuevoMiembro';
import { useFormValidationContext } from '../../../context/FormValidationContext';
import PropTypes from 'prop-types';

export default function AgregarMiembroModal({ open, onClose }) {
  const { agregarDependiente, afiliado } = useAfiliado();
  const { setValidationError, clearError } = useFormValidationContext();

  const [miembro, setMiembro] = useState(newMiembroGrupoFamiliar());
  const [listaParentescos, setListaParentescos] = useState([]);
  const [listaTiposDocumento, setListaTiposDocumento] = useState([]);
  const [listaSituaciones, setListaSituaciones] = useState([]);

  useEffect(() => {
    if (!open) return;

    setMiembro(newMiembroGrupoFamiliar());

    const fetch = async () => {
      const [parent, tipos, sit] = await Promise.all([
        getParentescos(),
        getTiposDocumento(),
        getSituacionesTerapeuticas(),
      ]);

      setListaParentescos(parent);
      setListaTiposDocumento(tipos);
      setListaSituaciones(sit);
    };

    fetch();
  }, [open]);

  const updateField = (field, value) => {
    clearError(field);

    setMiembro((prev) => ({
      ...prev,
      [field]: Array.isArray(value) ? [...value] : value,
    }));
  };

  const handleSubmit = async () => {
    const provincias = await getProvincias();

    const validation = validateNuevoMiembro(miembro, afiliado);
    if (validation) {
      setValidationError(validation.field, validation.message);
      return;
    }

    const payload = formatNuevoMiembro(miembro, afiliado, provincias);

    try {
      await agregarDependiente(payload);
      onClose();
    } catch (err) {
      const backendError = err.response?.data;

      if (backendError?.field && backendError?.message) {
        setValidationError(backendError.field, backendError.message);
        return;
      }

      console.error('Error desconocido al agregar nuevo miembro:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Agregar nuevo miembro</DialogTitle>

      <DialogContent dividers>
        <ValidatedAutocomplete
          value={miembro.parentesco}
          onChange={(_, val) => updateField('parentesco', val)}
          options={listaParentescos}
          getOptionLabel={(opt) => opt?.relacion || ''}
          isOptionEqualToValue={(opt, val) => opt.id === val?.id}
          label="Parentesco"
          dataField="parentesco"
          required
        />

        <Divider sx={{ my: 3 }} />

        <DatosPersonales
          afiliadoData={miembro}
          listaTiposDocumento={listaTiposDocumento}
          onChange={(e) => updateField(e.target.name, e.target.value)}
          onAutocompleteChange={(field, val) => updateField(field, val)}
        />

        <Divider sx={{ my: 3 }} />

        <SituacionesTerapeuticasSection
          afiliadoData={miembro}
          listaSituaciones={listaSituaciones}
          onSwitchChange={(e) => updateField(e.target.name, e.target.checked)}
          onArrayChange={(field, value) => updateField(field, value)}
        />

        <Divider sx={{ my: 3 }} />

        <DatosDeContacto
          contactoData={miembro}
          handleArray={(field, value) => updateField(field, value)}
        />

        <Divider sx={{ my: 3 }} />

        <ConfiguracionMiembroSection
          miembro={miembro}
          onMiembroChange={(field, value) => updateField(field, value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AgregarMiembroModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
