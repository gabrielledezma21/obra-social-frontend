import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  Link,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TableHeader from '../common/lists/TableHeader';

export default function AgendasTable({
  rows = [],
  loading = false,
  total = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
}) {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        sx={{
          width: '100%',
          mb: 2,
          borderRadius: 2,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHeader
              headCells={[
                { id: 'prestador', label: 'Agenda de turnos' },
                { id: 'especialidad', label: 'Especialidad' },
                { id: 'horarios', label: 'Horarios - Duración' },
                { id: 'direccion', label: 'Dirección' },
              ]}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Cargando resultados...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No se encontraron resultados.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell sx={{ fontSize: '0.9rem' }}>
                      <Link
                        href={row.url}
                        underline="always"
                        color="text.primary"
                        sx={{ fontSize: '0.9rem', fontWeight: 500 }}
                      >
                        #{row.id} - {row.prestador}
                      </Link>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.9rem' }}>
                      {row.especialidad}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.9rem' }}>
                      {Array.isArray(row.horarios) &&
                      row.horarios.length > 0 ? (
                        row.horarios.map((h, i) => (
                          <Typography key={i} fontSize="0.9rem">
                            • {h}
                          </Typography>
                        ))
                      ) : (
                        <Typography fontSize="0.9rem" color="text.secondary">
                          Sin horarios
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.9rem' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                        }}
                      >
                        <LocationOnIcon
                          sx={{
                            fontSize: 18,
                            color: 'text.secondary',
                            mt: 0.3,
                          }}
                        />
                        <Typography fontSize="0.9rem">
                          {row.direccion}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!loading && total > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            labelRowsPerPage="Filas por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
            sx={{
              color: '#0B111E',
              '& .MuiSelect-icon': { color: '#0B111E' },
              '& .MuiSvgIcon-root': { color: '#0B111E' },
            }}
          />
        )}
      </Paper>
    </Box>
  );
}

AgendasTable.propTypes = {
  rows: PropTypes.array,
  loading: PropTypes.bool,
  total: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
};
