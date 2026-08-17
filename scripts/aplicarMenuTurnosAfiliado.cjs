const fs = require('node:fs');

const reemplazar = (contenido, anterior, nuevo, descripcion) => {
  if (!contenido.includes(anterior)) {
    throw new Error(`No se encontró el bloque para ${descripcion}`);
  }
  return contenido.replace(anterior, nuevo);
};

const rutaDiseno = 'src/layout/DisenoPortal.jsx';
let diseno = fs.readFileSync(rutaDiseno, 'utf8');

diseno = reemplazar(
  diseno,
  "import IconoFlecha from '@mui/icons-material/ArrowForwardOutlined';",
  "import IconoFlecha from '@mui/icons-material/ArrowForwardOutlined';\nimport IconoExpandir from '@mui/icons-material/ExpandMore';\nimport IconoContraer from '@mui/icons-material/ExpandLess';\nimport IconoListaTurnos from '@mui/icons-material/FormatListBulletedOutlined';\nimport IconoAgregar from '@mui/icons-material/Add';",
  'importar iconos del submenú'
);

diseno = reemplazar(
  diseno,
  `const ELEMENTOS_AFILIADO = [\n  { clave: 'resumen', etiqueta: 'Resumen', icono: IconoResumen },`,
  `const ELEMENTO_MIS_TURNOS = {\n  clave: 'mis-turnos',\n  etiqueta: 'Mis turnos',\n  icono: IconoListaTurnos,\n  pestana: 2,\n  vistaTurnos: 'listado',\n};\n\nconst ELEMENTO_SACAR_TURNO = {\n  clave: 'sacar-turno',\n  etiqueta: 'Sacar turno',\n  icono: IconoAgregar,\n  pestana: 2,\n  vistaTurnos: 'sacar',\n};\n\nconst ELEMENTOS_AFILIADO = [\n  { clave: 'resumen', etiqueta: 'Resumen', icono: IconoResumen },`,
  'definir accesos de turnos'
);

diseno = reemplazar(
  diseno,
  "  { clave: 'turnos', etiqueta: 'Turnos', icono: IconoTurnos, pestana: 2 },",
  `  {\n    clave: 'turnos',\n    etiqueta: 'Turnos',\n    icono: IconoTurnos,\n    pestana: 2,\n    hijos: [ELEMENTO_MIS_TURNOS, ELEMENTO_SACAR_TURNO],\n  },`,
  'convertir Turnos en grupo'
);

diseno = diseno.replace(
  /onClick=\{\(\) => seleccionarElemento\(ELEMENTOS_AFILIADO\[3\]\)\}/g,
  "onClick={() => seleccionarElemento(ELEMENTO_MIS_TURNOS)}"
);

diseno = reemplazar(
  diseno,
  `              onClick={() => seleccionarElemento(ELEMENTO_MIS_TURNOS)}\n            >\n              Buscar turno`,
  `              onClick={() => seleccionarElemento(ELEMENTO_SACAR_TURNO)}\n            >\n              Buscar turno`,
  'redirigir acceso rápido a sacar turno'
);

diseno = reemplazar(
  diseno,
  "  const [elementoActivo, setElementoActivo] = useState('resumen');",
  "  const [elementoActivo, setElementoActivo] = useState('resumen');\n  const [turnosAbierto, setTurnosAbierto] = useState(false);",
  'agregar estado del submenú'
);

diseno = reemplazar(
  diseno,
  `    const pestanas = document.querySelectorAll('[role="tab"]');\n    const pestanaObjetivo = pestanas[elemento.pestana];\n    if (pestanaObjetivo) pestanaObjetivo.click();\n    window.scrollTo({ top: 0, behavior: 'smooth' });`,
  `    const pestanas = document.querySelectorAll('[role="tab"]');\n    const pestanaObjetivo = pestanas[elemento.pestana];\n    if (pestanaObjetivo) pestanaObjetivo.click();\n\n    if (elemento.vistaTurnos) {\n      window.setTimeout(() => {\n        window.dispatchEvent(\n          new CustomEvent('medintegral:navegar-turnos', {\n            detail: { vista: elemento.vistaTurnos },\n          })\n        );\n      }, 0);\n    }\n\n    window.scrollTo({ top: 0, behavior: 'smooth' });`,
  'comunicar la vista de turnos'
);

