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
import PropTypes from 'prop-types';

const formatearFecha = (valor) => {
  if (!valor) return '—';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return '—';
  return fecha.toLocaleDateString('es-AR', { timeZone: 'UTC' });
};

function TarjetaListado({ titulo, elementos, representar }) {
  return (
    <Card sx={{ height: '100%' }}>
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
                sx={{
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
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

TarjetaListado.propTypes = {
  titulo: PropTypes.string.isRequired,
  elementos: PropTypes.arrayOf(PropTypes.object).isRequired,
  representar: PropTypes.func.isRequired,
};

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
  const [periodoConsultado, setPeriodoConsultado] = useState(false);

  const cargarDatosGenerales = async () => {
    try {
      const [distribucionObtenida, prestadoresObtenidos] = await Promise.all([
        obtenerDistribucionPrestadores(),
        obtenerPrestadoresSinAgenda(),
      ]);
      setDistribucion(distribucionObtenida);
      setPrestadoresSinAgenda(prestadoresObtenidos);
    } catch (errorPeticion) {
      setError(errorPeticion.response?.data?.mensaje || errorPeticion.message);
    }
  };

  useEffect(() => {
    cargarDatosGenerales();
  }, []);

  const buscarPeriodo = async () => {
    try {
      setError('');

      if (desde && hasta && desde > hasta) {
        setError('La fecha desde no puede ser posterior a la fecha hasta.');
        return;
      }

      const [afiliadosObtenidos, prestadoresObtenidos] = await Promise.all([
        obtenerAltasAfiliados(desde, hasta),
        obtenerAltasPrestadores(desde, hasta),
      ]);
      setAfiliados(afiliadosObtenidos);
      setPrestadores(prestadoresObtenidos);
      setPeriodoConsultado(true);
    } catch (errorPeticion) {
      setError(errorPeticion.response?.data?.mensaje || errorPeticion.message);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Reportes administrativos</Typography>
        <Typography color="text.secondary">
          Consultá altas por período y el estado general de la red de
          prestadores.
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
              <Typography color="text.secondary">Altas de afiliados</Typography>
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

      {periodoConsultado && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TarjetaListado
              titulo={`Afiliados dados de alta (${afiliados.total})`}
              elementos={afiliados.elementos || []}
              representar={(elemento) => (
                <Box>
                  <Typography fontWeight={600}>
                    {elemento.nombre} {elemento.apellido}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    DNI {elemento.dni || '—'} · Credencial{' '}
                    {String(elemento.numeroAfiliado || '').padStart(7, '0')}-
                    {String(elemento.numeroIntegrante || '').padStart(2, '0')} ·
                    Plan {elemento.plan || '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Alta: {formatearFecha(elemento.fechaAlta)}
                  </Typography>
                </Box>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TarjetaListado
              titulo={`Prestadores dados de alta (${prestadores.total})`}
              elementos={prestadores.elementos || []}
              representar={(elemento) => (
                <Box>
                  <Typography fontWeight={600}>{elemento.nombre}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    CUIT/CUIL {elemento.cuilCuit || '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Alta: {formatearFecha(elemento.fechaAlta)}
                  </Typography>
                </Box>
              )}
            />
          </Grid>
        </Grid>
      )}

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
