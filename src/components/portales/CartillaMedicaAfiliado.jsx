import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const normalizarTexto = (valor) =>
  String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim();

const obtenerDireccion = (centro) => {
  const direccion = centro?.direccionId;
  if (!direccion) return 'Centro de atención';

  return [
    `${direccion.calle || ''} ${direccion.altura || ''}`.trim(),
    direccion.localidad,
  ]
    .filter(Boolean)
    .join(' · ');
};

const obtenerEmail = (email) => email?.direccion || String(email || '');
const obtenerTelefono = (telefono) => telefono?.numero || String(telefono || '');

const coincideBusqueda = (prestador, busqueda) => {
  const texto = normalizarTexto(busqueda);
  if (!texto) return true;

  const valores = [
    prestador.nombre,
    prestador.cuilCuit,
    prestador.esCentroMedico ? 'Centro médico' : 'Médico',
    ...(prestador.especialidades || []).map((especialidad) => especialidad.nombre),
    ...(prestador.centrosDeAtencion || []).flatMap((centro) => [
      centro?.direccionId?.calle,
      centro?.direccionId?.localidad,
    ]),
    ...(prestador.telefonos || []).map(obtenerTelefono),
    ...(prestador.emails || []).map(obtenerEmail),
  ];

  return valores.some((valor) => normalizarTexto(valor).includes(texto));
};

export default function CartillaMedicaAfiliado({ cartilla }) {
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(0);
  const [filasPorPagina, setFilasPorPagina] = useState(10);

  const prestadoresFiltrados = useMemo(
    () => cartilla.filter((prestador) => coincideBusqueda(prestador, busqueda)),
    [busqueda, cartilla]
  );

  const prestadoresVisibles = useMemo(() => {
    const inicio = pagina * filasPorPagina;
    return prestadoresFiltrados.slice(inicio, inicio + filasPorPagina);
  }, [filasPorPagina, pagina, prestadoresFiltrados]);

  const cambiarBusqueda = (evento) => {
    setBusqueda(evento.target.value);
    setPagina(0);
  };

  const cambiarFilasPorPagina = (evento) => {
    setFilasPorPagina(Number(evento.target.value));
    setPagina(0);
  };

  return (
    <StackCartilla>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Cartilla médica
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Buscá prestadores por nombre, especialidad, localidad o contacto.
        </Typography>
      </Box>

      <TextField
        fullWidth
        value={busqueda}
        onChange={cambiarBusqueda}
        placeholder="Buscar prestador, especialidad o localidad"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      <Paper
        sx={{
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Prestador</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tipo de prestador</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Especialidades</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Direcciones</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Teléfonos</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Emails</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prestadoresVisibles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography>No se encontraron prestadores.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                prestadoresVisibles.map((prestador) => (
                  <TableRow hover key={prestador._id || prestador.id}>
                    <TableCell>
                      <Typography fontWeight={600}>{prestador.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {prestador.cuilCuit}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {prestador.esCentroMedico ? 'Centro médico' : 'Médico'}
                    </TableCell>
                    <TableCell>
                      {(prestador.especialidades || []).length > 0 ? (
                        (prestador.especialidades || []).map((especialidad) => (
                          <Typography
                            key={especialidad._id || especialidad.id || especialidad.nombre}
                            variant="body2"
                          >
                            • {especialidad.nombre}
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin especialidades
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {(prestador.centrosDeAtencion || []).length > 0 ? (
                        (prestador.centrosDeAtencion || []).map((centro) => (
                          <Box
                            key={centro._id || centro.id || obtenerDireccion(centro)}
                            sx={{ display: 'flex', gap: 1, mb: 0.75 }}
                          >
                            <LocationOnIcon
                              sx={{ fontSize: 18, color: 'text.secondary', mt: 0.2 }}
                            />
                            <Typography variant="body2">
                              {obtenerDireccion(centro)}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin direcciones
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {(prestador.telefonos || []).length > 0 ? (
                        (prestador.telefonos || []).map((telefono, indice) => (
                          <Box
                            key={`${obtenerTelefono(telefono)}-${indice}`}
                            sx={{ display: 'flex', gap: 1, mb: 0.75 }}
                          >
                            <PhoneIphoneIcon
                              sx={{ fontSize: 18, color: 'text.secondary', mt: 0.2 }}
                            />
                            <Typography variant="body2">
                              {obtenerTelefono(telefono)}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin teléfonos
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {(prestador.emails || []).length > 0 ? (
                        (prestador.emails || []).map((email, indice) => (
                          <Box
                            key={`${obtenerEmail(email)}-${indice}`}
                            sx={{ display: 'flex', gap: 1, mb: 0.75 }}
                          >
                            <MailOutlineIcon
                              sx={{ fontSize: 18, color: 'text.secondary', mt: 0.2 }}
                            />
                            <Typography variant="body2">
                              {obtenerEmail(email)}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin emails
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={prestadoresFiltrados.length}
          rowsPerPage={filasPorPagina}
          page={pagina}
          onPageChange={(_evento, nuevaPagina) => setPagina(nuevaPagina)}
          onRowsPerPageChange={cambiarFilasPorPagina}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      </Paper>
    </StackCartilla>
  );
}

function StackCartilla({ children }) {
  return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</Box>;
}

StackCartilla.propTypes = {
  children: PropTypes.node.isRequired,
};

CartillaMedicaAfiliado.propTypes = {
  cartilla: PropTypes.array.isRequired,
};
