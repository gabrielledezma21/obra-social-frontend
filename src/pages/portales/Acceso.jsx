import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  iniciarSesionPortal,
  registrarAfiliado,
  registrarPrestador,
} from '../../services/portal';

export default function AccesoPortales() {
  const [pestana, setPestana] = useState(0);
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('AFILIADO');
  const [entidadId, setEntidadId] = useState('');
  const [error, setError] = useState('');
  const navegar = useNavigate();

  const irAlPortal = (usuario) =>
    navegar(
      usuario.rol === 'PRESTADOR'
        ? '/portal/prestador'
        : '/portal/afiliado'
    );

  const enviarFormulario = async (evento) => {
    evento.preventDefault();
    setError('');

    try {
      if (pestana === 0) {
        const { usuario } = await iniciarSesionPortal(email, contrasena);
        irAlPortal(usuario);
        return;
      }

      const resultado =
        rol === 'AFILIADO'
          ? await registrarAfiliado({ afiliadoId: entidadId, email, contrasena })
          : await registrarPrestador({ prestadorId: entidadId, email, contrasena });
      irAlPortal(resultado.usuario);
    } catch (errorPeticion) {
      setError(
        errorPeticion.response?.data?.mensaje || errorPeticion.message
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Stack component="form" spacing={2} onSubmit={enviarFormulario}>
            <Typography variant="h4">Acceso MedIntegral</Typography>
            <Typography color="text.secondary">
              Aplicación 2 para afiliados y Aplicación 3 para prestadores.
            </Typography>
            <Tabs
              value={pestana}
              onChange={(_evento, valor) => {
                setPestana(valor);
                setError('');
              }}
            >
              <Tab label="Ingresar" />
              <Tab label="Registrarme" />
            </Tabs>
            {error && <Alert severity="error">{error}</Alert>}

            {pestana === 1 && (
              <>
                <TextField
                  select
                  label="Tipo de usuario"
                  value={rol}
                  onChange={(evento) => setRol(evento.target.value)}
                >
                  <MenuItem value="AFILIADO">Afiliado</MenuItem>
                  <MenuItem value="PRESTADOR">Prestador</MenuItem>
                </TextField>
                <TextField
                  label={
                    rol === 'AFILIADO'
                      ? 'ID del afiliado'
                      : 'ID del prestador'
                  }
                  value={entidadId}
                  onChange={(evento) => setEntidadId(evento.target.value)}
                  required
                  helperText={
                    rol === 'AFILIADO'
                      ? 'El afiliado debe existir previamente en Administración. Los menores de 16 años no pueden registrarse.'
                      : 'El prestador debe existir previamente en Administración.'
                  }
                />
              </>
            )}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              value={contrasena}
              onChange={(evento) => setContrasena(evento.target.value)}
              required
              helperText={pestana === 1 ? 'Mínimo 8 caracteres' : ''}
            />
            <Button variant="contained" type="submit">
              {pestana === 0 ? 'Ingresar' : 'Crear cuenta'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
