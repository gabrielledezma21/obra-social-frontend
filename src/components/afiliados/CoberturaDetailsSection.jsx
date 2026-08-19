import { useState } from 'react';
import { Typography, Snackbar, Alert, Stack } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DetailsSection from '../common/details/DetailsSection';
import { useAfiliado } from '../../context/AfiliadoContext';
import CoberturaEditModal from './modals/CoberturaEditModal';
import CheckIcon from '@mui/icons-material/Check';

export default function CoberturaDetailsSection() {
  const { afiliado } = useAfiliado();
  const [openModal, setOpenModal] = useState(false);
  const [toast, setToast] = useState(null);

  if (!afiliado) return null;

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const { Contrato, credencial, parentesco } = afiliado;

  const handleToastClose = () => setToast(null);

  return (
    <>
      <DetailsSection
        title="Cobertura"
        icon={AssignmentIcon}
        onEdit={handleOpen}
      >
        <Stack spacing={0.75}>
          <Typography>
            <strong>Credencial: </strong> {credencial || '—'}
          </Typography>
          <Typography>
            <strong>Parentesco: </strong>{' '}
            {parentesco?.relacion || parentesco || '—'}
          </Typography>
          <Typography>
            <strong>Plan médico: </strong> {Contrato?.plan?.plan || '—'}
          </Typography>
        </Stack>
      </DetailsSection>

      <CoberturaEditModal open={openModal} onClose={handleClose} />

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
