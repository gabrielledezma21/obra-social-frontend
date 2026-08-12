import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const routeNameMap = {
  'agenda-turnos': 'Agenda de turnos',
  prestadores: 'Prestadores',
  afiliados: 'Afiliados',
};

export default function BreadcrumbsNav() {
  const { pathname } = useLocation();

  const isHome = pathname === '/';
  if (isHome) {
    return (
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }} separator=">">
        <Typography color="text.secondary" fontWeight="medium">
          Home
        </Typography>
      </Breadcrumbs>
    );
  }

  const segments = pathname.split('/').filter(Boolean);
  const mainSection = segments[0];
  const subSection = segments[1];
  const idSection = segments[2];

  const isDetalle = subSection === 'detalle' && /^\d+$/.test(idSection);

  const crumbs = [
    { label: 'Home', to: '/' },
    {
      label: routeNameMap[mainSection] || mainSection,
      to:
        subSection && !isDetalle && subSection !== 'listado'
          ? `/${mainSection}/listado`
          : `/${mainSection}/listado`,
    },
  ];

  if (subSection === 'alta') {
    crumbs.push({ label: 'Alta' });
  } else if (isDetalle) {
    crumbs.push({ label: `Detalle #${idSection}` });
  }

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }} separator=">">
      {crumbs.map((crumb, index) =>
        crumb.to ? (
          <Link
            key={index}
            component={RouterLink}
            underline="hover"
            color="text.secondary"
            to={crumb.to}
            fontWeight="medium"
          >
            {crumb.label}
          </Link>
        ) : (
          <Typography key={index} color="text.secondary" fontWeight="medium">
            {crumb.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}
