import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Autocomplete,
  IconButton,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ButtonsSection from '../../common/forms/FormActions';
import {
  validateEmails,
  validateTelefonos,
} from '../../../utils/validations/validateContacto';
import { useAfiliado } from '../../../context/AfiliadoContext';

export default function DatosContactoEditModal({ open, onClose }) {
  const { afiliado, updateDatosContacto } = useAfiliado();

  const [localData, setLocalData] = useState(null);
  const [error, setError] = useState(null);

  const emailRef = useRef(null);
  const telRef = useRef(null);

  useEffect(() => {
    if (open && afiliado) {
      setLocalData({
        emails: (afiliado.emails || []).map((e) =>
          typeof e === 'string' ? { direccion: e } : e
        ),
        telefonos: (afiliado.telefonos || []).map((t) =>
          typeof t === 'string' ? { numero: t } : t
        ),
      });
      setError(null);
    }
  }, [open, afiliado]);

  if (!localData) return null;

  const handleEmailsChange = (_, values) => {
    setLocalData((prev) => ({
      ...prev,
      emails: values.map((v) => (typeof v === 'string' ? { direccion: v } : v)),
    }));
    setError(null);
  };

  const handleTelefonosChange = (_, values) => {
    setLocalData((prev) => ({
      ...prev,
      telefonos: values.map((v) => (typeof v === 'string' ? { numero: v } : v)),
    }));
    setError(null);
  };

  const onGuardar = async () => {
    let v;

    v = validateEmails(localData.emails);
    if (v) return setError(v);

    v = validateTelefonos(localData.telefonos);
    if (v) return setError(v);

    await updateDatosContacto(localData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Editar datos de contacto de {afiliado.nombre}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Box>
            <Autocomplete
              multiple
              freeSolo
              filterSelectedOptions
              value={localData.emails.map((e) => e.direccion)}
              onChange={(_, values) =>
                handleEmailsChange(
                  _,
                  values.map((v) => ({ direccion: v }))
                )
              }
              options={[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Emails"
                  inputRef={emailRef}
                  error={error?.field === 'emails'}
                  helperText={error?.field === 'emails' ? error.message : ''}
                />
              )}
            />
          </Box>

          <Box>
            <Autocomplete
              multiple
              freeSolo
              filterSelectedOptions
              value={localData.telefonos.map((t) => t.numero)}
              onChange={(_, values) =>
                handleTelefonosChange(
                  _,
                  values.map((v) => ({ numero: v }))
                )
              }
              options={[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Teléfonos"
                  inputRef={telRef}
                  error={error?.field === 'telefonos'}
                  helperText={error?.field === 'telefonos' ? error.message : ''}
                />
              )}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <ButtonsSection
          handleGuardar={onGuardar}
          onConfirmCancel={onClose}
          cancelTitle={`¿Cancelar la edición de los datos de contacto del afiliado ${afiliado.nombre}?`}
          cancelMessage="Si cancelás ahora, se perderán los cambios realizados."
          confirmText="Guardar cambios"
          cancelText="Cancelar"
        />
      </DialogActions>
    </Dialog>
  );
}

DatosContactoEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
