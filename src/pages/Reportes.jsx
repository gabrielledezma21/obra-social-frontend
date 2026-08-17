import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  obtenerAltasAfiliados,
  obtenerAltasPrestadores,
  obtenerDistribucionPrestadores,
  obtenerPrestadoresSinAgenda,
} from '../services/reportes';

function TarjetaListado({ titulo, elementos, representar }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={2}>
          {titulo}
        </Typography>
        {elementos.length ? (
          <Stack spacing={1}>
            {elementos.map((elemento, indice) => (
              <Box
                key={
                  elemento._id ||
                  elemento.nombre ||
                  elemento.codigoPostal ||
                  indice
                }
              >
                {representar(elemento)}
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">Sin resultados.</Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function Reportes() {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [afiliados, setAfiliados] = useState({ total: 0, elementos: [] });
  const [prestadores, setPrestadores] = useState({ total: 0, elementos: [] });
  const [distribucion, setDistribucion] = useState({
    porEspecialidad: [],
    porCodigoPostal: [],
  });
  const [prestadoresSinAgenda, setPrestadoresSinAgenda] = useState([]);
  const [error, setError] = useState('');

  const cargarDatosGenerales = async () => {
    try {
      const [distribucionObtenida, prestadoresObtenidos] = await Promise.all([
        obtenerDistribucionPrestadores(),
        obtenerPrestadoresSinAgenda(),
      ]);
      setDistribucion(distribucionObtenida);
      setPrestadoresSinAgenda(prestadoresObtenidos);
    } catch (errorPeticion) {
      setError(
        errorPeticion.response?.data?.mensaje || errorPeticion.message
      );
    }
  };

  useEffect(() => {
    cargarDatosGenerales();
  }, []);

  const buscarPeriodo = async () => {
    try {
      setError('');
      const [afiliadosObtenidos, prestadoresObtenidos] = await Promise.all([
        obtenerAltasAfiliados(desde, hasta),
        obtenerAltasPrestadores(desde, hasta),
      ]);
      setAfiliados(afiliadosObtenidos);
      setPrestadores(prestadoresObtenidos);
    } catch (errorPeticion) {
      setError(
        errorPeticion.response?.data?.mensaje || errorPeticion.message
      );
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Reportes administrativos</Typography>
        <Typography color="text.secondary">
          Consultas requeridas por la Aplicación 1 de MedIntegral.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Desde"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={desde}
              onChange={(evento) => setDesde(evento.target.value)}
            />
            <TextField
              label="Hasta"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={hasta}
              onChange={(evento) => setHasta(evento.target.value)}
            />
            <Button variant="contained" onClick={buscarPeriodo}>
              Consultar altas
            </Button>
          </Stack>

          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="h5">{afiliados.total}</Typography>
              <Typography color="text.secondary">
                Altas de afiliados
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="h5">{prestadores.total}</Typography>
              <Typography color="text.secondary">
                Altas de prestadores
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TarjetaListado
            titulo="Prestadores por especialidad"
            elementos={distribucion.porEspecialidad || []}
            representar={(elemento) => (
              <Typography>
                {elemento.nombre}: <strong>{elemento.cantidad}</strong>
              </Typography>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TarjetaListado
            titulo="Prestadores por código postal"
            elementos={distribucion.porCodigoPostal || []}
            representar={(elemento) => (
              <Typography>
                {elemento.codigoPostal}: <strong>{elemento.cantidad}</strong>
              </Typography>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TarjetaListado
            titulo="Prestadores sin agendas"
            elementos={prestadoresSinAgenda}
            representar={(elemento) => (
              <Typography>
                {elemento.nombre} · {elemento.cuilCuit}
              </Typography>
            )}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
