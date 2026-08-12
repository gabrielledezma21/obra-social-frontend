import { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import SuccessSnackbar from '../../components/common/SuccessSnackbar';
import { usePageTitle } from '../../hooks/usePageTitle';
import { AfiliadoProvider, useAfiliado } from '../../context/AfiliadoContext';
import AuditInfoSection from '../../components/common/details/AuditInfoSection';
import DatosPersonalesDetailsSection from '../../components/afiliados/DatosPersonalesDetailsSection';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CoberturaDetailsSection from '../../components/afiliados/CoberturaDetailsSection';
import SituacionesTerapeuticasSection from '../../components/afiliados/SituacionesTerapeuticasDetailsSection';
import DatosContactoDetailsSection from '../../components/afiliados/DatosContactoDetailsSection';
import DireccionDetailsSection from '../../components/afiliados/DireccionDetailsSection';
import GrupoFamiliarDetailsSection from '../../components/afiliados/GrupoFamiliarDetailsSection';
import AfiliadoDetailHeader from '../../components/afiliados/AfiliadoDetailHeader';
import 'dayjs/locale/es';

function DetalleAfiliadoContent() {
  const { afiliado, loading } = useAfiliado();
  const navigate = useNavigate();

  useEffect(() => {
    if (afiliado && afiliado.parentesco.relacion.toLowerCase() !== 'titular') {
      navigate('/403', { replace: true });
    }
    if (!loading && !afiliado) {
      navigate('/404', { replace: true });
    }
  }, [loading, afiliado, navigate]);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (!afiliado) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box sx={{ mt: 2 }}>
        <AfiliadoDetailHeader
          nombre={afiliado.nombre}
          apellido={afiliado.apellido}
        />

        <Grid container spacing={3} mt={1}>
          <Grid size={{ xs: 12 }}>
            <DatosPersonalesDetailsSection />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CoberturaDetailsSection />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <SituacionesTerapeuticasSection />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <DatosContactoDetailsSection />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <DireccionDetailsSection />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <GrupoFamiliarDetailsSection />
          </Grid>
        </Grid>

        <AuditInfoSection
          createdAtFecha={afiliado.createdAtFecha}
          createdAtHora={afiliado.createdAtHora}
          updatedAtFecha={afiliado.updatedAtFecha}
          updatedAtHora={afiliado.updatedAtHora}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default function DetalleAfiliado() {
  usePageTitle('MedIntegral | Detalle de afiliado y grupo familiar');

  const { id } = useParams();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('created') === 'true') {
      setShowSuccess(true);
      window.history.replaceState(
        {},
        document.title,
        `/afiliados/detalle/${id}`
      );
    }
  }, [location, id]);

  return (
    <AfiliadoProvider idAfiliado={id}>
      <DetalleAfiliadoContent />

      <SuccessSnackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        message="Afiliado creado con éxito"
      />
    </AfiliadoProvider>
  );
}
