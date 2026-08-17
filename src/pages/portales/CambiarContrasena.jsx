import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import IconoSeguridad from '@mui/icons-material/LockResetOutlined';
import { useNavigate } from 'react-router-dom';
import { cambiarContrasena, obtenerSesion } from '../../services/portal';

const obtenerRutaRol = (rol) => {
  if (rol === 'ADMIN') return '/';
  if (rol === 'PRESTADOR') return '/portal/prestador';
  return '/portal/afiliado';
};

export default function CambiarContrasena() {
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [repeticion, setRepeticion] = useState('');
  const [error, setError] = useState('');
  const navegar = useNavigate();

  const guardar = async (evento) => {
    evento.preventDefault();
    setError('');

    if (contrasenaNueva !== repeticion) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    try {
      await cambiarContrasena(contrasenaActual, contrasenaNueva);
      const { usuario } = obtenerSesion();
      navegar(obtenerRutaRol(usuario?.rol));
    } catch (errorPeticion) {
      setError(errorPeticion.response?.data?.mensaje || errorPeticion.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 620, mx: 'auto', mt: 2 }}>
      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack component="form" spacing={2.5} onSubmit={guardar}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  flexShrink: 0,
                }}
              >
                <IconoSeguridad />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={500}>
                  Cambiar contraseña
                </Typography>
                <Typography color="text.secondary">
                  Configurá tu contraseña personal para continuar.
                </Typography>
              </Box>
            </Stack>

            <Alert severity="info">
              Por seguridad, la contraseña temporal debe reemplazarse en el
              primer ingreso.
            </Alert>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Contraseña actual"
              type="password"
              value={contrasenaActual}
              onChange={(evento) => setContrasenaActual(evento.target.value)}
              required
              fullWidth
              helperText="Si es tu primer ingreso, tu contraseña actual es tu DNI."
            />
            <TextField
              label="Nueva contraseña"
              type="password"
              value={contrasenaNueva}
              onChange={(evento) => setContrasenaNueva(evento.target.value)}
              required
              fullWidth
              helperText="Debe tener al menos 8 caracteres."
            />
            <TextField
              label="Repetir nueva contraseña"
              type="password"
              value={repeticion}
              onChange={(evento) => setRepeticion(evento.target.value)}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" size="large">
              Guardar contraseña
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
