import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useDashboard } from '../../context/DashboardContext';

export default function PlanesMedicosPorMes() {
  const { planesMedicosPorMes = [] } = useDashboard();

  if (!planesMedicosPorMes || planesMedicosPorMes.length === 0) {
    return (
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
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Planes médicos por mes
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.secondary',
              gap: 1,
            }}
          >
            <InfoOutlinedIcon fontSize="small" />
            <Typography variant="body2">
              No hay información disponible actualmente.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const dataset = planesMedicosPorMes.map((d) => ({
    mes: d.mes,
    ...d.planes,
  }));

  const planKeys = Object.keys(planesMedicosPorMes[0]?.planes || {});

  const colors = ['#00B1EA', '#4CAF50', '#FFC107', '#F44336', '#FF8E00'];

  const valueFormatter = (value) => `${value}`;
  const chartSetting = {
    yAxis: [{ label: 'Cantidad', width: 60 }],
    height: 280,
    sx: { [`& .MuiChartsLegend-root`]: { mt: 1 } },
    borderRadius: 4,
  };

  const series = planKeys.map((key, index) => ({
    dataKey: key,
    label: key,
    color: colors[index % colors.length],
    valueFormatter,
    barRadius: 6,
  }));

  return (
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
      <CardContent>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Planes médicos por mes
        </Typography>

        <BarChart
          dataset={dataset}
          xAxis={[{ dataKey: 'mes', scaleType: 'band' }]}
          series={series}
          {...chartSetting}
        />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, textAlign: 'center' }}
        >
          Cantidad de afiliados por plan médico en los últimos meses
        </Typography>
      </CardContent>
    </Card>
  );
}
