import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  TextField,
  Autocomplete,
  IconButton,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ButtonsSection from '../../common/forms/FormActions';
import {
  validateNombre,
  validateCuilCuit,
  validateEmails,
  validateTelefonos,
} from '../../../utils/validations/validateContacto';
import { usePrestador } from '../../../context/PrestadorContext';

export default function DatosPersonalesEditModal({ open, onClose }) {
  const { prestador, updateDatosPersonales } = usePrestador();

  const [localData, setLocalData] = useState(null);
  const [error, setError] = useState(null);

  const emailRef = useRef(null);
  const telRef = useRef(null);

  useEffect(() => {
    if (open && prestador) {
      setLocalData({
        nombre: prestador.nombre || '',
        cuilCuit: prestador.cuilCuit || '',
        emails: (prestador.emails || []).map((e) =>
          typeof e === 'string' ? { direccion: e } : e
        ),
        telefonos: (prestador.telefonos || []).map((t) =>
          typeof t === 'string' ? { numero: t } : t
        ),
      });
      setError(null);
    }
  }, [open, prestador]);

  if (!localData) return null;

  const handleField = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

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

    v = validateNombre(localData.nombre, 'nombre');
    if (v) return setError(v);

    v = validateCuilCuit(localData.cuilCuit);
    if (v) return setError(v);

    v = validateEmails(localData.emails);
    if (v) return setError(v);

    v = validateTelefonos(localData.telefonos);
    if (v) return setError(v);

    await updateDatosPersonales(localData);
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
        Editar datos personales de {prestador.nombre}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="CUIL / CUIT"
                name="cuilCuit"
                placeholder="Ingresá un CUIL/CUIT sin puntos ni guiones"
                value={localData.cuilCuit}
                onChange={handleField}
                error={error?.field === 'cuilCuit'}
                helperText={error?.field === 'cuilCuit' ? error.message : ''}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Nombre completo"
                name="nombre"
                placeholder="Ingresá el nombre completo"
                value={localData.nombre}
                onChange={handleField}
                error={error?.field === 'nombre'}
                helperText={error?.field === 'nombre' ? error.message : ''}
              />
            </Grid>
          </Grid>

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
                  placeholder="Ingresá un email y presioná Enter"
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
                  placeholder="Ingresá un teléfono y presioná Enter"
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
          cancelTitle={`¿Cancelar la edición de los datos personales del prestador ${prestador.nombre}?`}
          cancelMessage="Si cancelás ahora, se perderán los cambios realizados."
          confirmText="Guardar cambios"
          cancelText="Cancelar"
        />
      </DialogActions>
    </Dialog>
  );
}

DatosPersonalesEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
