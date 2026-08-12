import { useState } from 'react';
import { Typography, Stack } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import DetailsSection from '../common/details/DetailsSection';
import { usePrestador } from '../../context/PrestadorContext';
import EspecialidadesEditModal from './modals/EspecialidadesEditModal';

export default function EspecialidadesDetailsSection() {
  const { prestador } = usePrestador();
  const [openModal, setOpenModal] = useState(false);

  if (!prestador) return null;

  const { especialidades } = prestador;

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <>
      <DetailsSection
        title="Especialidades del prestador"
        icon={ScienceIcon}
        onEdit={handleOpen}
      >
        <Typography fontWeight={600}>Especialidades</Typography>
        <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0 }}>
          {Array.isArray(especialidades) && especialidades.length > 0 ? (
            especialidades.map((e) => (
              <Typography key={e.id} component="li">
                {e.nombre}
              </Typography>
            ))
          ) : (
            <Typography color="text.secondary">Sin especialidades</Typography>
          )}
        </Stack>
      </DetailsSection>

      <EspecialidadesEditModal open={openModal} onClose={handleClose} />
    </>
  );
}
