import { Typography, Stack, Chip, Box } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import DetailsSection from '../common/details/DetailsSection';
import { useAfiliado } from '../../context/AfiliadoContext';

const formatearFecha = (fecha) => {
  if (!fecha) return null;
  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return null;
  return valor.toLocaleDateString('es-AR', { timeZone: 'UTC' });
};

export default function SituacionesTerapeuticasDetailsSection() {
  const { afiliado } = useAfiliado();

  if (!afiliado) return null;

  const situaciones = Array.isArray(afiliado.situacionesTerapeuticas)
    ? afiliado.situacionesTerapeuticas
    : [];

  return (
    <DetailsSection title="Situaciones terapéuticas" icon={MedicalServicesIcon}>
      {situaciones.length > 0 ? (
        <Stack spacing={1.5}>
          {situaciones.map((situacion) => {
            const fechaInicio = formatearFecha(
              situacion.fechaInicio ?? situacion.AfiliadoSituaciones?.fechaInicio
            );
            const fechaFin = formatearFecha(
              situacion.fechaFin ?? situacion.AfiliadoSituaciones?.fechaFin
            );
            const activa = situacion.activa !== false && !fechaFin;

            return (
              <Box
                key={situacion.id}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 1,
                  py: 0.5,
                }}
              >
                <Box>
                  <Typography fontWeight={600}>{situacion.nombre}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {fechaInicio ? `Desde ${fechaInicio}` : 'Sin fecha de inicio'}
                    {fechaFin ? ` hasta ${fechaFin}` : ''}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={activa ? 'Activa' : 'Finalizada'}
                  color={activa ? 'success' : 'default'}
                  variant="outlined"
                />
              </Box>
            );
          })}
        </Stack>
      ) : (
        <Typography color="text.secondary">
          Sin situaciones terapéuticas registradas.
        </Typography>
      )}
    </DetailsSection>
  );
}
