import { Paper, Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import AltaAfiliadoForm from '../../components/afiliados/AltaAfiliadoForm';
import { FormValidationProvider } from '../../context/FormValidationContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';

export default function AfiliadosAlta() {
  return (
    <Box sx={{ mt: 2 }}>
      <PageHeader
        title="Alta de afiliado"
        subtitle="Ingrese los datos para dar de alta un nuevo afiliado"
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
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <AltaAfiliadoForm />
          </LocalizationProvider>
        </FormValidationProvider>
      </Paper>
    </Box>
  );
}
