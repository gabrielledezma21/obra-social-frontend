import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const nombresSecciones = {
  'agenda-turnos': 'Agenda de turnos',
  prestadores: 'Prestadores',
  afiliados: 'Afiliados',
  reportes: 'Reportes',
};

const crearMigasAdministracion = (segmentos) => {
  const seccion = segmentos[1];
  const accion = segmentos[2];
  const id = segmentos[3];
  const migas = [{ label: 'Home', to: '/administracion' }];

  if (!seccion) return migas;

  if (seccion === 'reportes') {
    migas.push({ label: 'Reportes' });
    return migas;
  }

  const nombreSeccion = nombresSecciones[seccion] || seccion;
  migas.push({
    label: nombreSeccion,
    to: `/administracion/${seccion}/listado`,
  });

  if (accion === 'alta') {
    migas.push({ label: 'Alta' });
  } else if (accion === 'detalle' && id) {
    migas.push({ label: 'Detalle' });
  } else if (accion === 'listado') {
    migas[migas.length - 1] = { label: nombreSeccion };
  }

  return migas;
};

export default function BreadcrumbsNav() {
  const { pathname } = useLocation();
  const segmentos = pathname.split('/').filter(Boolean);

  const migas =
    segmentos[0] === 'administracion'
      ? crearMigasAdministracion(segmentos)
      : [{ label: 'Home', to: '/' }];

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }} separator=">">
      {migas.map((miga, indice) =>
        miga.to ? (
          <Link
            key={`${miga.label}-${indice}`}
            component={RouterLink}
            underline="hover"
            color="text.secondary"
            to={miga.to}
            fontWeight="medium"
          >
            {miga.label}
          </Link>
        ) : (
          <Typography
            key={`${miga.label}-${indice}`}
            color="text.secondary"
            fontWeight="medium"
          >
            {miga.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}
