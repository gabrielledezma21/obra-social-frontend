import IconoGrafico from '@mui/icons-material/ShowChart';
import IconoPersona from '@mui/icons-material/PersonOutlined';
import IconoInformacionMedica from '@mui/icons-material/MedicalInformationOutlined';
import IconoCalendario from '@mui/icons-material/CalendarTodayOutlined';
import IconoListado from '@mui/icons-material/FeedOutlined';
import IconoAgregar from '@mui/icons-material/AddOutlined';
import IconoAcceso from '@mui/icons-material/LoginOutlined';
import IconoReportes from '@mui/icons-material/AssessmentOutlined';

export const elementosBarraLateral = [
  {
    clave: 'resumen',
    etiqueta: 'Resumen',
    icono: <IconoGrafico />,
    ruta: '/',
  },
  {
    clave: 'reportes',
    etiqueta: 'Reportes',
    icono: <IconoReportes />,
    ruta: '/reportes',
  },
  {
    clave: 'afiliados',
    etiqueta: 'Afiliados',
    icono: <IconoPersona />,
    hijos: [
      {
        etiqueta: 'Ver listado',
        icono: <IconoListado />,
        ruta: '/afiliados/listado',
      },
      {
        etiqueta: 'Agregar',
        icono: <IconoAgregar />,
        ruta: '/afiliados/alta',
      },
    ],
  },
  {
    clave: 'prestadores',
    etiqueta: 'Prestadores',
    icono: <IconoInformacionMedica />,
    hijos: [
      {
        etiqueta: 'Ver listado',
        icono: <IconoListado />,
        ruta: '/prestadores/listado',
      },
      {
        etiqueta: 'Agregar',
        icono: <IconoAgregar />,
        ruta: '/prestadores/alta',
      },
    ],
  },
  {
    clave: 'agendaTurnos',
    etiqueta: 'Agenda de turnos',
    icono: <IconoCalendario />,
    hijos: [
      {
        etiqueta: 'Ver listado',
        icono: <IconoListado />,
        ruta: '/agenda-turnos/listado',
      },
      {
        etiqueta: 'Agregar',
        icono: <IconoAgregar />,
        ruta: '/agenda-turnos/alta',
      },
    ],
  },
  {
    clave: 'portales',
    etiqueta: 'Acceso afiliados / prestadores',
    icono: <IconoAcceso />,
    ruta: '/portal/acceso',
  },
];
