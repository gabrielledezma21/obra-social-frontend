const fs = require('fs');

const reemplazarObligatorio = (contenido, patron, reemplazo, descripcion) => {
  const actualizado = contenido.replace(patron, reemplazo);
  if (actualizado === contenido) {
    throw new Error(`No se pudo aplicar: ${descripcion}`);
  }
  return actualizado;
};

const rutaPrestador = 'src/pages/portales/PortalPrestador.jsx';
let prestador = fs.readFileSync(rutaPrestador, 'utf8');

prestador = reemplazarObligatorio(
  prestador,
  "import { useNavigate } from 'react-router-dom';\n",
  '',
  'quitar navegación duplicada del prestador'
);
prestador = reemplazarObligatorio(
  prestador,
  "import { limpiarSesion, portalPrestador } from '../../services/portal';\n",
  "import { portalPrestador } from '../../services/portal';\n",
  'usar solo el servicio del prestador'
);
prestador = reemplazarObligatorio(
  prestador,
  "import PropTypes from 'prop-types';\n",
  "import PropTypes from 'prop-types';\nimport HistoriaClinicaPrestador from '../../components/portales/HistoriaClinicaPrestador';\n",
  'importar historia clínica unificada'
);
prestador = reemplazarObligatorio(
  prestador,
  `  const [busqueda, setBusqueda] = useState('');\n  const [afiliados, setAfiliados] = useState([]);\n  const [afiliadoSeleccionado, setAfiliadoSeleccionado] = useState(null);\n  const [situaciones, setSituaciones] = useState([]);\n  const [historia, setHistoria] = useState([]);\n  const [soloMias, setSoloMias] = useState(false);\n`,
  '',
  'quitar estado clínico duplicado'
);
prestador = reemplazarObligatorio(
  prestador,
  '  const navegar = useNavigate();\n',
  '',
  'quitar navegación local del prestador'
);
prestador = reemplazarObligatorio(
  prestador,
  /\n  const buscarAfiliados = async \(\) => \{[\s\S]*?\n  const agregarNota = async/,
  '\n  const agregarNota = async',
  'mover lógica clínica al componente dedicado'
);
prestador = reemplazarObligatorio(
  prestador,
  `\n  const cerrarSesion = () => {\n    limpiarSesion();\n    navegar('/portal/acceso');\n  };\n`,
  '',
  'quitar cierre de sesión duplicado del prestador'
);
prestador = reemplazarObligatorio(
  prestador,
  '        <Button onClick={cerrarSesion}>Cerrar sesión</Button>\n',
  '',
  'quitar botón duplicado del prestador'
);
prestador = reemplazarObligatorio(
  prestador,
  `        <Tab label="Bandeja de solicitudes" />\n        <Tab label="Turnos" />\n        <Tab label="Afiliados y situaciones" />\n        <Tab label="Historia clínica" />`,
  `        <Tab label="Bandeja de solicitudes" />\n        <Tab label="Turnos" />\n        <Tab label="Historia clínica" />`,
  'unificar navegación clínica del prestador'
);
prestador = reemplazarObligatorio(
  prestador,
  /\n      \{pestana === 2 && \([\s\S]*?\n      \{pestana === 3 && \([\s\S]*?\n      \)\}(?=\n    <\/Stack>)/,
  '\n      {pestana === 2 && <HistoriaClinicaPrestador />}',
  'reemplazar vistas clínicas separadas'
);

fs.writeFileSync(rutaPrestador, prestador);

const rutaAfiliado = 'src/pages/portales/PortalAfiliado.jsx';
let afiliado = fs.readFileSync(rutaAfiliado, 'utf8');

afiliado = reemplazarObligatorio(
  afiliado,
  "import { useNavigate } from 'react-router-dom';\n",
  '',
  'quitar navegación duplicada del afiliado'
);
afiliado = reemplazarObligatorio(
  afiliado,
  "import { limpiarSesion, portalAfiliado } from '../../services/portal';\n",
  "import { portalAfiliado } from '../../services/portal';\n",
  'usar solo el servicio del afiliado'
);
afiliado = reemplazarObligatorio(
  afiliado,
  '  const navegar = useNavigate();\n',
  '',
  'quitar navegación local del afiliado'
);
afiliado = reemplazarObligatorio(
  afiliado,
  `\n  const cerrarSesion = () => {\n    limpiarSesion();\n    navegar('/portal/acceso');\n  };\n`,
  '',
  'quitar cierre de sesión duplicado del afiliado'
);
afiliado = reemplazarObligatorio(
  afiliado,
  '        <Button onClick={cerrarSesion}>Cerrar sesión</Button>\n',
  '',
  'quitar botón duplicado del afiliado'
);

fs.writeFileSync(rutaAfiliado, afiliado);

const rutaDiseno = 'src/layout/DisenoPortal.jsx';
let diseno = fs.readFileSync(rutaDiseno, 'utf8');

diseno = reemplazarObligatorio(
  diseno,
  "import IconoAfiliados from '@mui/icons-material/PeopleOutline';\n",
  '',
  'quitar icono de sección clínica duplicada'
);
diseno = reemplazarObligatorio(
  diseno,
  /const ELEMENTOS_PRESTADOR = \[[\s\S]*?\n\];/,
  `const ELEMENTOS_PRESTADOR = [\n  { clave: 'resumen', etiqueta: 'Resumen', icono: IconoResumen },\n  {\n    clave: 'solicitudes',\n    etiqueta: 'Solicitudes',\n    icono: IconoSolicitudes,\n    pestana: 0,\n  },\n  { clave: 'turnos', etiqueta: 'Turnos', icono: IconoTurnos, pestana: 1 },\n  {\n    clave: 'historia',\n    etiqueta: 'Historia clínica',\n    icono: IconoHistoria,\n    pestana: 2,\n  },\n];`,
  'unificar navegación lateral clínica'
);

fs.writeFileSync(rutaDiseno, diseno);

const rutaHistoria = 'src/components/portales/HistoriaClinicaPrestador.jsx';
let historia = fs.readFileSync(rutaHistoria, 'utf8');

historia = reemplazarObligatorio(
  historia,
  '  InputAdornment,\n',
  '  InputAdornment,\n  MenuItem,\n',
  'importar opciones de catálogo'
);
historia = reemplazarObligatorio(
  historia,
  /            \{catalogoSituaciones\.map\(\(situacion\) => \(\n              <option key=\{situacion\._id\} value=\{situacion\._id\} \/>\n            \)\)\}/,
  `            {catalogoSituaciones.map((situacion) => (\n              <MenuItem key={situacion._id} value={situacion._id}>\n                {situacion.nombre}\n              </MenuItem>\n            ))}`,
  'renderizar catálogo con MenuItem'
);

fs.writeFileSync(rutaHistoria, historia);
