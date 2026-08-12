import { useState } from 'react';
import { Typography, Divider, Stack, Snackbar, Alert } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import DetailsSection from '../common/details/DetailsSection';
import CopyItem from '../common/details/CopyItem';
import { usePrestador } from '../../context/PrestadorContext';
import DatosPersonalesEditModal from './modals/DatosPersonalesEditModal';
import CheckIcon from '@mui/icons-material/Check';

export default function DatosPersonalesDetailsSection() {
  const { prestador } = usePrestador();
  const [openModal, setOpenModal] = useState(false);
  const [toast, setToast] = useState(null);

  if (!prestador) return null;

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const { nombre, cuilCuit, emails, telefonos } = prestador;

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setToast({ message: `${label} copiado`, key: Date.now() });
  };

  const handleToastClose = () => setToast(null);

  return (
    <>
      <DetailsSection
        title="Datos personales del prestador"
        icon={MedicalServicesIcon}
        onEdit={handleOpen}
      >
        <Typography>
          <strong>Nombre: </strong> {nombre}
        </Typography>

        <Typography>
          <strong>CUIL/CUIT: </strong> {cuilCuit || '—'}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <Typography fontWeight={600}>Emails</Typography>
        <Stack component="ul" spacing={1} sx={{ pl: 0, m: 0 }}>
          {emails?.length > 0 ? (
            emails.map((e) => (
              <CopyItem
                key={e.id}
                text={e.direccion}
                link={`mailto:${e.direccion}`}
                label="Email"
                onCopy={handleCopy}
              />
            ))
          ) : (
            <Typography color="text.secondary">Sin emails</Typography>
          )}
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Typography fontWeight={600}>Teléfonos</Typography>
        <Stack component="ul" spacing={1} sx={{ pl: 0, m: 0 }}>
          {telefonos?.length > 0 ? (
            telefonos.map((t) => (
              <CopyItem
                key={t.id}
                text={t.numero}
                link={`tel:${t.numero}`}
                label="Teléfono"
                onCopy={handleCopy}
              />
            ))
          ) : (
            <Typography color="text.secondary">Sin teléfonos</Typography>
          )}
        </Stack>
      </DetailsSection>

      <DatosPersonalesEditModal open={openModal} onClose={handleClose} />

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
    </>
  );
}
