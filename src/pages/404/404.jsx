import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './404.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 3, md: 10 },
        textAlign: { xs: 'center', md: 'left' },
        gap: 4,
      }}
    >
      <Box>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ color: '#0b111e', mb: 2 }}
        >
          ¡Lo sentimos!
        </Typography>

        <Typography variant="h5" sx={{ color: '#0b111e', mb: 1 }}>
          La página que buscás no existe
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          Es posible que el recurso no exista o haya sido movido.
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#00AEEF',
            '&:hover': { backgroundColor: '#0089bf' },
            textTransform: 'none',
          }}
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </Button>
      </Box>

      <Box
        className="floating"
        sx={{
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
        }}
      >
        <img
          src="../../../not-found-doctor.png"
          alt="Not found doctor"
          style={{ width: '360px', maxWidth: '90%' }}
        />
      </Box>
    </Box>
  );
}
