import { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  Card,
  CardContent,
  Button,
  Collapse,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { AfiliadoProvider, useAfiliado } from '../../context/AfiliadoContext';
import DatosPersonalesDetailsSection from './DatosPersonalesDetailsSection';
import SituacionesTerapeuticasDetailsSection from './SituacionesTerapeuticasDetailsSection';
import DatosContactoDetailsSection from './DatosContactoDetailsSection';
import DireccionDetailsSection from './DireccionDetailsSection';
import PropTypes from 'prop-types';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import BajaAfiliadoModal from './modals/BajaAfiliadoModal';
import ReincorporarModal from './modals/ReincorporarModal';
import 'dayjs/locale/es';

function MiembroFamiliarContent({ miembro }) {
  const { afiliado } = useAfiliado();
  const [expanded, setExpanded] = useState(false);
  const [toast, setToast] = useState(null);
  const [bajaModalOpen, setBajaModalOpen] = useState(false);
  const [reincorporarModalOpen, setReincorporarModalOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  if (!afiliado) return null;

  const hoy = new Date();
  const tieneFechaBaja = !!afiliado.vigenciaFin;
  const fechaBajaPasada =
    tieneFechaBaja && new Date(afiliado.vigenciaFin) < hoy;
  const fechaBajaFutura =
    tieneFechaBaja && new Date(afiliado.vigenciaFin) >= hoy;

  const getEstado = () => {
    if (!tieneFechaBaja) return { label: 'Activo', color: 'success' };
    if (fechaBajaPasada) return { label: 'Inactivo', color: 'error' };
    if (fechaBajaFutura) return { label: 'Baja Futura', color: 'warning' };
    return { label: 'Activo', color: 'success' };
  };

  const estado = getEstado();

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleDarDeBaja = () => {
    handleMenuClose();
    setBajaModalOpen(true);
  };

  const handleModificarFecha = () => {
    handleMenuClose();
    setBajaModalOpen(true);
  };

  const handleReincorporar = () => {
    handleMenuClose();
    setReincorporarModalOpen(true);
  };

  const handleToastClose = () => setToast(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: expanded ? 2 : 0,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="medium">
                {afiliado.nombre} {afiliado.apellido}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 1, flexWrap: 'wrap', gap: 1, alignItems: 'center' }}
              >
                <Chip
                  label={`${miembro.parentesco?.relacion}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={estado.label}
                  color={estado.color}
                  variant="outlined"
                  size="small"
                />

                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  endIcon={<ArrowDropDownIcon />}
                  onClick={handleMenuOpen}
                  sx={{ textTransform: 'none' }}
                >
                  Gestionar baja
                </Button>

                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={handleMenuClose}
                  slotProps={{
                    paper: {
                      sx: {
                        minWidth: 200,
                        maxWidth: 200,
                      },
                    },
                  }}
                >
                  <MenuItem onClick={handleDarDeBaja} disabled={tieneFechaBaja}>
                    <ListItemIcon>
                      <DeleteOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Dar de baja</ListItemText>
                  </MenuItem>

                  <MenuItem
                    onClick={handleModificarFecha}
                    disabled={!tieneFechaBaja}
                  >
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Modificar fecha</ListItemText>
                  </MenuItem>

                  <MenuItem
                    onClick={handleReincorporar}
                    disabled={!tieneFechaBaja}
                  >
                    <ListItemIcon>
                      <ReplayIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Reincorporar</ListItemText>
                  </MenuItem>
                </Menu>
              </Stack>
            </Box>

            <Button
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setExpanded(!expanded)}
              size="small"
            >
              {expanded ? 'Menos' : 'Más'}
            </Button>
          </Box>

          <Collapse in={expanded}>
            <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ mb: 3 }}>
                <DatosPersonalesDetailsSection />
              </Box>

              {afiliado.situacionesTerapeuticas?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <SituacionesTerapeuticasDetailsSection />
                </Box>
              )}

              {(afiliado.emails?.length > 0 ||
                afiliado.telefonos?.length > 0) && (
                <Box sx={{ mb: 3 }}>
                  <DatosContactoDetailsSection />
                </Box>
              )}

              {afiliado.domicilios?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <DireccionDetailsSection />
                </Box>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      <BajaAfiliadoModal
        open={bajaModalOpen}
        onClose={() => setBajaModalOpen(false)}
        esModificacion={tieneFechaBaja}
      />

      <ReincorporarModal
        open={reincorporarModalOpen}
        onClose={() => setReincorporarModalOpen(false)}
      />

      {toast && (
        <Snackbar
          key={toast.key}
          open
          autoHideDuration={2000}
          onClose={handleToastClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleToastClose}
            icon={<CheckIcon fontSize="inherit" />}
            severity="success"
            variant="filled"
            sx={{ color: 'white', fontWeight: 200 }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      )}
    </LocalizationProvider>
  );
}

export default function MiembroFamiliarDetails({ miembro, numero }) {
  const miembroComoAfiliado = {
    ...miembro,
    id: miembro.id,
    tipoDocumento: miembro.tipoDocumento || {},
    Contrato: miembro.Contrato || { plan: miembro.cobertura || {} },
    situacionesTerapeuticas: miembro.situacionesTerapeuticas || [],
    domicilios: miembro.domicilios || [],
    emails: miembro.emails || [],
    telefonos: miembro.telefonos || [],
  };

  return (
    <AfiliadoProvider
      idAfiliado={miembro.id}
      afiliadoData={miembroComoAfiliado}
    >
      <MiembroFamiliarContent miembro={miembro} numero={numero} />
    </AfiliadoProvider>
  );
}

MiembroFamiliarContent.propTypes = {
  miembro: PropTypes.object.isRequired,
  numero: PropTypes.number.isRequired,
};

MiembroFamiliarDetails.propTypes = {
  miembro: PropTypes.object.isRequired,
  numero: PropTypes.number.isRequired,
};
