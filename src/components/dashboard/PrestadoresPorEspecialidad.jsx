import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
} from '@mui/material';
import { useDashboard } from '../../context/DashboardContext';
import { usePrestadoresPorEspecialidadData } from '../../hooks/usePrestadoresPorEspecialidadData';
import PrestadoresPorEspecialidadModal from './modals/PrestadoresPorEspecialidadModal';

export default function PrestadoresPorEspecialidad() {
  const { prestadoresPorEspecialidad } = useDashboard();
  const [openModal, setOpenModal] = useState(false);

  const { chartData, fullData, total } = usePrestadoresPorEspecialidadData(
    prestadoresPorEspecialidad
  );

  if (!chartData.length) return null;

  const mostrarVerMas = chartData.length > 5;

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Prestadores por especialidad
          </Typography>

          <Stack spacing={1.2}>
            {chartData.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 0.5,
                }}
              >
                <Typography variant="body1" color="text.primary">
                  {item.label}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="text.primary"
                >
                  {item.cantidad}
                </Typography>
              </Box>
            ))}
          </Stack>

          {mostrarVerMas && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button
                variant="text"
                size="small"
                sx={{
                  textTransform: 'none',
                  color: 'primary.main',
                }}
                fullWidth
                onClick={() => setOpenModal(true)}
              >
                Ver más
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <PrestadoresPorEspecialidadModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullData={fullData}
        total={total}
      />
    </>
  );
}

PrestadoresPorEspecialidad.propTypes = {
  prestadoresPorEspecialidad: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
    })
  ),
};
