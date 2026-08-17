import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { portalAfiliado } from '../../services/portal';

const FILTROS_VACIOS = {
  prestadorId: '',
  especialidadId: '',
  localidad: '',
  diaSemana: '',
  horaDesde: '',
  horaHasta: '',
};

const DIAS_SEMANA = [
  { valor: '', etiqueta: 'Cualquier día · próximos libres' },
  { valor: 'Lunes', etiqueta: 'Lunes' },
  { valor: 'Martes', etiqueta: 'Martes' },
  { valor: 'Miercoles', etiqueta: 'Miércoles' },
  { valor: 'Jueves', etiqueta: 'Jueves' },
  { valor: 'Viernes', etiqueta: 'Viernes' },
  { valor: 'Sabado', etiqueta: 'Sábado' },
  { valor: 'Domingo', etiqueta: 'Domingo' },
];

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
    String(primera.nombre || '').localeCompare(
      String(segunda.nombre || ''),
      'es'
    )
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

const formatearFecha = (valor) => {
  const fechaTexto = String(valor || '').slice(0, 10);
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaTexto);
  if (!coincidencia) return fechaTexto || 'Fecha sin informar';

  return `${coincidencia[3]}/${coincidencia[2]}/${coincidencia[1]}`;
};

const obtenerEtiquetaDia = (valor) =>
  DIAS_SEMANA.find((dia) => dia.valor === valor)?.etiqueta || valor || '';