const inicioContenidoBarra = diseno.indexOf('  const contenidoBarra = (abierta) => (');
const finContenidoBarra = diseno.indexOf('\n\n  return (', inicioContenidoBarra);
if (inicioContenidoBarra === -1 || finContenidoBarra === -1) {
  throw new Error('No se encontró contenidoBarra');
}

const contenidoBarraNuevo = `  const contenidoBarra = (abierta) => (\n    <List className="sidebar-list" sx={{ flexGrow: 1 }}>\n      {elementos.map((elemento) => {\n        const Icono = elemento.icono;\n        const esGrupoTurnos = elemento.clave === 'turnos' && elemento.hijos;\n        const hijoTurnosActivo =\n          esGrupoTurnos &&\n          elemento.hijos.some((hijo) => hijo.clave === elementoActivo);\n        const seleccionado =\n          elementoActivo === elemento.clave || Boolean(hijoTurnosActivo);\n\n        const manejarClickPrincipal = () => {\n          if (esGrupoTurnos) {\n            if (!abierta && !esMobile) {\n              setBarraAbierta(true);\n              setTurnosAbierto(true);\n              return;\n            }\n            setTurnosAbierto((valorActual) => !valorActual);\n            return;\n          }\n          seleccionarElemento(elemento);\n        };\n\n        const boton = (\n          <ListItemButton\n            key={elemento.clave}\n            selected={seleccionado}\n            onClick={manejarClickPrincipal}\n            className={\`sidebar-item-button \${seleccionado ? 'active' : ''}\`}\n            sx={{ justifyContent: abierta ? 'initial' : 'center' }}\n          >\n            <ListItemIcon\n              className={\`sidebar-item-icon \${seleccionado ? 'active' : ''}\`}\n              sx={{ minWidth: abierta ? 40 : 0 }}\n            >\n              <Icono />\n            </ListItemIcon>\n            {abierta && (\n              <>\n                <ListItemText\n                  primary={elemento.etiqueta}\n                  className={\`sidebar-item-text \${seleccionado ? 'active' : ''}\`}\n                  primaryTypographyProps={{ fontSize: '1rem' }}\n                />\n                {esGrupoTurnos &&\n                  (turnosAbierto ? <IconoContraer /> : <IconoExpandir />)}\n              </>\n            )}\n          </ListItemButton>\n        );\n\n        const principal = abierta ? (\n          <Box\n            className={\`sidebar-item \${seleccionado ? 'active' : ''}\`}\n          >\n            {boton}\n          </Box>\n        ) : (\n          <Tooltip title={elemento.etiqueta} placement="right">\n            <Box\n              className={\`sidebar-item collapsed \${seleccionado ? 'active' : ''}\`}\n            >\n              {boton}\n            </Box>\n          </Tooltip>\n        );\n\n        if (!esGrupoTurnos || !abierta || !turnosAbierto) {\n          return <Box key={elemento.clave}>{principal}</Box>;\n        }\n\n        return (\n          <Box key={elemento.clave}>\n            {principal}\n            {elemento.hijos.map((hijo) => {\n              const IconoHijo = hijo.icono;\n              const hijoSeleccionado = elementoActivo === hijo.clave;\n              return (\n                <ListItemButton\n                  key={hijo.clave}\n                  selected={hijoSeleccionado}\n                  onClick={() => seleccionarElemento(hijo)}\n                  className={\`sidebar-item-button \${\n                    hijoSeleccionado ? 'active' : ''\n                  }\`}\n                  sx={{ pl: 4.5, minHeight: 48 }}\n                >\n                  <ListItemIcon\n                    className={\`sidebar-item-icon \${\n                      hijoSeleccionado ? 'active' : ''\n                    }\`}\n                    sx={{ minWidth: 40 }}\n                  >\n                    <IconoHijo />\n                  </ListItemIcon>\n                  <ListItemText\n                    primary={hijo.etiqueta}\n                    className={\`sidebar-item-text \${\n                      hijoSeleccionado ? 'active' : ''\n                    }\`}\n                    primaryTypographyProps={{ fontSize: '0.95rem' }}\n                  />\n                </ListItemButton>\n              );\n            })}\n          </Box>\n        );\n      })}\n    </List>\n  );`;

