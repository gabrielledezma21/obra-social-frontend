import { useState } from 'react';
import { Stack, Typography, Divider, Box } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DetailsSection from '../common/details/DetailsSection';
import LugarAtencionEditModal from './modals/LugarAtencionEditModal';
import { usePrestador } from '../../context/PrestadorContext';

export default function CentrosAtencionDetailsSection() {
  const { prestador } = usePrestador();
  const [openModal, setOpenModal] = useState(false);

  if (!prestador) return null;

  const centros = prestador.centrosAtencion || [];

  if (!Array.isArray(centros) || !centros.length) return null;

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <>
      <DetailsSection
        title="Centros de Atención"
        icon={PlaceIcon}
        onEdit={handleOpen}
      >
        <Stack spacing={3}>
          {centros.map((c, index) => (
            <Box key={c.id}>
              <Typography fontWeight={600}>{c.direccionTexto}</Typography>

              {c.horarios?.length > 0 ? (
                <Stack spacing={1.2} mt={1}>
                  {c.horarios.map((h) => (
                    <Stack
                      key={h.id}
                      direction="row"
                      spacing={1.2}
                      alignItems="center"
                    >
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {`${h.dia.nombre}: ${h.horaInicio} a ${h.horaFin}`}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">
                  Sin horarios configurados
                </Typography>
              )}

              {index < centros.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Stack>
      </DetailsSection>

      <LugarAtencionEditModal open={openModal} onClose={handleClose} />
    </>
  );
}