export default function GestionTurnosAfiliado({
  integrantes,
  cartilla,
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
  const [textoPrestador, setTextoPrestador] = useState('');
  const [prestadorSeleccionado, setPrestadorSeleccionado] = useState(null);
  const [prestadoresSugeridos, setPrestadoresSugeridos] = useState([]);
  const [cargandoPrestadores, setCargandoPrestadores] = useState(false);

  const prestadoresParaOpciones = useMemo(
    () => (prestadorSeleccionado ? [prestadorSeleccionado] : cartilla),
    [cartilla, prestadorSeleccionado]
  );

  const especialidadesDisponibles = useMemo(
    () => obtenerEspecialidades(prestadoresParaOpciones),
    [prestadoresParaOpciones]
  );

  const localidadesDisponibles = useMemo(
    () => obtenerLocalidades(prestadoresParaOpciones),
    [prestadoresParaOpciones]
  );

  useEffect(() => {
    let activo = true;
    const texto = textoPrestador.trim();

    if (
      texto.length < 2 ||
      (prestadorSeleccionado && texto === prestadorSeleccionado.nombre)
    ) {
      setPrestadoresSugeridos(
        prestadorSeleccionado ? [prestadorSeleccionado] : []
      );
      setCargandoPrestadores(false);
      return undefined;
    }

    const temporizador = window.setTimeout(async () => {
      try {
        setCargandoPrestadores(true);
        const prestadores = await portalAfiliado.buscarPrestadores(texto);
        if (activo) setPrestadoresSugeridos(prestadores);
      } catch {
        if (activo) setPrestadoresSugeridos([]);
      } finally {
        if (activo) setCargandoPrestadores(false);
      }
    }, 300);

    return () => {
      activo = false;
      window.clearTimeout(temporizador);
    };
  }, [prestadorSeleccionado, textoPrestador]);

  useEffect(() => {
    let activo = true;

    const cargarProximosLibres = async () => {
      const resultado = await buscarDisponibilidad({ limite: 30 });
      if (activo && Array.isArray(resultado)) setBusquedaRealizada(true);
    };

    cargarProximosLibres();
    return () => {
      activo = false;
    };
  }, [buscarDisponibilidad]);

  const actualizarFiltro = (nombre, valor) => {
    setFiltros((actuales) => ({ ...actuales, [nombre]: valor }));
    setBusquedaRealizada(false);
  };

  const seleccionarPrestador = (prestador) => {
    setPrestadorSeleccionado(prestador);
    setTextoPrestador(prestador?.nombre || '');
    setFiltros((actuales) => ({
      ...actuales,
      prestadorId: obtenerId(prestador),
      especialidadId: '',
      localidad: '',
    }));
    setBusquedaRealizada(false);
  };

  const limpiarFiltros = async () => {
    setFiltros(FILTROS_VACIOS);
    setPrestadorSeleccionado(null);
    setTextoPrestador('');
    setPrestadoresSugeridos([]);

    const resultado = await buscarDisponibilidad({ limite: 30 });
    if (Array.isArray(resultado)) setBusquedaRealizada(true);
  };

  const ejecutarBusqueda = async () => {
    const resultado = await buscarDisponibilidad({ ...filtros, limite: 30 });
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
                Podés combinar médico, especialidad, localidad, día de la semana
                y horario. Si no elegís filtros, mostramos los próximos libres.
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
                <Autocomplete
                  fullWidth
                  options={prestadoresSugeridos}
                  value={prestadorSeleccionado}
                  inputValue={textoPrestador}
                  loading={cargandoPrestadores}
                  filterOptions={(opciones) => opciones}
                  getOptionLabel={(prestador) => prestador?.nombre || ''}
                  isOptionEqualToValue={(opcion, valor) =>
                    obtenerId(opcion) === obtenerId(valor)
                  }
                  onChange={(_evento, prestador) =>
                    seleccionarPrestador(prestador)
                  }
                  onInputChange={(_evento, valor, motivo) => {
                    setTextoPrestador(valor);
                    if (motivo === 'clear') seleccionarPrestador(null);
                  }}
                  noOptionsText={
                    textoPrestador.trim().length < 2
                      ? 'Escribí al menos 2 letras'
                      : 'No encontramos prestadores'
                  }
                  renderInput={(parametros) => (
                    <TextField
                      {...parametros}
                      label="Médico / prestador"
                      placeholder="Ej.: Hou, Grey, Torres"
                      InputProps={{
                        ...parametros.InputProps,
                        endAdornment: (
                          <>
                            {cargandoPrestadores ? (
                              <CircularProgress color="inherit" size={18} />
                            ) : null}
                            {parametros.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
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

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Día de la semana"
                  value={filtros.diaSemana}
                  onChange={(evento) =>
                    actualizarFiltro('diaSemana', evento.target.value)
                  }
                >
                  {DIAS_SEMANA.map((dia) => (
                    <MenuItem key={dia.valor || 'cualquiera'} value={dia.valor}>
                      {dia.etiqueta}
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
                Buscar turnos
              </Button>
              <Button onClick={limpiarFiltros}>Limpiar filtros</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {busquedaRealizada && horariosDisponibles.length === 0 && (
        <Alert severity="info">
          No encontramos turnos disponibles para los criterios seleccionados en
          las próximas semanas.
        </Alert>
      )}

      {horariosDisponibles.length > 0 && (
        <Box>
          <Typography variant="h6" mb={1}>
            Próximos turnos libres ({horariosDisponibles.length})
          </Typography>
          <Grid container spacing={2}>
            {horariosDisponibles.map((horario) => {
              const direccion = horario.centro?.direccionId;
              return (
                <Grid
                  key={`${horario.agendaId}-${horario.fecha}-${horario.hora}`}
                  size={{ xs: 12, md: 6 }}
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        {horario.prestador?.nombre}
                      </Typography>
                      <Typography fontWeight={600}>
                        {obtenerEtiquetaDia(horario.diaSemana)}{' '}
                        {formatearFecha(horario.fecha)} · {horario.hora}
                      </Typography>
                      <Typography>{horario.especialidad?.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {direccion
                          ? `${direccion.calle} ${direccion.altura} · ${direccion.localidad}`
                          : 'Centro de atención'}
                      </Typography>
                      <Button
                        sx={{ mt: 1 }}
                        onClick={() => reservarTurno(horario)}
                      >
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
                    {formatearFecha(turno.fecha)} · {turno.hora}
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
  afiliadoTurnoId: PropTypes.string.isRequired,
  setAfiliadoTurnoId: PropTypes.func.isRequired,
  horariosDisponibles: PropTypes.array.isRequired,
  buscarDisponibilidad: PropTypes.func.isRequired,
  reservarTurno: PropTypes.func.isRequired,
  turnos: PropTypes.array.isRequired,
  cancelarTurno: PropTypes.func.isRequired,
};
