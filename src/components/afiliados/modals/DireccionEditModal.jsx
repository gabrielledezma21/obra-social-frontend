import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ButtonsSection from '../../common/forms/FormActions';
import { getProvincias } from '../../../services/provincias';
import { useAfiliado } from '../../../context/AfiliadoContext';
import { validateDireccionesArray } from '../../../utils/validations/validateDireccion';
import { newDireccion } from '../../../utils/afiliados';
import DireccionAfiliadoSection from '../DireccionAfiliadoSection';
import {
  FormValidationProvider,
  useFormValidationContext,
} from '../../../context/FormValidationContext';

const DireccionEditContent = ({
  direcciones,
  setDirecciones,
  afiliado,
  modalLoading,
  onClose,
  updateDirecciones,
}) => {
  const { setValidationError, clearErrors } = useFormValidationContext();

  const handleDireccionesChange = (field, nuevasDirecciones) => {
    setDirecciones(nuevasDirecciones);
    clearErrors();
  };

  const handleGuardar = async () => {
    clearErrors();

    const validation = validateDireccionesArray(direcciones);

    if (validation) {
      setValidationError(validation.field, validation.message);
      return;
    }

    await updateDirecciones(direcciones);
    onClose();
  };

  return (
    <>
      <DialogContent dividers>
        {modalLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DireccionAfiliadoSection
            direcciones={direcciones}
            onChange={handleDireccionesChange}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <ButtonsSection
          handleGuardar={handleGuardar}
          onConfirmCancel={onClose}
          cancelTitle={`¿Cancelar la edición de direcciones de ${afiliado.nombre}?`}
          cancelMessage="Si cancelás ahora, se perderán los cambios realizados."
          confirmText="Guardar cambios"
          cancelText="Cancelar"
        />
      </DialogActions>
    </>
  );
};

export default function DireccionEditModal({ open, onClose }) {
  const { afiliado, updateDirecciones } = useAfiliado();
  const [direcciones, setDirecciones] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (!open || !afiliado) return;

    const loadData = async () => {
      setModalLoading(true);
      try {
        const provs = await getProvincias();

        const direccionesNormalizadas = (afiliado.domicilios || []).map(
          (domicilio) => {
            const nombreProvincia = domicilio.Direccion?.Provincia?.nombre;
            const provinciaEncontrada =
              provs.find((p) => p.nombre === nombreProvincia) || null;

            return {
              id: domicilio.id,
              calle: domicilio.Direccion.calle || '',
              altura: domicilio.Direccion.altura || '',
              pisoDepto: domicilio.Direccion.pisoDepto || '',
              codigoPostal: domicilio.Direccion.codigoPostal || '',
              localidad: domicilio.Direccion.localidad || '',
              provincia: provinciaEncontrada,
              provinciaId: provinciaEncontrada?.id || null,
            };
          }
        );

        setDirecciones(
          direccionesNormalizadas.length > 0
            ? direccionesNormalizadas
            : [newDireccion()]
        );
      } catch (err) {
        console.error('Error cargando direcciones:', err);
      } finally {
        setModalLoading(false);
      }
    };

    loadData();
  }, [open, afiliado]);

  if (!afiliado) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Editar direcciones de {afiliado.nombre}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <FormValidationProvider>
        <DireccionEditContent
          direcciones={direcciones}
          setDirecciones={setDirecciones}
          afiliado={afiliado}
          modalLoading={modalLoading}
          onClose={onClose}
          updateDirecciones={updateDirecciones}
        />
      </FormValidationProvider>
    </Dialog>
  );
}

DireccionEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

DireccionEditContent.propTypes = {
  direcciones: PropTypes.array.isRequired,
  setDirecciones: PropTypes.func.isRequired,
  afiliado: PropTypes.object.isRequired,
  modalLoading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateDirecciones: PropTypes.func.isRequired,
};
