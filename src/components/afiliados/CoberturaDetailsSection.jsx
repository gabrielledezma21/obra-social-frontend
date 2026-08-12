import { useState } from 'react';
import { Typography, Snackbar, Alert } from '@mui/material';
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

  const { Contrato } = afiliado;

  const handleToastClose = () => setToast(null);

  return (
    <>
      <DetailsSection
        title="Cobertura"
        icon={AssignmentIcon}
        onEdit={handleOpen}
      >
        <Typography>
          <strong>Plan Médico: </strong> {Contrato?.plan?.plan}
        </Typography>
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
