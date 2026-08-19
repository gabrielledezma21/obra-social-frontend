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
  Alert,
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

const normalizarTexto = (valor) =>
  String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

const claveDireccion = (direccion = {}) =>
  [
    normalizarTexto(direccion.calle),
    normalizarTexto(Number(direccion.altura)),
    normalizarTexto(direccion.pisoDepto),
    normalizarTexto(direccion.localidad),
    normalizarTexto(direccion.codigoPostal),
    normalizarTexto(
      direccion.provincia?.nombre ??
        direccion.provincia?.id ??
        direccion.provinciaId
    ),
  ].join('|');

const repiteDomicilioTitular = (direcciones, direccionesTitular) => {
  const clavesTitular = new Set(direccionesTitular.map(claveDireccion));
  return direcciones.some((direccion) =>
    clavesTitular.has(claveDireccion(direccion))
  );
};

const DireccionEditContent = ({
  direcciones,
  direccionesTitular,
  setDirecciones,
  afiliado,
  modalLoading,
  onClose,
  updateDirecciones,
  usarDomicilioPropio,
}) => {
  const { setValidationError, clearErrors } = useFormValidationContext();
  const [errorDomicilio, setErrorDomicilio] = useState('');

  const handleDireccionesChange = (field, nuevasDirecciones) => {
    setDirecciones(nuevasDirecciones);
    setErrorDomicilio('');
    clearErrors();
  };

  const handleGuardar = async () => {
    clearErrors();
    setErrorDomicilio('');

    const validation = validateDireccionesArray(direcciones);

    if (validation) {
      setValidationError(validation.field, validation.message);
      return;
    }

    if (
      usarDomicilioPropio &&
      repiteDomicilioTitular(direcciones, direccionesTitular)
    ) {
      setErrorDomicilio(
        'El domicilio propio debe ser diferente al domicilio del titular. Si viven en el mismo domicilio, mantené el domicilio compartido.'
      );
      return;
    }

    const actualizado = await updateDirecciones(direcciones, {
      usarDomicilioPropio,
    });
    if (actualizado) onClose();
  };

  return (
    <>
      <DialogContent dividers>
        {usarDomicilioPropio && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Ingresá un domicilio diferente al del titular. Al guardar, este
            integrante dejará de compartir el domicilio familiar y los futuros
            cambios del titular no afectarán su dirección propia.
          </Alert>
        )}

        {errorDomicilio && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorDomicilio}
          </Alert>
        )}

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
          confirmText={
            usarDomicilioPropio
              ? 'Guardar domicilio propio'
              : 'Guardar cambios'
          }
          cancelText="Cancelar"
        />
      </DialogActions>
    </>
  );
};

export default function DireccionEditModal({
  open,
  onClose,
  usarDomicilioPropio = false,
}) {
  const { afiliado, updateDirecciones } = useAfiliado();
  const [direcciones, setDirecciones] = useState([]);
  const [direccionesTitular, setDireccionesTitular] = useState([]);
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

        if (usarDomicilioPropio) {
          setDireccionesTitular(direccionesNormalizadas);
          setDirecciones([newDireccion()]);
        } else {
          setDireccionesTitular([]);
          setDirecciones(
            direccionesNormalizadas.length > 0
              ? direccionesNormalizadas
              : [newDireccion()]
          );
        }
      } catch (err) {
        console.error('Error cargando direcciones:', err);
      } finally {
        setModalLoading(false);
      }
    };

    loadData();
  }, [open, afiliado, usarDomicilioPropio]);

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
        {usarDomicilioPropio
          ? `Definir domicilio propio de ${afiliado.nombre}`
          : `Editar direcciones de ${afiliado.nombre}`}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <FormValidationProvider>
        <DireccionEditContent
          direcciones={direcciones}
          direccionesTitular={direccionesTitular}
          setDirecciones={setDirecciones}
          afiliado={afiliado}
          modalLoading={modalLoading}
          onClose={onClose}
          updateDirecciones={updateDirecciones}
          usarDomicilioPropio={usarDomicilioPropio}
        />
      </FormValidationProvider>
    </Dialog>
  );
}

DireccionEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  usarDomicilioPropio: PropTypes.bool,
};

DireccionEditContent.propTypes = {
  direcciones: PropTypes.array.isRequired,
  direccionesTitular: PropTypes.array.isRequired,
  setDirecciones: PropTypes.func.isRequired,
  afiliado: PropTypes.object.isRequired,
  modalLoading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateDirecciones: PropTypes.func.isRequired,
  usarDomicilioPropio: PropTypes.bool.isRequired,
};
