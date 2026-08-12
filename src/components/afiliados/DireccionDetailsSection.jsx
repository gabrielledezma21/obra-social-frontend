import { useState } from 'react';
import { Typography, Stack, Box } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import DetailsSection from '../common/details/DetailsSection';
import DireccionEditModal from './modals/DireccionEditModal';
import { useAfiliado } from '../../context/AfiliadoContext';

export default function DireccionDetailsSection() {
  const { afiliado } = useAfiliado();
  const [openModal, setOpenModal] = useState(false);

  if (!afiliado) return null;

  const domicilios = afiliado.domicilios || [];

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <>
      <DetailsSection title="Direcciones" icon={PlaceIcon} onEdit={handleOpen}>
        <Stack component="ul" spacing={2} sx={{ pl: 2, m: 0 }}>
          {domicilios.length > 0 ? (
            domicilios.map((domicilio) => (
              <Box key={domicilio.id} component="li">
                <Typography fontWeight={600}>
                  {domicilio.Direccion.calle} {domicilio.Direccion.altura}
                  {domicilio.Direccion.pisoDepto &&
                    ` - ${domicilio.Direccion.pisoDepto}`}
                </Typography>
                <Typography>
                  {domicilio.Direccion.localidad},{' '}
                  {domicilio.Direccion.Provincia.nombre}
                  {domicilio.Direccion.codigoPostal &&
                    ` (CP: ${domicilio.Direccion.codigoPostal})`}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>Sin direcciones registradas</Typography>
          )}
        </Stack>
      </DetailsSection>

      <DireccionEditModal open={openModal} onClose={handleClose} />
    </>
  );
}
