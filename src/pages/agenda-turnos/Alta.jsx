import { Paper, Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import AltaTurnosForm from '../../components/agenda-turnos/AltaTurnosForm';
import { PrestadorProvider } from '../../context/PrestadorAgendaTurnosContext';
import { HorariosProvider } from '../../context/HorariosContext';
import { FormValidationProvider } from '../../context/FormValidationContext';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function AltaTurnos() {
  usePageTitle('MedIntegral | Alta de agenda de turnos');
  return (
    <Box sx={{ mt: 2 }}>
      <PageHeader
        title="Alta de agenda de turnos"
        subtitle="Ingresá los datos para crear una nueva agenda de turnos"
      />
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          mt: 3,
        }}
      >
        <PrestadorProvider>
          <FormValidationProvider>
            <HorariosProvider>
              <AltaTurnosForm />
            </HorariosProvider>
          </FormValidationProvider>
        </PrestadorProvider>
      </Paper>
    </Box>
  );
}
