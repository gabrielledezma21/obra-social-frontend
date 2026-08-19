import { useState } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import DetailsSection from '../common/details/DetailsSection';
import DireccionEditModal from './modals/DireccionEditModal';
import { useAfiliado } from '../../context/AfiliadoContext';

export default function DireccionDetailsSection() {
  const { afiliado, usarDomicilioTitular } = useAfiliado();
  const [openModal, setOpenModal] = useState(false);
  const [crearDomicilioPropio, setCrearDomicilioPropio] = useState(false);

  if (!afiliado) return null;

  const domicilios = afiliado.domicilios || [];
  const parentesco = afiliado.parentesco?.relacion ?? afiliado.parentesco;
  const esTitular = parentesco === 'Titular';
  const comparteDomicilio = Boolean(afiliado.comparteDomicilioTitular);

  const handleOpen = () => {
    setCrearDomicilioPropio(false);
    setOpenModal(true);
  };

  const handleUsarDomicilioPropio = () => {
    setCrearDomicilioPropio(true);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setCrearDomicilioPropio(false);
  };

  const accionDomicilio = esTitular ? null : comparteDomicilio ? (
    <Button size="small" variant="outlined" onClick={handleUsarDomicilioPropio}>
      Usar domicilio propio
    </Button>
  ) : (
    <Button size="small" variant="outlined" onClick={usarDomicilioTitular}>
      Usar domicilio del titular
    </Button>
  );

  return (
    <>
      <DetailsSection
        title="Direcciones"
        icon={PlaceIcon}
        onEdit={esTitular || !comparteDomicilio ? handleOpen : undefined}
        editTooltip={
          esTitular ? 'Editar domicilio familiar' : 'Editar domicilio propio'
        }
        action={accionDomicilio}
      >
        {comparteDomicilio && !esTitular && (
          <Alert severity="info" sx={{ mb: 1 }}>
            Domicilio compartido con el titular. Los cambios se gestionan desde
            el titular del grupo familiar.
          </Alert>
        )}

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
                  {domicilio.Direccion.Provincia?.nombre || 'Sin provincia'}
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

      <DireccionEditModal
        open={openModal}
        onClose={handleClose}
        usarDomicilioPropio={crearDomicilioPropio}
      />
    </>
  );
}
