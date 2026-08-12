import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PieChart } from '@mui/x-charts/PieChart';

export default function PrestadoresPorLocalidadModal({
  open,
  onClose,
  fullData,
  total,
  colors,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderBottomColor: '#D9D9D9',
        }}
      >
        <Box>
          <Typography variant="h6">Prestadores por localidad</Typography>
          <Typography variant="body2" color="text.secondary">
            Total: {total} prestadores
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 0,
          }}
        >
          <PieChart
            series={[
              {
                data: fullData.map((d, i) => ({
                  id: d.id,
                  value: d.value,
                  label: d.label,
                  color: colors[i % colors.length],
                })),
                innerRadius: 50,
                outerRadius: 90,
                paddingAngle: 3,
                cornerRadius: 4,
                label: { visible: false },
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: {
                  innerRadius: 40,
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
            width={200}
            height={230}
          />

          <Stack spacing={1.2} sx={{ ml: 3 }}>
            {fullData.map((item, i) => (
              <Stack
                key={item.id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1.5}
                sx={{ minWidth: 180 }}
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
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

PrestadoresPorLocalidadModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fullData: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  colors: PropTypes.array.isRequired,
};
