import { useState } from 'react';
import { Stack, Typography, Divider, Link } from '@mui/material';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DetailsSection from '../common/details/DetailsSection';
import PrestadorEditModal from './modals/PrestadorEditModal';
import { useAgenda } from '../../context/AgendaContext';

export default function PrestadorDetailsSection() {
  const { agenda } = useAgenda();
  const [openModal, setOpenModal] = useState(false);

  if (!agenda) return null;

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const { prestador, especialidad, direccion } = agenda;

  return (
    <>
      <DetailsSection
        title="Datos del Prestador"
        icon={LocalHospitalOutlinedIcon}
        onEdit={handleOpen}
      >
        <Typography>
          <strong>Prestador: </strong>
          {prestador?.id ? (
            <Link
              href={`/prestadores/detalle/${prestador.id}`}
              sx={{
                fontWeight: 600,
                color: '#1976d2',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {prestador.nombre}
            </Link>
          ) : (
            prestador.nombre
          )}
        </Typography>

        <Typography>
          <strong>Especialidad:</strong> {especialidad?.nombre || '—'}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <Stack direction="row" alignItems="center" spacing={1}>
          <LocationOnOutlinedIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {direccion || 'Sin dirección especificada'}
          </Typography>
        </Stack>
      </DetailsSection>

      <PrestadorEditModal open={openModal} onClose={handleClose} />
    </>
  );
}
