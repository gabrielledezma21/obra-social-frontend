import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  IconButton,
  Stack,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ButtonsSection from '../../common/forms/FormActions';
import {
  validateNombre,
  validateNumeroDocumento,
} from '../../../utils/validations/validateContacto';
import { useAfiliado } from '../../../context/AfiliadoContext';
import { getTiposDocumento } from '../../../services/tipoDocumento';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import {
  validateFechaNacimiento,
  validateFechasVigencia,
} from '../../../utils/validations/validateFechas';

export default function DatosPersonalesEditModal({ open, onClose }) {
  const { afiliado, updateDatosPersonales } = useAfiliado();
  const [localData, setLocalData] = useState(null);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && afiliado) {
      const loadTiposDocumento = async () => {
        setLoadingTipos(true);
        try {
          const tipos = await getTiposDocumento();
          setTiposDocumento(tipos);

          const tipoDocumentoCompleto = tipos.find(
            (tipo) => tipo.tipo === afiliado.tipoDocumento?.tipo
          );

          setLocalData({
            numeroDocumento: afiliado.numeroDocumento || '',
            nombre: afiliado.nombre || '',
            apellido: afiliado.apellido || '',
            tipoDocumento: tipoDocumentoCompleto || null,
            fechaNacimiento: afiliado.fechaNacimiento
              ? dayjs(afiliado.fechaNacimiento).format('YYYY-MM-DD')
              : '',
            vigenciaInicio: afiliado.vigenciaInicio
              ? dayjs(afiliado.vigenciaInicio).format('YYYY-MM-DD')
              : '',
            vigenciaFin: afiliado.vigenciaFin
              ? dayjs(afiliado.vigenciaFin).format('YYYY-MM-DD')
              : null,
            tieneFechaBaja: afiliado.tieneFechaBaja,
          });
        } catch (err) {
          console.error('Error cargando tipos de documento:', err);
        } finally {
          setLoadingTipos(false);
        }
      };

      setError(null);
      loadTiposDocumento();
    }
  }, [open, afiliado]);

  if (!localData) return null;

  const handleField = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleTipoDocumentoChange = (_, newValue) => {
    setLocalData((prev) => ({ ...prev, tipoDocumento: newValue }));
    setError(null);
  };

  const handleDateChange = (fieldName) => (newDate) => {
    setLocalData((prev) => ({
      ...prev,
      [fieldName]: newDate ? dayjs(newDate).format('YYYY-MM-DD') : null,
    }));

    if (error?.field === fieldName) {
      setError(null);
    }
  };

  const onGuardar = async () => {
    let v;

    if (!localData.tipoDocumento || !localData.tipoDocumento.id) {
      return setError({
        field: 'tipoDocumento',
        message: 'El tipo de documento es obligatorio.',
      });
    }

    v = validateNumeroDocumento(localData.numeroDocumento, 'numeroDocumento');
    if (v) return setError(v);

    v = validateFechaNacimiento(localData.fechaNacimiento, 'fechaNacimiento');
    if (v) return setError(v);

    v = validateNombre(localData.nombre, 'nombre');
    if (v) return setError(v);

    v = validateNombre(localData.apellido, 'apellido');
    if (v) return setError(v);

    v = validateFechasVigencia(
      localData.vigenciaInicio,
      localData.vigenciaFin,
      localData.tieneFechaBaja
    );
    if (v) return setError(v);

    const payload = {
      tipoDocumentoId: localData.tipoDocumento.id,
      numeroDocumento: localData.numeroDocumento,
      fechaNacimiento: localData.fechaNacimiento,
      nombre: localData.nombre,
      apellido: localData.apellido,
      vigenciaInicio: localData.vigenciaInicio,
      vigenciaFin: localData.vigenciaFin || null,
      tieneFechaBaja: localData.tieneFechaBaja,
    };

    try {
      await updateDatosPersonales(payload);
      onClose();
    } catch (err) {
      const backendError = err.response?.data;
      if (backendError?.field && backendError?.message) {
        setError({ field: backendError.field, message: backendError.message });
      } else {
        console.error('Error al actualizar datos personales:', err);
      }
    }
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
        Editar datos personales de {afiliado.nombre}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Autocomplete
                fullWidth
                loading={loadingTipos}
                value={localData.tipoDocumento}
                onChange={handleTipoDocumentoChange}
                options={tiposDocumento}
                getOptionLabel={(option) => option?.tipo || ''}
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipo de Documento"
                    error={error?.field === 'tipoDocumento'}
                    helperText={
                      error?.field === 'tipoDocumento' ? error.message : ''
                    }
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Numero de documento"
                name="numeroDocumento"
                value={localData.numeroDocumento}
                onChange={handleField}
                error={error?.field === 'numeroDocumento'}
                helperText={
                  error?.field === 'numeroDocumento' ? error.message : ''
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 5 }}>
              <DatePicker
                value={
                  localData.fechaNacimiento
                    ? dayjs(localData.fechaNacimiento)
                    : null
                }
                onChange={handleDateChange('fechaNacimiento')}
                label="Fecha de Nacimiento"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: error?.field === 'fechaNacimiento',
                    helperText:
                      error?.field === 'fechaNacimiento' ? error.message : '',
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={localData.nombre}
                onChange={handleField}
                error={error?.field === 'nombre'}
                helperText={error?.field === 'nombre' ? error.message : ''}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Apellido"
                name="apellido"
                value={localData.apellido}
                onChange={handleField}
                error={error?.field === 'apellido'}
                helperText={error?.field === 'apellido' ? error.message : ''}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                value={
                  localData.vigenciaInicio
                    ? dayjs(localData.vigenciaInicio)
                    : null
                }
                onChange={handleDateChange('vigenciaInicio')}
                label="Vigencia inicio"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: error?.field === 'vigenciaInicio',
                    helperText:
                      error?.field === 'vigenciaInicio' ? error.message : '',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <ButtonsSection
          handleGuardar={onGuardar}
          onConfirmCancel={onClose}
          cancelTitle={`¿Cancelar la edición de los datos personales del afiliado ${afiliado.nombre}?`}
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
