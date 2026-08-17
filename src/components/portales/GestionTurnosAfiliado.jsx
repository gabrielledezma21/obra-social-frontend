import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

const FILTROS_VACIOS = {
  prestadorId: '',
  especialidadId: '',
  localidad: '',
  horaDesde: '',
  horaHasta: '',
};

const obtenerId = (valor) => valor?._id ?? valor?.id ?? valor ?? '';

const obtenerEspecialidades = (prestadores) => {
  const especialidades = new Map();
  prestadores.forEach((prestador) => {
    (prestador.especialidades || []).forEach((especialidad) => {
      const id = obtenerId(especialidad);
      if (id && !especialidades.has(id)) {
        especialidades.set(id, especialidad);
      }
    });
  });
  return [...especialidades.values()].sort((primera, segunda) =>
    String(primera.nombre || '').localeCompare(String(segunda.nombre || ''), 'es')
  );
};

const obtenerLocalidades = (prestadores) => {
  const localidades = new Set();
  prestadores.forEach((prestador) => {
    (prestador.centrosDeAtencion || []).forEach((centro) => {
      const localidad = centro?.direccionId?.localidad;
      if (localidad) localidades.add(localidad);
    });
  });
  return [...localidades].sort((primera, segunda) =>
    primera.localeCompare(segunda, 'es')
  );
};

