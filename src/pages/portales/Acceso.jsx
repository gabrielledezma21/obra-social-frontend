import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  activarCuentaAfiliado,
  activarCuentaPrestador,
  iniciarSesion,
} from '../../services/portal';

const OPCIONES_ROL = [
  {
    rol: 'ADMIN',
    titulo: 'Administración',
    descripcion: 'Afiliados, prestadores, agendas y reportes.',
  },
  {
    rol: 'AFILIADO',
    titulo: 'Afiliados',
    descripcion: 'Cartilla médica, turnos y solicitudes.',
  },
  {
    rol: 'PRESTADOR',
    titulo: 'Prestadores',
    descripcion: 'Agendas, próximos turnos e historias clínicas.',
  },
];

const obtenerRutaRol = (rol) => {
  if (rol === 'ADMIN') return '/';
  if (rol === 'PRESTADOR') return '/portal/prestador';
  return '/portal/afiliado';
};

export default function AccesoPortales() {
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [pestana, setPestana] = useState(0);
  const [identificador, setIdentificador] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navegar = useNavigate();

  const seleccionarRol = (rol) => {
    setRolSeleccionado(rol);
    setPestana(0);
    setIdentificador('');
    setDni('');
    setEmail('');
    setContrasena('');
    setError('');
    setMensaje('');
  };

  const ingresar = async () => {
    const { usuario } = await iniciarSesion(
      identificador,
      contrasena,
      rolSeleccionado
    );

    if (usuario.debeCambiarContrasena) {
      navegar('/cambiar-contrasena');
      return;
    }

    navegar(obtenerRutaRol(usuario.rol));
  };

  const activarCuenta = async () => {
    const resultado =
      rolSeleccionado === 'AFILIADO'
        ? await activarCuentaAfiliado(dni, email)
        : await activarCuentaPrestador(dni, email);

    setMensaje(resultado.mensaje);
    setPestana(0);
    setIdentificador(dni);
    setContrasena('');
  };

  const enviarFormulario = async (evento) => {
    evento.preventDefault();
    setError('');
    setMensaje('');

    try {
      if (pestana === 0) {
        await ingresar();
      } else {
        await activarCuenta();
      }
    } catch (errorPeticion) {
      setError(errorPeticion.response?.data?.mensaje || errorPeticion.message);
    }
  };

  if (!rolSeleccionado) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, px: 2 }}>
        <Stack spacing={3}>
          <Box textAlign="center">
            <Typography variant="h3" gutterBottom>
              MedIntegral
            </Typography>
            <Typography color="text.secondary" variant="h6">
              Elegí cómo querés ingresar
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            {OPCIONES_ROL.map((opcion) => (
              <Card key={opcion.rol} sx={{ flex: 1 }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h5">{opcion.titulo}</Typography>
                    <Typography color="text.secondary">
                      {opcion.descripcion}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => seleccionarRol(opcion.rol)}
                    >
                      Ingresar como {opcion.titulo.toLowerCase()}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Box>
    );
  }

  const opcionActual = OPCIONES_ROL.find(
    (opcion) => opcion.rol === rolSeleccionado
  );
  const permiteActivacion = rolSeleccionado !== 'ADMIN';

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', mt: 6, px: 2 }}>
      <Card>
        <CardContent>
          <Stack component="form" spacing={2} onSubmit={enviarFormulario}>
            <Button
              variant="text"
              sx={{ alignSelf: 'flex-start' }}
              onClick={() => setRolSeleccionado(null)}
            >
              ← Cambiar tipo de acceso
            </Button>

            <Typography variant="h4">{opcionActual.titulo}</Typography>
            <Typography color="text.secondary">
              {opcionActual.descripcion}
            </Typography>

            {permiteActivacion && (
              <Tabs
                value={pestana}
                onChange={(_evento, valor) => {
                  setPestana(valor);
                  setError('');
                  setMensaje('');
                }}
              >
                <Tab label="Ingresar" />
                <Tab label="Activar cuenta" />
              </Tabs>
            )}

            <Divider />
            {error && <Alert severity="error">{error}</Alert>}
            {mensaje && <Alert severity="success">{mensaje}</Alert>}

            {pestana === 0 ? (
              <>
                <TextField
                  label={
                    rolSeleccionado === 'ADMIN' ? 'Email' : 'DNI o email'
                  }
                  value={identificador}
                  onChange={(evento) => setIdentificador(evento.target.value)}
                  required
                  autoComplete="username"
                />
                <TextField
                  label="Contraseña"
                  type="password"
                  value={contrasena}
                  onChange={(evento) => setContrasena(evento.target.value)}
                  required
                  autoComplete="current-password"
                  helperText={
                    permiteActivacion
                      ? 'En el primer ingreso, la contraseña temporal es tu DNI.'
                      : ''
                  }
                />
                <Button variant="contained" type="submit">
                  Ingresar
                </Button>
              </>
            ) : (
              <>
                <Alert severity="info">
                  Para activar tu cuenta, el DNI y el email deben coincidir con
                  los datos cargados previamente por Administración.
                </Alert>
                <TextField
                  label="DNI"
                  value={dni}
                  onChange={(evento) => setDni(evento.target.value)}
                  required
                  inputProps={{ inputMode: 'numeric' }}
                />
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  required
                />
                <Button variant="contained" type="submit">
                  Activar cuenta
                </Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
