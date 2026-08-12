import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDashboard } from '../../context/DashboardContext';
import PrestadoresPorLocalidadModal from './modals/PrestadoresPorLocalidadModal';
import { usePrestadoresPorLocalidadData } from '../../hooks/usePrestadoresPorLocalidadData';

export default function PrestadoresPorLocalidad() {
  const { prestadoresPorLocalidad } = useDashboard();
  const [openModal, setOpenModal] = useState(false);

  const { chartData, fullData, total } = usePrestadoresPorLocalidadData(
    prestadoresPorLocalidad
  );

  const colors = ['#00B1EA', '#4CAF50', '#FFC107', '#F44336', '#FF8E00'];

  if (!chartData.length) return null;

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
            Prestadores por localidad
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <PieChart
              series={[
                {
                  data: chartData.map((d, i) => ({
                    id: d.id,
                    value: d.value,
                    label: d.label,
                    color: colors[i % colors.length],
                  })),
                  innerRadius: 40,
                  outerRadius: 80,
                  paddingAngle: 3,
                  cornerRadius: 4,
                  label: { visible: false },
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: 'rgba(0,0,0,0.05)',
                  },
                },
              ]}
              tooltip={{
                trigger: 'item',
                formatter: (params) =>
                  `${params.data.label}: ${params.data.value}%`,
              }}
              width={180}
              height={200}
            />

            <Stack spacing={1.2} sx={{ ml: 2 }}>
              {chartData.map((item, i) => (
                <Stack
                  key={item.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1.5}
                  sx={{ minWidth: 160 }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: colors[i % colors.length],
                      }}
                    />
                    <Typography variant="body2" color="text.primary">
                      {item.label}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={500}>
                    {item.value}%
                  </Typography>
                </Stack>
              ))}
              {chartData.length > 3 && (
                <Button
                  variant="text"
                  size="small"
                  sx={{ mt: 1, textTransform: 'none', color: 'primary.main' }}
                  onClick={() => setOpenModal(true)}
                >
                  Ver más
                </Button>
              )}
            </Stack>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, textAlign: 'center' }}
          >
            Distribución porcentual de prestadores según localidad
          </Typography>
        </CardContent>
      </Card>

      <PrestadoresPorLocalidadModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullData={fullData}
        total={total}
        colors={colors}
      />
    </>
  );
}
