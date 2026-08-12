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
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TableHeader from '../common/lists/TableHeader';

export default function ListadoAfiliadosTable({
  rows = [],
  loading = false,
  total = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  order = 'asc',
  orderBy = 'afiliado',
  onRequestSort = () => {},
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
              order={order}
              orderBy={orderBy}
              onRequestSort={onRequestSort}
              headCells={[
                { id: 'afiliado', label: 'Afiliado' },
                { id: 'documento', label: 'Documento' },
                { id: 'planMedico', label: 'Plan Médico' },
                { id: 'direcciones', label: 'Direcciones' },
                { id: 'telefonos', label: 'Teléfonos' },
                { id: 'emails', label: 'Emails' },
              ]}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Cargando resultados...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography>No se encontraron resultados</Typography>
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
                        {row.afiliado}
                      </Link>
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        {row.nroAfiliado}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.9rem' }}>
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        {row.documento}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.9rem', textAlign: 'center' }}>
                      {row.planMedico}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.9rem' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        {row.direcciones.map((d, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: 'flex',
                              flexDirection: 'flex-start',
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
                            <Typography fontSize="0.9rem">{d}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.9rem', padding: 'inherit' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        {row.telefonos.map((t, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: 'flex',
                              flexDirection: 'flex-start',
                              gap: 1,
                            }}
                          >
                            <PhoneIphoneIcon
                              sx={{
                                fontSize: 18,
                                color: 'text.secondary',
                                mt: 0.3,
                              }}
                            />
                            <Typography sx={{ fontSize: '0.9rem' }}>
                              {t}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.9rem' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        {row.emails.map((e, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: 'flex',
                              flexDirection: 'flex-start',
                              gap: 1,
                            }}
                          >
                            <MailOutlineIcon
                              sx={{
                                fontSize: 18,
                                color: 'text.secondary',
                                mt: 0.3,
                              }}
                            />
                            <Typography sx={{ fontSize: '0.9rem' }}>
                              {e}
                            </Typography>
                          </Box>
                        ))}
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

ListadoAfiliadosTable.propTypes = {
  rows: PropTypes.array,
  loading: PropTypes.bool,
  total: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  order: PropTypes.string,
  orderBy: PropTypes.string,
  onRequestSort: PropTypes.func,
};
