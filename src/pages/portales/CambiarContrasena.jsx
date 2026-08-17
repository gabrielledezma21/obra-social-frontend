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
import { useNavigate } from 'react-router-dom';
import {
  cambiarContrasena,
  obtenerSesion,
} from '../../services/portal';

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
    <Box sx={{ maxWidth: 520, mx: 'auto', mt: 6, px: 2 }}>
      <Card>
        <CardContent>
          <Stack component="form" spacing={2} onSubmit={guardar}>
            <Typography variant="h4">Cambiar contraseña</Typography>
            <Alert severity="info">
              Por seguridad, antes de continuar debés reemplazar la contraseña
              temporal por una nueva.
            </Alert>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Contraseña actual"
              type="password"
              value={contrasenaActual}
              onChange={(evento) => setContrasenaActual(evento.target.value)}
              required
              helperText="Si es tu primer ingreso, tu contraseña actual es tu DNI."
            />
            <TextField
              label="Nueva contraseña"
              type="password"
              value={contrasenaNueva}
              onChange={(evento) => setContrasenaNueva(evento.target.value)}
              required
              helperText="Debe tener al menos 8 caracteres."
            />
            <TextField
              label="Repetir nueva contraseña"
              type="password"
              value={repeticion}
              onChange={(evento) => setRepeticion(evento.target.value)}
              required
            />
            <Button type="submit" variant="contained">
              Guardar contraseña
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
