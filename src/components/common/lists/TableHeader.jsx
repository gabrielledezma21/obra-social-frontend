import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';

export default function TableHeader({
  headCells,
  order = 'asc',
  orderBy = '',
  onRequestSort = () => {},
}) {
  const crearManejadorOrden = (campo) => () => {
    const esAscendente = orderBy === campo && order === 'asc';
    onRequestSort(campo, esAscendente ? 'desc' : 'asc');
  };

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: '#0B111E' }}>
        {headCells.map((headCell) => {
          const activo = orderBy === headCell.id;
          return (
            <TableCell
              key={headCell.id}
              sortDirection={activo ? order : false}
              sx={{
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              <TableSortLabel
                active={activo}
                direction={activo ? order : 'asc'}
                onClick={crearManejadorOrden(headCell.id)}
                sx={{
                  color: 'inherit !important',
                  fontWeight: 'inherit',
                  '& .MuiTableSortLabel-icon': {
                    color: 'white !important',
                  },
                }}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

TableHeader.propTypes = {
  headCells: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  onRequestSort: PropTypes.func,
};
