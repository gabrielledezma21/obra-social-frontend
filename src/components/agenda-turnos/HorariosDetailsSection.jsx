import { useState } from 'react';
import { Stack, Typography, Divider, Box } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import DetailsSection from '../common/details/DetailsSection';
import HorariosEditModal from './modals/HorariosEditModal';
import { useAgenda } from '../../context/AgendaContext';

export default function HorariosDetailsSection() {
  const { agenda } = useAgenda();
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const horariosAtencion = agenda?.horariosAtencionGrouped || [];

  return (
    <>
      <DetailsSection
        title="Horarios de Atención"
        icon={CalendarMonthOutlinedIcon}
        onEdit={handleOpen}
      >
        {horariosAtencion.length > 0 ? (
          <Stack spacing={1.5}>
            {horariosAtencion.map((h, index) => (
              <Box key={index}>
                <Typography variant="body1" fontWeight={500}>
                  {h.dias}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                  <AccessTimeOutlinedIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {`${h.horaInicio} a ${h.horaFin}  — Duración por turno: ${h.duracion} mins`}
                  </Typography>
                </Stack>
                {index < horariosAtencion.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">
            No hay horarios registrados
          </Typography>
        )}
      </DetailsSection>

      <HorariosEditModal open={openModal} onClose={handleClose} />
    </>
  );
}