diseno =
  diseno.slice(0, inicioContenidoBarra) +
  contenidoBarraNuevo +
  diseno.slice(finContenidoBarra);

fs.writeFileSync(rutaDiseno, diseno);

const rutaTurnos = 'src/components/portales/TurnosAfiliado.jsx';
let turnos = fs.readFileSync(rutaTurnos, 'utf8');

turnos = reemplazar(
  turnos,
  "import { useState } from 'react';",
  "import { useEffect, useState } from 'react';",
  'importar useEffect'
);

turnos = reemplazar(
  turnos,
  `  const [modo, setModo] = useState('listado');\n  const [pestanaTurnos, setPestanaTurnos] = useState(0);`,
  `  const [modo, setModo] = useState('listado');\n  const [pestanaTurnos, setPestanaTurnos] = useState(0);\n\n  useEffect(() => {\n    const manejarNavegacionTurnos = (evento) => {\n      if (evento.detail?.vista === 'sacar') {\n        setModo('sacar');\n        return;\n      }\n\n      if (evento.detail?.vista === 'listado') {\n        setModo('listado');\n        setPestanaTurnos(0);\n      }\n    };\n\n    window.addEventListener(\n      'medintegral:navegar-turnos',\n      manejarNavegacionTurnos\n    );\n    return () =>\n      window.removeEventListener(\n        'medintegral:navegar-turnos',\n        manejarNavegacionTurnos\n      );\n  }, []);`,
  'escuchar navegación del sidebar'
);

fs.writeFileSync(rutaTurnos, turnos);

const rutaTest = 'tests/menuTurnosAfiliado.test.js';
fs.writeFileSync(
  rutaTest,
  `const fs = require('node:fs');\nconst path = require('node:path');\nconst test = require('node:test');\nconst assert = require('node:assert/strict');\n\nconst leer = (ruta) =>\n  fs.readFileSync(path.join(process.cwd(), ruta), 'utf8');\n\ntest('el afiliado tiene Turnos con Mis turnos y Sacar turno en el sidebar', () => {\n  const diseno = leer('src/layout/DisenoPortal.jsx');\n\n  assert.match(diseno, /etiqueta: 'Turnos'/);\n  assert.match(diseno, /etiqueta: 'Mis turnos'/);\n  assert.match(diseno, /etiqueta: 'Sacar turno'/);\n  assert.match(diseno, /hijos: \\[ELEMENTO_MIS_TURNOS, ELEMENTO_SACAR_TURNO\\]/);\n  assert.match(diseno, /IconoExpandir/);\n  assert.match(diseno, /IconoContraer/);\n});\n\ntest('los accesos del sidebar abren el modo correcto de turnos', () => {\n  const diseno = leer('src/layout/DisenoPortal.jsx');\n  const turnos = leer('src/components/portales/TurnosAfiliado.jsx');\n\n  assert.match(diseno, /vistaTurnos: 'listado'/);\n  assert.match(diseno, /vistaTurnos: 'sacar'/);\n  assert.match(diseno, /medintegral:navegar-turnos/);\n  assert.match(turnos, /medintegral:navegar-turnos/);\n  assert.match(turnos, /evento\.detail\?\.vista === 'sacar'/);\n  assert.match(turnos, /evento\.detail\?\.vista === 'listado'/);\n});\n`
);

console.log('Menú de turnos del afiliado aplicado.');
