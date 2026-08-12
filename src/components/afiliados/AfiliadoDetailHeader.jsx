import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  Typography,
  Button,
  Stack,
  Chip,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useAfiliado } from '../../context/AfiliadoContext';
import BajaAfiliadoModal from './modals/BajaAfiliadoModal';
import ReincorporarModal from './modals/ReincorporarModal';
import { getReporteAfiliadoById } from '../../services/afiliado';
import { downloadFile } from '../../utils/downloadFile';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

export default function AfiliadoDetailHeader({ nombre, apellido }) {
  const { afiliado } = useAfiliado();
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

  const downloadReport = () => {
    downloadFile(
      () => getReporteAfiliadoById(afiliado.id),
      `reporteAfiliado${afiliado.id}.pdf`
    );
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '—';
    const [datePart] = fecha.split('T');
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid size={{ xs: 12, md: 'auto' }}>
          <Typography variant="h4" fontWeight="bold">
            Afiliado: {nombre} {apellido}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Detalle del afiliado y grupo familiar
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 'auto' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={estado.label}
              color={estado.color}
              variant="outlined"
            />

            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowCircleDownIcon />}
              sx={{ textTransform: 'none', mr: 1 }}
              onClick={downloadReport}
            >
              Descargar reporte
            </Button>

            <Button
              variant="contained"
              color="error"
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

              <MenuItem onClick={handleReincorporar} disabled={!tieneFechaBaja}>
                <ListItemIcon>
                  <ReplayIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Reincorporar</ListItemText>
              </MenuItem>
            </Menu>
          </Stack>
        </Grid>
      </Grid>

      {fechaBajaFutura && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          El afiliado tiene programada una baja para el{' '}
          {formatFecha(afiliado.vigenciaFin)}. Puede modificar la fecha o
          reincorporarlo.
        </Alert>
      )}

      {fechaBajaPasada && (
        <Alert severity="error" sx={{ mt: 2 }}>
          El afiliado se encuentra inactivo desde el{' '}
          {formatFecha(afiliado.vigenciaFin)}. Puede reincorporarlo para
          reactivarlo.
        </Alert>
      )}

      <BajaAfiliadoModal
        open={bajaModalOpen}
        onClose={() => setBajaModalOpen(false)}
        esModificacion={tieneFechaBaja}
      />

      <ReincorporarModal
        open={reincorporarModalOpen}
        onClose={() => setReincorporarModalOpen(false)}
      />
    </Box>
  );
}

AfiliadoDetailHeader.propTypes = {
  nombre: PropTypes.string.isRequired,
  apellido: PropTypes.string.isRequired,
};
