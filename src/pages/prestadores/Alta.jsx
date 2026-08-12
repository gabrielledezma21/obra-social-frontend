import { Paper, Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import AltaPrestadorForm from '../../components/prestadores/AltaPrestadorForm';
import { HorariosProvider } from '../../context/HorariosContext';
import { FormValidationProvider } from '../../context/FormValidationContext';

export default function PrestadoresAlta() {
  return (
    <Box sx={{ mt: 2 }}>
      <PageHeader
        title="Alta de prestador"
        subtitle="Ingrese los datos para dar de alta un nuevo prestador"
      />
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          mt: 3,
        }}
      >
        <FormValidationProvider>
          <HorariosProvider>
            <AltaPrestadorForm />
          </HorariosProvider>
        </FormValidationProvider>
      </Paper>
    </Box>
  );
}
