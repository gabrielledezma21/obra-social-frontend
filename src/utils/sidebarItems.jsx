import ShowChartIcon from '@mui/icons-material/ShowChart';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

export const sidebarItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <ShowChartIcon />,
    route: '/',
  },
  {
    key: 'afiliados',
    label: 'Afiliados',
    icon: <PersonOutlinedIcon />,
    children: [
      {
        label: 'Ver listado',
        icon: <FeedOutlinedIcon />,
        route: '/afiliados/listado',
      },
      {
        label: 'Agregar',
        icon: <AddOutlinedIcon />,
        route: '/afiliados/alta',
      },
    ],
  },
  {
    key: 'prestadores',
    label: 'Prestadores',
    icon: <MedicalInformationOutlinedIcon />,
    children: [
      {
        label: 'Ver listado',
        icon: <FeedOutlinedIcon />,
        route: '/prestadores/listado',
      },
      {
        label: 'Agregar',
        icon: <AddOutlinedIcon />,
        route: '/prestadores/alta',
      },
    ],
  },
  {
    key: 'agendaTurnos',
    label: 'Agenda de turnos',
    icon: <CalendarTodayOutlinedIcon />,
    children: [
      {
        label: 'Ver listado',
        icon: <FeedOutlinedIcon />,
        route: '/agenda-turnos/listado',
      },
      {
        label: 'Agregar',
        icon: <AddOutlinedIcon />,
        route: '/agenda-turnos/alta',
      },
    ],
  },
];
