import { useState } from 'react';
import { Typography, Stack, Snackbar, Alert, Button } from '@mui/material';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AddIcon from '@mui/icons-material/Add';
import DetailsSection from '../common/details/DetailsSection';
import { useAfiliado } from '../../context/AfiliadoContext';
import MiembroFamiliarDetails from './MiembroFamiliarDetails';
import CheckIcon from '@mui/icons-material/Check';
import AgregarMiembroModal from './modals/AgregarMiembroModal';
import { FormValidationProvider } from '../../context/FormValidationContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';

export default function GrupoFamiliarDetailsSection() {
  const { afiliado } = useAfiliado();
  const [toast, setToast] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  if (!afiliado) return null;

  const { dependientes } = afiliado;

  const handleToastClose = () => setToast(null);

  return (
    <FormValidationProvider>
      <DetailsSection
        title="Grupo Familiar"
        icon={FamilyRestroomIcon}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
          >
            Agregar miembro
          </Button>
        }
      >
        {dependientes && dependientes.length > 0 ? (
          <Stack spacing={3}>
            {dependientes.map((miembro, index) => (
              <MiembroFamiliarDetails
                key={miembro.id}
                miembro={miembro}
                numero={index + 1}
              />
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">
            El afiliado no tiene grupo familiar registrado.
          </Typography>
        )}
      </DetailsSection>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <AgregarMiembroModal
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      </LocalizationProvider>

      {toast && (
        <Snackbar
          key={toast.key}
          open
          autoHideDuration={2000}
          onClose={handleToastClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleToastClose}
            icon={<CheckIcon fontSize="inherit" />}
            severity="success"
            variant="filled"
            sx={{ color: 'white', fontWeight: 200 }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      )}
    </FormValidationProvider>
  );
}
