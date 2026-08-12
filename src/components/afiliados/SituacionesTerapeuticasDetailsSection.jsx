import { useState } from 'react';
import { Typography, Stack, Snackbar, Alert } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import DetailsSection from '../common/details/DetailsSection';
import { useAfiliado } from '../../context/AfiliadoContext';
import CheckIcon from '@mui/icons-material/Check';

export default function DatosPersonalesDetailsSection() {
  const { afiliado } = useAfiliado();
  const [toast, setToast] = useState(null);

  if (!afiliado) return null;

  const { situacionesTerapeuticas } = afiliado;

  const handleToastClose = () => setToast(null);

  const formatFecha = (fecha) => {
    if (!fecha) return '—';
    const [datePart] = fecha.split('T');
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <DetailsSection
        title="Situaciones Terapeúticas"
        icon={MedicalServicesIcon}
      >
        <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0 }}>
          {Array.isArray(situacionesTerapeuticas) &&
          situacionesTerapeuticas.length > 0 ? (
            situacionesTerapeuticas.map((s) => (
              <Typography key={s.id} component="li">
                {s.nombre} -{' '}
                {formatFecha(s.AfiliadoSituaciones?.fechaInicio) || 'Sin fecha'}
                {s.AfiliadoSituaciones?.fechaFin &&
                  ` hasta ${formatFecha(s.AfiliadoSituaciones.fechaFin)}`}
              </Typography>
            ))
          ) : (
            <Typography color="text.secondary">
              Sin situaciones terapeúticas
            </Typography>
          )}
        </Stack>
      </DetailsSection>

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
