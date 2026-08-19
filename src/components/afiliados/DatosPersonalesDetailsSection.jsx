import { useState } from 'react';
import { Typography, Divider, Stack, Snackbar, Alert } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import DetailsSection from '../common/details/DetailsSection';
import { useAfiliado } from '../../context/AfiliadoContext';
import DatosPersonalesEditModal from './modals/DatosPersonalesEditModal';
import CheckIcon from '@mui/icons-material/Check';
import { formatearFechaCalendario } from '../../utils/fechaCalendario';

export default function DatosPersonalesDetailsSection() {
  const { afiliado } = useAfiliado();
  const [openModal, setOpenModal] = useState(false);
  const [toast, setToast] = useState(null);

  if (!afiliado) return null;

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const {
    tipoDocumento,
    numeroDocumento,
    fechaNacimiento,
    nombre,
    apellido,
    vigenciaInicio,
    vigenciaFin,
  } = afiliado;

  const handleToastClose = () => setToast(null);

  return (
    <>
      <DetailsSection
        title="Datos personales del afiliado"
        icon={PersonIcon}
        onEdit={handleOpen}
      >
        <Typography>
          <strong>Documento: </strong> {tipoDocumento?.tipo} {numeroDocumento}
        </Typography>

        <Typography>
          <strong>Nombre: </strong> {nombre} {apellido}
        </Typography>

        <Typography>
          <strong>Fecha de Nacimiento: </strong>{' '}
          {formatearFechaCalendario(fechaNacimiento)}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <Typography fontWeight={600}>Vigencia</Typography>
        <Stack spacing={1} sx={{ mt: 1 }}>
          <Typography variant="body2">
            <strong>Inicio:</strong> {formatearFechaCalendario(vigenciaInicio)}
          </Typography>
          {vigenciaFin ? (
            <Typography variant="body2" color="error">
              <strong>Fin:</strong> {formatearFechaCalendario(vigenciaFin)}
            </Typography>
          ) : (
            <Typography variant="body2" color="success.main">
              <strong>Estado:</strong> Activo
            </Typography>
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
