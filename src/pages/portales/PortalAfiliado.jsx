import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { limpiarSesion, portalAfiliado } from '../../services/portal';
import PropTypes from 'prop-types';
import GestionTurnosAfiliado from '../../components/portales/GestionTurnosAfiliado';

const FORMULARIO_VACIO = {
  tipo: 'RECETA',
  afiliadoId: '',
  medicamento: '',
  cantidad: 1,
  presentacion: '',
  observaciones: '',
  prestadorId: '',
  especialidadId: '',
  formaPago: 'EFECTIVO',
  fechaPrestacion: '',
  lugar: '',
  facturaFecha: '',
  facturaCuit: '',
  facturaTotal: '',
  facturaPersona: '',
  cbu: '',
  diasInternacion: '',
};

const obtenerId = (valor) => valor?._id ?? valor?.id ?? valor ?? '';

const obtenerMensajeError = (error) =>
  error.response?.data?.mensaje ||
  error.message ||
  'Ocurrió un error inesperado';

function Estadistica({ etiqueta, valor }) {
  return (
    <Card>
      <CardContent>
        <Typography color="text.secondary">{etiqueta}</Typography>
        <Typography variant="h4">{valor ?? 0}</Typography>
      </CardContent>
    </Card>
  );
}

Estadistica.propTypes = {
  etiqueta: PropTypes.string.isRequired,
  valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default function PortalAfiliado() {
  const [pestana, setPestana] = useState(0);
  const [perfil, setPerfil] = useState(null);
  const [resumen, setResumen] = useState({});
  const [solicitudes, setSolicitudes] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [cartilla, setCartilla] = useState([]);
  const [error, setError] = useState('');
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [solicitudEditandoId, setSolicitudEditandoId] = useState(null);
  const [afiliadoTurnoId, setAfiliadoTurnoId] = useState('');
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const navegar = useNavigate();

  const cargarDatos = async () => {
    try {
      const [
        perfilObtenido,
        resumenObtenido,
        solicitudesObtenidas,
        turnosObtenidos,
        cartillaObtenida,
      ] = await Promise.all([
        portalAfiliado.obtenerPerfil(),
        portalAfiliado.obtenerResumen(),
        portalAfiliado.obtenerSolicitudes(),
        portalAfiliado.obtenerTurnos(),
        portalAfiliado.obtenerCartilla(),
      ]);

      setPerfil(perfilObtenido);
      setResumen(resumenObtenido);
      setSolicitudes(solicitudesObtenidas);
      setTurnos(turnosObtenidos);
      setCartilla(cartillaObtenida);
      setFormulario((formularioActual) => ({
        ...formularioActual,
        afiliadoId: formularioActual.afiliadoId || perfilObtenido?._id || '',
      }));
      setAfiliadoTurnoId(
        (afiliadoActualId) => afiliadoActualId || perfilObtenido?._id || ''
      );
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const integrantes = [perfil, ...(perfil?.familiares || [])].filter(Boolean);
  const prestadorSeleccionado = useMemo(
    () =>
      cartilla.find(
        (prestador) => obtenerId(prestador) === formulario.prestadorId
      ),
    [cartilla, formulario.prestadorId]
  );
  const especialidades = prestadorSeleccionado?.especialidades || [];

  const construirDatosSolicitud = () => {
    let datos;

    if (formulario.tipo === 'RECETA') {
      datos = {
        medicamento: formulario.medicamento,
        cantidad: Number(formulario.cantidad),
        presentacion: formulario.presentacion,
      };
    } else if (formulario.tipo === 'REINTEGRO') {
      datos = {
        fechaPrestacion: formulario.fechaPrestacion,
        lugar: formulario.lugar,
        factura: {
          fecha: formulario.facturaFecha,
          cuit: formulario.facturaCuit,
          total: Number(formulario.facturaTotal),
          personaFacturada: formulario.facturaPersona,
        },
        formaPago: formulario.formaPago,
        cbu:
          formulario.formaPago === 'TRANSFERENCIA' ? formulario.cbu : undefined,
      };
    } else {
      datos = {
        fechaPrestacion: formulario.fechaPrestacion,
        lugar: formulario.lugar,
        diasInternacion: Number(formulario.diasInternacion || 0),
      };
    }

    return {
      tipo: formulario.tipo,
      afiliadoId: formulario.afiliadoId,
      prestadorId: formulario.tipo === 'RECETA' ? null : formulario.prestadorId,
      especialidadId:
        formulario.tipo === 'RECETA' ? null : formulario.especialidadId,
      datos,
      observaciones: formulario.observaciones,
    };
  };

  const limpiarFormulario = () => {
    setSolicitudEditandoId(null);
    setFormulario({
      ...FORMULARIO_VACIO,
      afiliadoId: perfil?._id || '',
    });
  };

  const guardarSolicitud = async () => {
    try {
      const datosSolicitud = construirDatosSolicitud();

      if (solicitudEditandoId) {
        await portalAfiliado.modificarSolicitud(
          solicitudEditandoId,
          datosSolicitud
        );
      } else {
        await portalAfiliado.crearSolicitud(datosSolicitud);
      }

      limpiarFormulario();
      await cargarDatos();
      setPestana(1);
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const editarSolicitud = (solicitud) => {
    const datos = solicitud.datos || {};
    const factura = datos.factura || {};

    setFormulario({
      ...FORMULARIO_VACIO,
      tipo: solicitud.tipo,
      afiliadoId: obtenerId(solicitud.afiliadoId),
      prestadorId: obtenerId(solicitud.prestadorId),
      especialidadId: obtenerId(solicitud.especialidadId),
      observaciones: solicitud.observaciones || '',
      medicamento: datos.medicamento || '',
      cantidad: datos.cantidad || 1,
      presentacion: datos.presentacion || '',
      fechaPrestacion: datos.fechaPrestacion
        ? String(datos.fechaPrestacion).slice(0, 10)
        : '',
      lugar: datos.lugar || '',
      facturaFecha: factura.fecha ? String(factura.fecha).slice(0, 10) : '',
      facturaCuit: factura.cuit || '',
      facturaTotal: factura.total || '',
      facturaPersona: factura.personaFacturada || '',
      formaPago: datos.formaPago || 'EFECTIVO',
      cbu: datos.cbu || '',
      diasInternacion: datos.diasInternacion || '',
    });
    setSolicitudEditandoId(solicitud._id);
    setPestana(0);
  };

  const responderObservacion = async (id) => {
    const texto = window.prompt('Escribí la respuesta a la observación');
    if (!texto) return;

    try {
      await portalAfiliado.responderObservacion(id, texto);
      await cargarDatos();
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const eliminarSolicitud = async (id) => {
    if (!window.confirm('¿Eliminar esta solicitud recibida?')) return;

    try {
      await portalAfiliado.eliminarSolicitud(id);
      await cargarDatos();
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const buscarDisponibilidad = useCallback(async (filtros = {}) => {
    try {
      setError('');
      const horarios = await portalAfiliado.obtenerDisponibilidad(filtros);
      setHorariosDisponibles(horarios);
      return horarios;
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
      return null;
    }
  }, []);
  const reservarTurno = async (horario) => {
    try {
      await portalAfiliado.reservarTurno({
        agendaId: horario.agendaId,
        afiliadoId: afiliadoTurnoId,
        fecha: horario.fecha,
        hora: horario.hora,
      });

      setHorariosDisponibles((horariosActuales) =>
        horariosActuales.filter(
          (horarioActual) =>
            !(
              horarioActual.agendaId === horario.agendaId &&
              horarioActual.fecha === horario.fecha &&
              horarioActual.hora === horario.hora
            )
        )
      );
      await cargarDatos();
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const cancelarTurno = async (id) => {
    try {
      await portalAfiliado.cancelarTurno(id);
      await cargarDatos();
    } catch (errorPeticion) {
      setError(obtenerMensajeError(errorPeticion));
    }
  };

  const cerrarSesion = () => {
    limpiarSesion();
    navegar('/portal/acceso');
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        gap={2}
      >
        <Box>
          <Typography variant="h4">Portal del afiliado</Typography>
          <Typography color="text.secondary">
            {perfil
              ? `${perfil.nombre} ${perfil.apellido} · Credencial ${String(
                  perfil.numeroAfiliado || ''
                ).padStart(7, '0')}-${String(
                  perfil.numeroIntegrante || ''
                ).padStart(2, '0')}`
              : 'Cargando...'}
          </Typography>
        </Box>
        <Button onClick={cerrarSesion}>Cerrar sesión</Button>
      </Stack>

      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 2.4 }}>
          <Estadistica etiqueta="Pendientes" valor={resumen.pendientes} />
        </Grid>
        <Grid size={{ xs: 6, md: 2.4 }}>
          <Estadistica etiqueta="Observadas" valor={resumen.observadas} />
        </Grid>
        <Grid size={{ xs: 6, md: 2.4 }}>
          <Estadistica
            etiqueta="Aprobadas 7 días"
            valor={resumen.aprobadasSemana}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 2.4 }}>
          <Estadistica
            etiqueta="Rechazadas 7 días"
            valor={resumen.rechazadasSemana}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 2.4 }}>
          <Estadistica
            etiqueta="Turnos próximos"
            valor={resumen.turnosProximos}
          />
        </Grid>
      </Grid>

      <Tabs
        value={pestana}
        onChange={(_evento, valor) => setPestana(valor)}
        variant="scrollable"
      >
        <Tab
          label={solicitudEditandoId ? 'Editar solicitud' : 'Nueva solicitud'}
        />
        <Tab label="Solicitudes" />
        <Tab label="Turnos" />
        <Tab label="Cartilla" />
      </Tabs>

      {pestana === 0 && (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">
                {solicitudEditandoId
                  ? 'Modificar solicitud recibida'
                  : 'Registrar solicitud'}
              </Typography>
              <TextField
                select
                label="Tipo"
                value={formulario.tipo}
                disabled={Boolean(solicitudEditandoId)}
                onChange={(evento) =>
                  setFormulario({ ...formulario, tipo: evento.target.value })
                }
              >
                <MenuItem value="REINTEGRO">Reintegro</MenuItem>
                <MenuItem value="AUTORIZACION">Autorización</MenuItem>
                <MenuItem value="RECETA">Receta</MenuItem>
              </TextField>
              <TextField
                select
                label="Integrante"
                value={formulario.afiliadoId}
                onChange={(evento) =>
                  setFormulario({
                    ...formulario,
                    afiliadoId: evento.target.value,
                  })
                }
              >
                {integrantes.map((integrante) => (
                  <MenuItem key={integrante._id} value={integrante._id}>
                    {integrante.nombre} {integrante.apellido}
                  </MenuItem>
                ))}
              </TextField>

              {formulario.tipo === 'RECETA' ? (
                <>
                  <TextField
                    label="Medicamento"
                    value={formulario.medicamento}
                    onChange={(evento) =>
                      setFormulario({
                        ...formulario,
                        medicamento: evento.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Cantidad"
                    type="number"
                    value={formulario.cantidad}
                    onChange={(evento) =>
                      setFormulario({
                        ...formulario,
                        cantidad: evento.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Presentación"
                    value={formulario.presentacion}
                    onChange={(evento) =>
                      setFormulario({
                        ...formulario,
                        presentacion: evento.target.value,
                      })
                    }
                  />
                </>
              ) : (
                <>
                  <TextField
                    label="Fecha prevista / prestación"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formulario.fechaPrestacion}
                    onChange={(evento) =>
                      setFormulario({
                        ...formulario,
                        fechaPrestacion: evento.target.value,
                      })
                    }
                  />
                  <TextField
                    select
                    label="Prestador"
                    value={formulario.prestadorId}
                    onChange={(evento) =>
                      setFormulario({
                        ...formulario,
                        prestadorId: evento.target.value,
                        especialidadId: '',
                      })
                    }
                  >
                    {cartilla.map((prestador) => (
                      <MenuItem key={prestador._id} value={prestador._id}>
                        {prestador.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Especialidad"
                    value={formulario.especialidadId}
                    onChange={(evento) =>
                      setFormulario({
                        ...formulario,
                        especialidadId: evento.target.value,
                      })
                    }
                  >
                    {especialidades.map((especialidad) => (
                      <MenuItem key={especialidad._id} value={especialidad._id}>
                        {especialidad.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Lugar"
                    value={formulario.lugar}
                    onChange={(evento) =>
                      setFormulario({
                        ...formulario,
                        lugar: evento.target.value,
                      })
                    }
                  />

                  {formulario.tipo === 'REINTEGRO' && (
                    <>
                      <TextField
                        label="Fecha factura"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formulario.facturaFecha}
                        onChange={(evento) =>
                          setFormulario({
                            ...formulario,
                            facturaFecha: evento.target.value,
                          })
                        }
                      />
                      <TextField
                        label="CUIT factura"
                        value={formulario.facturaCuit}
                        onChange={(evento) =>
                          setFormulario({
                            ...formulario,
                            facturaCuit: evento.target.value,
                          })
                        }
                      />
                      <TextField
                        label="Total factura"
                        type="number"
                        value={formulario.facturaTotal}
                        onChange={(evento) =>
                          setFormulario({
                            ...formulario,
                            facturaTotal: evento.target.value,
                          })
                        }
                      />
                      <TextField
                        label="Persona facturada"
                        value={formulario.facturaPersona}
                        onChange={(evento) =>
                          setFormulario({
                            ...formulario,
                            facturaPersona: evento.target.value,
                          })
                        }
                      />
                      <TextField
                        select
                        label="Forma de pago"
                        value={formulario.formaPago}
                        onChange={(evento) =>
                          setFormulario({
                            ...formulario,
                            formaPago: evento.target.value,
                          })
                        }
                      >
                        <MenuItem value="EFECTIVO">Efectivo</MenuItem>
                        <MenuItem value="CHEQUE">Cheque</MenuItem>
                        <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
                      </TextField>
                      {formulario.formaPago === 'TRANSFERENCIA' && (
                        <TextField
                          label="CBU"
                          value={formulario.cbu}
                          onChange={(evento) =>
                            setFormulario({
                              ...formulario,
                              cbu: evento.target.value,
                            })
                          }
                        />
                      )}
                    </>
                  )}

                  {formulario.tipo === 'AUTORIZACION' && (
                    <TextField
                      label="Días de internación (si corresponde)"
                      type="number"
                      value={formulario.diasInternacion}
                      onChange={(evento) =>
                        setFormulario({
                          ...formulario,
                          diasInternacion: evento.target.value,
                        })
                      }
                    />
                  )}
                </>
              )}

              <TextField
                label="Observaciones"
                multiline
                minRows={2}
                value={formulario.observaciones}
                onChange={(evento) =>
                  setFormulario({
                    ...formulario,
                    observaciones: evento.target.value,
                  })
                }
              />
              <Stack direction="row" gap={1}>
                <Button variant="contained" onClick={guardarSolicitud}>
                  {solicitudEditandoId ? 'Guardar cambios' : 'Enviar solicitud'}
                </Button>
                {solicitudEditandoId && (
                  <Button onClick={limpiarFormulario}>Cancelar edición</Button>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {pestana === 1 && (
        <Stack spacing={2}>
          {solicitudes.length === 0 ? (
            <Alert severity="info">Todavía no hay solicitudes.</Alert>
          ) : (
            solicitudes.map((solicitud) => (
              <Card key={solicitud._id}>
                <CardContent>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ sm: 'center' }}
                    gap={1}
                  >
                    <Box>
                      <Typography variant="h6">{solicitud.tipo}</Typography>
                      <Typography>
                        {solicitud.afiliadoId?.nombre}{' '}
                        {solicitud.afiliadoId?.apellido}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(solicitud.creadoEn).toLocaleString('es-AR')}
                      </Typography>
                    </Box>
                    <Chip label={solicitud.estado} />
                  </Stack>
                  {solicitud.observaciones && (
                    <Typography sx={{ mt: 1 }}>
                      {solicitud.observaciones}
                    </Typography>
                  )}
                  <Stack direction="row" gap={1} mt={1}>
                    {solicitud.estado === 'Observado' && (
                      <Button
                        onClick={() => responderObservacion(solicitud._id)}
                      >
                        Responder observación
                      </Button>
                    )}
                    {solicitud.estado === 'Recibido' && (
                      <>
                        <Button onClick={() => editarSolicitud(solicitud)}>
                          Modificar
                        </Button>
                        <Button
                          color="error"
                          onClick={() => eliminarSolicitud(solicitud._id)}
                        >
                          Eliminar
                        </Button>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      )}

      {pestana === 2 && (
        <GestionTurnosAfiliado
          integrantes={integrantes}
          cartilla={cartilla}
          afiliadoTurnoId={afiliadoTurnoId}
          setAfiliadoTurnoId={setAfiliadoTurnoId}
          horariosDisponibles={horariosDisponibles}
          buscarDisponibilidad={buscarDisponibilidad}
          reservarTurno={reservarTurno}
          turnos={turnos}
          cancelarTurno={cancelarTurno}
        />
      )}

      {pestana === 3 && (
        <Stack spacing={2}>
          {cartilla.map((prestador) => (
            <Card key={prestador._id}>
              <CardContent>
                <Typography variant="h6">{prestador.nombre}</Typography>
                <Typography>
                  {(prestador.especialidades || [])
                    .map((especialidad) => especialidad.nombre)
                    .join(', ') || 'Sin especialidad informada'}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {prestador.esCentroMedico ? 'Centro médico' : 'Profesional'}
                </Typography>
                {(prestador.centrosDeAtencion || []).map((centro) => (
                  <Typography key={centro._id} variant="body2">
                    {centro.direccionId
                      ? `${centro.direccionId.calle} ${centro.direccionId.altura} · ${centro.direccionId.localidad}`
                      : 'Centro de atención'}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
