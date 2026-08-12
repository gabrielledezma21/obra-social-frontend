import { useState, useEffect } from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import PageDetailHeader from '../../components/common/details/PageDetailHeader';
import PrestadorDetailsSection from '../../components/agenda-turnos/PrestadorDetailsSection';
import HorariosDetailsSection from '../../components/agenda-turnos/HorariosDetailsSection';
import AuditInfoSection from '../../components/common/details/AuditInfoSection';
import SuccessSnackbar from '../../components/common/SuccessSnackbar';
import { AgendaProvider, useAgenda } from '../../context/AgendaContext';
import { usePageTitle } from '../../hooks/usePageTitle';

function DetalleAgendaContent() {
  const { agenda, loading, deleteAgenda } = useAgenda();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !agenda) {
      navigate('/404', { replace: true });
    }
  }, [loading, agenda, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!agenda) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <PageDetailHeader
        type="agenda-de-turnos"
        id={id}
        nombre={agenda.prestador?.nombre || ''}
        onDelete={deleteAgenda}
      />

      <Grid container spacing={3} mt={1}>
        <Grid size={{ xs: 12 }}>
          <PrestadorDetailsSection />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <HorariosDetailsSection />
        </Grid>
      </Grid>

      <AuditInfoSection
        createdAtFecha={agenda.createdAtFecha}
        createdAtHora={agenda.createdAtHora}
        updatedAtFecha={agenda.updatedAtFecha}
        updatedAtHora={agenda.updatedAtHora}
      />
    </Box>
  );
}

export default function DetalleAgendaTurnos() {
  usePageTitle('MedIntegral | Detalle de agenda de turnos');

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
        `/agenda-turnos/detalle/${id}`
      );
    }
  }, [location, id]);

  return (
    <AgendaProvider idAgenda={id}>
      <DetalleAgendaContent />

      <SuccessSnackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        message="Agenda de turnos creada con éxito"
      />
    </AgendaProvider>
  );
}
