import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Typography, Button } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';
import WarningDeleteDialog from '../forms/WarningDeleteDialog';
import { detailHeaderConfig } from '../../../utils/detailHeaderConfig';

export default function PageDetailHeader({
  type,
  id,
  nombre,
  onDelete,
  customDelete = false,
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const config = detailHeaderConfig[type];
  if (!config || !id) return null;

  const title = config.title(id, nombre);
  const subtitle = config.subtitle?.(id, nombre);

  const handleConfirmDelete = async () => {
    const ok = await onDelete?.(id);
    setOpenDialog(false);
    if (ok) navigate(config.redirectTo);
  };

  const handleDeleteClick = () => {
    if (customDelete) {
      onDelete?.();
    } else {
      setOpenDialog(true);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid size={{ xs: 12, md: 'auto' }}>
          <Typography variant="h4" fontWeight="bold">
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
        </Grid>

        {onDelete && (
          <Grid size={{ xs: 12, md: 'auto' }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              sx={{ textTransform: 'none' }}
              onClick={handleDeleteClick}
            >
              Dar de baja
            </Button>
          </Grid>
        )}
      </Grid>

      {!customDelete && (
        <WarningDeleteDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleConfirmDelete}
          title={config.deleteModal.title}
          message={config.deleteModal.message(id, nombre)}
        />
      )}
    </Box>
  );
}

PageDetailHeader.propTypes = {
  type: PropTypes.oneOf(['agenda-de-turnos', 'prestador', 'afiliado'])
    .isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  nombre: PropTypes.string,
  onDelete: PropTypes.func,
  customDelete: PropTypes.bool,
};
