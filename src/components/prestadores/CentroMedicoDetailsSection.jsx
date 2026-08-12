import { useState } from 'react';
import { Typography, Box } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import DetailsSection from '../common/details/DetailsSection';
import CentroMedicoEditModal from './modals/CentroMedicoEditModal';
import { usePrestador } from '../../context/PrestadorContext';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function CentroMedicoDetailsSection() {
  const { prestador } = usePrestador();
  const [openModal, setOpenModal] = useState(false);

  if (!prestador) return null;

  const { esCentroMedico, integraCentroMedico, centroMedicoNombre } = prestador;

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  return (
    <>
      <DetailsSection title="Categoría" icon={BusinessIcon} onEdit={handleOpen}>
        {esCentroMedico ? (
          <Typography>Es un centro médico</Typography>
        ) : integraCentroMedico ? (
          <Typography>
            Integra centro médico: <strong>{centroMedicoNombre}</strong>
          </Typography>
        ) : (
          <Box>
            <Typography
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <InfoOutlinedIcon fontSize="small" />
              Este profesional no es centro médico ni integra otro actualmente.
            </Typography>
          </Box>
        )}
      </DetailsSection>

      <CentroMedicoEditModal open={openModal} onClose={handleClose} />
    </>
  );
}