export default function GestionTurnosAfiliado({
  integrantes,
  cartilla,
  fechaTurno,
  setFechaTurno,
  afiliadoTurnoId,
  setAfiliadoTurnoId,
  horariosDisponibles,
  buscarDisponibilidad,
  reservarTurno,
  turnos,
  cancelarTurno,
}) {
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const prestadoresDisponibles = useMemo(
    () => [...cartilla].sort((primero, segundo) =>
      String(primero.nombre || '').localeCompare(String(segundo.nombre || ''), 'es')
    ),
    [cartilla]
  );

  const prestadoresParaOpciones = useMemo(() => {
    if (!filtros.prestadorId) return cartilla;
    return cartilla.filter(
      (prestador) => obtenerId(prestador) === filtros.prestadorId
    );
  }, [cartilla, filtros.prestadorId]);

  const especialidadesDisponibles = useMemo(
    () => obtenerEspecialidades(prestadoresParaOpciones),
    [prestadoresParaOpciones]
  );

  const localidadesDisponibles = useMemo(
    () => obtenerLocalidades(prestadoresParaOpciones),
    [prestadoresParaOpciones]
  );

  const actualizarFiltro = (nombre, valor) => {
    setFiltros((actuales) => ({ ...actuales, [nombre]: valor }));
    setBusquedaRealizada(false);
  };

  const seleccionarPrestador = (prestadorId) => {
    setFiltros((actuales) => ({
      ...actuales,
      prestadorId,
      especialidadId: '',
      localidad: '',
    }));
    setBusquedaRealizada(false);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_VACIOS);
    setBusquedaRealizada(false);
  };

  const ejecutarBusqueda = async () => {
    const resultado = await buscarDisponibilidad(filtros);
    if (Array.isArray(resultado)) setBusquedaRealizada(true);
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6">Buscar un turno</Typography>
              <Typography variant="body2" color="text.secondary">
                Podés combinar médico, especialidad, localidad y franja horaria.
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Integrante"
                  value={afiliadoTurnoId}
                  onChange={(evento) => setAfiliadoTurnoId(evento.target.value)}
                >
                  {integrantes.map((integrante) => (
                    <MenuItem key={integrante._id} value={integrante._id}>
                      {integrante.nombre} {integrante.apellido}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Fecha"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={fechaTurno}
                  onChange={(evento) => {
                    setFechaTurno(evento.target.value);
                    setBusquedaRealizada(false);
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Médico / prestador"
                  value={filtros.prestadorId}
                  onChange={(evento) => seleccionarPrestador(evento.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {prestadoresDisponibles.map((prestador) => (
                    <MenuItem key={obtenerId(prestador)} value={obtenerId(prestador)}>
                      {prestador.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Especialidad"
                  value={filtros.especialidadId}
                  onChange={(evento) =>
                    actualizarFiltro('especialidadId', evento.target.value)
                  }
                >
                  <MenuItem value="">Todas</MenuItem>
                  {especialidadesDisponibles.map((especialidad) => (
                    <MenuItem
                      key={obtenerId(especialidad)}
                      value={obtenerId(especialidad)}
                    >
                      {especialidad.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Localidad"
                  value={filtros.localidad}
                  onChange={(evento) =>
                    actualizarFiltro('localidad', evento.target.value)
                  }
                >
                  <MenuItem value="">Todas</MenuItem>
                  {localidadesDisponibles.map((localidad) => (
                    <MenuItem key={localidad} value={localidad}>
                      {localidad}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  fullWidth
                  label="Desde las"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={filtros.horaDesde}
                  onChange={(evento) =>
                    actualizarFiltro('horaDesde', evento.target.value)
                  }
                />
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  fullWidth
                  label="Hasta las"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={filtros.horaHasta}
                  onChange={(evento) =>
                    actualizarFiltro('horaHasta', evento.target.value)
                  }
                />
              </Grid>
            </Grid>

            <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
              <Button variant="contained" onClick={ejecutarBusqueda}>
                Buscar disponibilidad
              </Button>
              <Button onClick={limpiarFiltros}>Limpiar filtros</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {busquedaRealizada && horariosDisponibles.length === 0 && (
        <Alert severity="info">
          No encontramos turnos disponibles para los criterios seleccionados.
        </Alert>
      )}

      {horariosDisponibles.length > 0 && (
        <Box>
          <Typography variant="h6" mb={1}>
            Horarios disponibles ({horariosDisponibles.length})
          </Typography>
          <Grid container spacing={2}>
            {horariosDisponibles.map((horario) => {
              const direccion = horario.centro?.direccionId;
              return (
                <Grid
                  key={`${horario.agendaId}-${horario.hora}`}
                  size={{ xs: 12, md: 6 }}
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        {horario.prestador?.nombre}
                      </Typography>
                      <Typography>
                        {horario.especialidad?.nombre} · {horario.hora}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {direccion
                          ? `${direccion.calle} ${direccion.altura} · ${direccion.localidad}`
                          : 'Centro de atención'}
                      </Typography>
                      <Button sx={{ mt: 1 }} onClick={() => reservarTurno(horario)}>
                        Reservar
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      <Box>
        <Typography variant="h6" mb={1}>
          Mis turnos
        </Typography>
        <Stack spacing={2}>
          {turnos.length === 0 ? (
            <Alert severity="info">No hay turnos registrados.</Alert>
          ) : (
            turnos.map((turno) => (
              <Card key={turno._id}>
                <CardContent>
                  <Typography variant="h6">
                    {turno.prestadorId?.nombre}
                  </Typography>
                  <Typography>
                    {new Date(turno.fecha).toLocaleDateString('es-AR')} ·{' '}
                    {turno.hora}
                  </Typography>
                  <Chip sx={{ mt: 1 }} label={turno.estado} />
                  {turno.estado === 'RESERVADO' && (
                    <Button
                      sx={{ ml: 1, mt: 1 }}
                      onClick={() => cancelarTurno(turno._id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

GestionTurnosAfiliado.propTypes = {
  integrantes: PropTypes.array.isRequired,
  cartilla: PropTypes.array.isRequired,
  fechaTurno: PropTypes.string.isRequired,
  setFechaTurno: PropTypes.func.isRequired,
  afiliadoTurnoId: PropTypes.string.isRequired,
  setAfiliadoTurnoId: PropTypes.func.isRequired,
  horariosDisponibles: PropTypes.array.isRequired,
  buscarDisponibilidad: PropTypes.func.isRequired,
  reservarTurno: PropTypes.func.isRequired,
  turnos: PropTypes.array.isRequired,
  cancelarTurno: PropTypes.func.isRequired,
};
