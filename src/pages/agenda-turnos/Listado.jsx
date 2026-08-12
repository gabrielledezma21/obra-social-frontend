import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import PageListHeader from '../../components/common/lists/PageListHeader';
import { usePageTitle } from '../../hooks/usePageTitle';
import ListadoTurnosTable from '../../components/agenda-turnos/ListadoTurnosTable';
import { getAgendaTurnosListado } from '../../services/agendaTurnos';
import SuccessSnackbar from '../../components/common/SuccessSnackbar';
import { useLocation } from 'react-router-dom';

export default function AgendaTurnosListado() {
  usePageTitle('MedIntegral | Listado de agendas de turnos');

  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ textInputSearch: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('deleted') === 'true') {
      setShowSuccess(true);
      window.history.replaceState({}, document.title, '/agenda-de-turnos');
    }
  }, [location]);

  useEffect(() => {
    const fetchAgendas = async () => {
      setLoading(true);
      try {
        const data = await getAgendaTurnosListado(filters, page, rowsPerPage);
        setRows(data.items || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Error al obtener agendas:', err);
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendas();
  }, [filters, page, rowsPerPage]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <PageListHeader
        type="agenda-de-turnos"
        onSearch={handleSearch}
        total={total}
      />

      <ListadoTurnosTable
        rows={rows}
        loading={loading}
        page={page}
        total={total}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <SuccessSnackbar
        open={showSuccess}
        autoHideDuration={4000}
        message="Agenda de turnos eliminada con éxito"
        onClose={() => setShowSuccess(false)}
      />
    </Box>
  );
}
