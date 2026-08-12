import * as React from 'react';
import PropTypes from 'prop-types';
import { TableHead, TableRow, TableCell } from '@mui/material';

export default function TableHeader({ headCells }) {
  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: '#0B111E' }}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sx={{
              color: 'white',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            {headCell.label}
          </TableCell>
        ))}
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
};
