import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
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
          Acceso denegado
        </Typography>

        <Typography variant="h5" sx={{ color: '#0b111e', mb: 1 }}>
          No tenés permiso para acceder a esta página
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          Es posible que el recurso esté restringido o que no tengas suficientes
          privilegios.
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#00AEEF',
            '&:hover': { backgroundColor: '#0089bf' },
            textTransform: 'none',
            mr: 2,
          }}
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </Button>

        <Button
          variant="outlined"
          sx={{
            textTransform: 'none',
            color: '#00AEEF',
            borderColor: '#00AEEF',
            '&:hover': {
              borderColor: '#0089bf',
              color: '#0089bf',
            },
          }}
          onClick={() => navigate(-1)}
        >
          Volver atrás
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
          src="../../../forbidden-doctor.png"
          alt="Forbidden doctor"
          style={{ width: '360px', maxWidth: '90%' }}
        />
      </Box>
    </Box>
  );
}
