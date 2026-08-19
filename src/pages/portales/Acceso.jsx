import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import IconoAdministracion from '@mui/icons-material/AdminPanelSettingsOutlined';
import IconoAfiliado from '@mui/icons-material/PersonOutline';
import IconoPrestador from '@mui/icons-material/MedicalServicesOutlined';
import IconoFlecha from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
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
    icono: IconoAdministracion,
  },
  {
    rol: 'AFILIADO',
    titulo: 'Afiliados',
    descripcion: 'Cartilla médica, turnos y solicitudes.',
    icono: IconoAfiliado,
  },
  {
    rol: 'PRESTADOR',
    titulo: 'Prestadores',
    descripcion: 'Agendas, próximos turnos e historias clínicas.',
    icono: IconoPrestador,
  },
];

const CREDENCIALES_DEMO = {
  ADMIN: {
    usuario: 'admin@medintegral.com',
    contrasena: 'Admin1234',
  },
  AFILIADO: {
    usuario: 'homero@simpson.com',
    contrasena: 'Demo1234',
  },
  PRESTADOR: {
    usuario: 'house@medical.com',
    contrasena: 'Demo1234',
  },
};

const obtenerRutaRol = (rol) => {
  if (rol === 'ADMIN') return '/administracion';
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
      <Box sx={{ mt: 2 }}>
        <PageHeader
          title="Acceso a MedIntegral"
          subtitle="Seleccioná el espacio correspondiente para continuar"
        />

        <Grid container spacing={3}>
          {OPCIONES_ROL.map((opcion) => {
            const Icono = opcion.icono;
            return (
              <Grid key={opcion.rol} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
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
                        mb: 2,
                      }}
                    >
                      <Icono />
                    </Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {opcion.titulo}
                    </Typography>
                    <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
                      {opcion.descripcion}
                    </Typography>
                    <Button
                      variant="contained"
                      endIcon={<IconoFlecha />}
                      sx={{ mt: 3, alignSelf: 'flex-start' }}
                      onClick={() => seleccionarRol(opcion.rol)}
                    >
                      Ingresar
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="center"
          alignItems="center"
          spacing={1.5}
          sx={{ mt: 3 }}
        >
          <Typography color="text.secondary">
            ¿Ya tenés un turno reservado?
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navegar('/turnos/gestionar')}
          >
            Gestionar turno con código
          </Button>
        </Stack>
      </Box>
    );
  }

  const opcionActual = OPCIONES_ROL.find(
    (opcion) => opcion.rol === rolSeleccionado
  );
  const permiteActivacion = rolSeleccionado !== 'ADMIN';
  const IconoActual = opcionActual.icono;
  const credencialesActuales = CREDENCIALES_DEMO[rolSeleccionado];

  return (
    <Box sx={{ maxWidth: 620, mx: 'auto', mt: 2 }}>
      <Button
        variant="text"
        sx={{ mb: 2 }}
        onClick={() => setRolSeleccionado(null)}
      >
        ← Volver a tipos de acceso
      </Button>

      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack component="form" spacing={2.5} onSubmit={enviarFormulario}>
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
                <IconoActual />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={500}>
                  {opcionActual.titulo}
                </Typography>
                <Typography color="text.secondary">
                  {opcionActual.descripcion}
                </Typography>
              </Box>
            </Stack>

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
                <Alert severity="info" variant="outlined">
                  <Typography fontWeight={600} sx={{ mb: 0.5 }}>
                    Credenciales de demostración
                  </Typography>
                  <Typography variant="body2">
                    Usuario: <strong>{credencialesActuales.usuario}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Contraseña:{' '}
                    <strong>{credencialesActuales.contrasena}</strong>
                  </Typography>
                </Alert>
                <TextField
                  label={rolSeleccionado === 'ADMIN' ? 'Email' : 'DNI o email'}
                  value={identificador}
                  onChange={(evento) => setIdentificador(evento.target.value)}
                  required
                  autoComplete="username"
                  fullWidth
                />
                <TextField
                  label="Contraseña"
                  type="password"
                  value={contrasena}
                  onChange={(evento) => setContrasena(evento.target.value)}
                  required
                  autoComplete="current-password"
                  fullWidth
                  helperText={
                    permiteActivacion
                      ? 'En el primer ingreso, la contraseña temporal es tu DNI.'
                      : ''
                  }
                />
                <Button variant="contained" type="submit" size="large">
                  Ingresar
                </Button>
              </>
            ) : (
              <>
                <Alert severity="info">
                  El DNI y el email deben coincidir con los datos cargados por
                  Administración.
                </Alert>
                <TextField
                  label="DNI"
                  value={dni}
                  onChange={(evento) => setDni(evento.target.value)}
                  required
                  fullWidth
                  inputProps={{ inputMode: 'numeric' }}
                />
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  required
                  fullWidth
                />
                <Button variant="contained" type="submit" size="large">
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
