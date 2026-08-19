import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import PageListHeader from '../../components/common/lists/PageListHeader';
import { usePageTitle } from '../../hooks/usePageTitle';
import ListadoPrestadoresTable from '../../components/prestadores/ListadoPrestadoresTable';
import { getPrestadoresListado } from '../../services/prestadores';
import SuccessSnackbar from '../../components/common/SuccessSnackbar';
import { useLocation } from 'react-router-dom';
import { ordenarFilas } from '../../utils/ordenamientoListados';

const LIMITE_LISTADO_COMPLETO = 10000;

export default function PrestadoresListado() {
  usePageTitle('MedIntegral | Listado de prestadores');

  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ textInputSearch: '' });
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('prestador');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('deleted') === 'true') {
      setShowSuccess(true);
      window.history.replaceState(
        {},
        document.title,
        '/administracion/prestadores/listado'
      );
    }
  }, [location]);

  const fetchPrestadores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPrestadoresListado(
        filters,
        0,
        LIMITE_LISTADO_COMPLETO
      );
      const filasOrdenadas = ordenarFilas(data.items || [], orderBy, order);
      const inicio = page * rowsPerPage;
      setRows(filasOrdenadas.slice(inicio, inicio + rowsPerPage));
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error al obtener prestadores:', err);
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, page, rowsPerPage, order, orderBy]);

  useEffect(() => {
    fetchPrestadores();
  }, [fetchPrestadores]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleRequestSort = (campo, direccion) => {
    setOrderBy(campo);
    setOrder(direccion);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <PageListHeader type="prestador" onSearch={handleSearch} total={total} />

      <ListadoPrestadoresTable
        rows={rows}
        loading={loading}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
      />

      <SuccessSnackbar
        open={showSuccess}
        autoHideDuration={4000}
        message="Prestador eliminado con éxito"
        onClose={() => setShowSuccess(false)}
      />
    </Box>
  );
}
