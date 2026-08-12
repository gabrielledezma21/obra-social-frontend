import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Typography,
  InputBase,
  Button,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './PageListHeader.css';
import FiltrosModalBase from './FiltrosModalBase';
import { filtrosConfig } from '../../../utils/filtrosConfig';

const headerConfig = {
  'agenda-de-turnos': {
    title: 'Agendas de turnos',
    placeholder: 'Buscar por prestador, especialidad...',
    addLink: '/agenda-turnos/alta',
    labels: { singular: 'agenda de turnos', plural: 'agendas de turnos' },
  },
  prestador: {
    title: 'Prestadores',
    placeholder: 'Buscar por nombre, código postal, CUIT/CUIL...',
    addLink: '/prestadores/alta',
    labels: { singular: 'prestador', plural: 'prestadores' },
  },
  afiliado: {
    title: 'Afiliados',
    placeholder: 'Buscar por nombre, apellido o DNI...',
    addLink: '/afiliados/alta',
    labels: { singular: 'afiliado', plural: 'afiliados' },
  },
};

export default function PageListHeader({ type, onSearch, total }) {
  const config = headerConfig[type] || headerConfig['agenda-de-turnos'];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const lastSearchRef = useRef('');

  useEffect(() => {
    if (onSearch) onSearch({});
  }, []);

  useEffect(() => {
    if (!onSearch) return;
    const handler = setTimeout(() => {
      const trimmed = searchTerm.trim();
      if (trimmed !== lastSearchRef.current) {
        lastSearchRef.current = trimmed;
        onSearch({ textInputSearch: trimmed, ...filterValues });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    onSearch({
      textInputSearch: searchTerm.trim(),
      ...filterValues,
    });
  }, [filterValues]);

  const handleFilterApply = (values) => {
    setOpenFilter(false);

    if (values === null) return;

    if (values.__clearFilters) {
      setFilterValues({});
      setSearchTerm('');
      onSearch({});
      return;
    }

    if (Object.keys(values).length === 0) {
      setFilterValues({});
      onSearch({ textInputSearch: searchTerm.trim() });
      return;
    }

    setFilterValues(values);
    onSearch({ textInputSearch: searchTerm.trim(), ...values });
  };

  const labelConfig = config.labels;
  const label =
    typeof total === 'number'
      ? total === 1
        ? labelConfig.singular
        : labelConfig.plural
      : '';

  const handleChipDelete = (chip) => {
    const nuevosValoresFiltros = { ...filterValues };

    delete nuevosValoresFiltros[chip];

    setFilterValues(nuevosValoresFiltros);
    onSearch({ textInputSearch: searchTerm.trim(), ...nuevosValoresFiltros });
  };

  const obtenerFiltrosActivos = () => {
    const activos = [];
    const filtrosCampos = filtrosConfig[type]?.fields || [];

    Object.entries(filterValues).forEach(([key, value]) => {
      if (value === null || value === '' || value === undefined) return;

      const camposConfig = filtrosCampos.find((f) => f.name === key);
      if (!camposConfig) return;

      const claves = ['provincia', 'tipoPrestador', 'especialidad'];

      activos.push({
        key: key,
        name: camposConfig.label,
        value: claves.includes(key) ? value.label : (value.value ?? value),
      });
    });
    return activos;
  };

  const filtrosActivos = obtenerFiltrosActivos();

  return (
    <Box sx={{ mb: 4 }}>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid size={{ xs: 12, md: 'auto' }}>
          <Typography variant="h4" fontWeight="bold">
            {config.title}
          </Typography>
        </Grid>

        <Grid
          size={{ xs: 12, md: 12, lg: 7 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'flex-start', lg: 'flex-end' },
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', sm: 400 },
              px: 1,
            }}
          >
            <SearchIcon
              fontSize="small"
              sx={{ color: 'text.secondary', mr: 1 }}
            />
            <InputBase
              id={`search-${type}`}
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSearch({
                    textInputSearch: searchTerm.trim(),
                    ...filterValues,
                  });
                }
              }}
              placeholder={config.placeholder}
              inputProps={{ 'aria-label': config.placeholder }}
              className="page-list-input"
            />
          </Paper>

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{ textTransform: 'none' }}
            onClick={() => setOpenFilter(true)}
          >
            Filtros
          </Button>

          <Button
            variant="contained"
            component={RouterLink}
            to={config.addLink}
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none' }}
          >
            Agregar
          </Button>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1.5 }}>
        {typeof total === 'number'
          ? `Resultados de la búsqueda: ${total} ${label}`
          : 'Resultados de la búsqueda'}
      </Typography>

      {filtrosActivos.length > 0 && (
        <Stack direction="row" flexWrap={'wrap'} sx={{ rowGap: 1, mt: 1 }}>
          {filtrosActivos.map((filtro) => (
            <Chip
              key={filtro.key}
              label={`${filtro.name}: ${filtro.value}`}
              onDelete={() => handleChipDelete(filtro.key)}
              color="primary"
              size="small"
              sx={{ mr: 0.5 }}
            />
          ))}
        </Stack>
      )}

      <FiltrosModalBase
        open={openFilter}
        onClose={handleFilterApply}
        fields={filtrosConfig[type]?.fields}
        validateFn={filtrosConfig[type]?.validateFn}
        chipValues={filterValues}
      />
    </Box>
  );
}

PageListHeader.propTypes = {
  type: PropTypes.oneOf(['agenda-de-turnos', 'prestador', 'afiliado'])
    .isRequired,
  onSearch: PropTypes.func,
  total: PropTypes.number,
};
