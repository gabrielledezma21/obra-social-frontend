import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  CircularProgress,
  Button,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/WarningAmber';

import ButtonsSection from '../../common/forms/FormActions';
import { getProvincias } from '../../../services/provincias';
import { usePrestador } from '../../../context/PrestadorContext';
import { groupHorariosCentros } from '../../../utils/formats/horarioGrouping';
import { validateLugarAtencionEditModal } from '../../../utils/validations/validateLugarAtencionEditModal';
import LugarAtencionList from './LugarAtencionList';

export default function LugarAtencionEditModal({ open, onClose }) {
  const { prestador, updateCentrosAtencion } = usePrestador();

  const [centros, setCentros] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const [warningOpen, setWarningOpen] = useState(false);

  const errorRefMap = useRef(new Map());

  useEffect(() => {
    if (!open || !prestador) return;

    const loadData = async () => {
      setModalLoading(true);
      try {
        const provs = await getProvincias();
        setProvincias(provs);

        const normalizados = (prestador.centrosAtencion || []).map((c) => ({
          ...c,
          id: crypto.randomUUID(),
          direccion: {
            ...c.direccion,
            provincia: c.direccion.provincia
              ? provs.find((p) => p.id === c.direccion.provincia.id) || null
              : null,
          },
          horarios: groupHorariosCentros(c.horarios),
        }));
        setCentros(normalizados);
      } catch (err) {
        console.error('Error cargando centros:', err);
      } finally {
        setModalLoading(false);
      }
    };

    loadData();
  }, [open, prestador]);

  const handleGuardarFinal = async () => {
    const { error } = await updateCentrosAtencion(centros);
    if (!error) {
      setWarningOpen(false);
      onClose();
    }
  };

  const handleGuardar = () => {
    setValidationError(null);

    const validation = validateLugarAtencionEditModal(centros);
    if (validation) {
      setValidationError(validation);

      const ref = errorRefMap.current.get(validation.field);
      if (ref?.scrollIntoView) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setWarningOpen(true);
  };

  if (!prestador) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Editar centros de atención de {prestador.nombre}
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 3 }}>
          {modalLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <LugarAtencionList
              centros={centros}
              provincias={provincias}
              onChange={setCentros}
              validationError={validationError}
              errorRefMap={errorRefMap}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <ButtonsSection
            handleGuardar={handleGuardar}
            onConfirmCancel={onClose}
            cancelTitle="¿Cancelar edición?"
            cancelMessage="Se perderán los cambios realizados."
            confirmText="Guardar cambios"
            cancelText="Cancelar"
          />
        </DialogActions>
      </Dialog>

      <Dialog
        open={warningOpen}
        onClose={() => setWarningOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 600,
            color: 'warning.main',
          }}
        >
          <WarningIcon sx={{ color: 'warning.main' }} />
          Atención
        </DialogTitle>

        <DialogContent dividers>
          <Typography sx={{ mb: 2 }}>
            Modificar los <strong>centros de atención</strong> eliminará{' '}
            <strong>todas las agendas de turno</strong> asociadas a este
            prestador.
          </Typography>

          <Typography>¿Querés continuar?</Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setWarningOpen(false)}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="warning"
            onClick={handleGuardarFinal}
          >
            Sí, continuar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

LugarAtencionEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
