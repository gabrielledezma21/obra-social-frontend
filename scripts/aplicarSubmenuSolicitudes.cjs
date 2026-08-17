const fs = require('node:fs');

const ruta = 'src/layout/DisenoPortal.jsx';
let contenido = fs.readFileSync(ruta, 'utf8');

const reemplazar = (anterior, nuevo, descripcion) => {
  if (!contenido.includes(anterior)) {
    throw new Error(`No se encontró el bloque: ${descripcion}`);
  }
  contenido = contenido.replace(anterior, nuevo);
};

reemplazar(
  `const ELEMENTO_MIS_TURNOS = {`,
  `const ELEMENTO_MIS_SOLICITUDES = {\n  clave: 'mis-solicitudes',\n  etiqueta: 'Mis solicitudes',\n  icono: IconoSolicitudes,\n  pestana: 1,\n};\n\nconst ELEMENTO_NUEVA_SOLICITUD = {\n  clave: 'nueva-solicitud',\n  etiqueta: 'Nueva solicitud',\n  icono: IconoSolicitudNueva,\n  pestana: 0,\n};\n\nconst ELEMENTO_MIS_TURNOS = {`,
  'constantes de solicitudes'
);

reemplazar(
  `  {\n    clave: 'nueva-solicitud',\n    etiqueta: 'Nueva solicitud',\n    icono: IconoSolicitudNueva,\n    pestana: 0,\n  },\n  {\n    clave: 'solicitudes',\n    etiqueta: 'Solicitudes',\n    icono: IconoSolicitudes,\n    pestana: 1,\n  },`,
  `  {\n    clave: 'solicitudes',\n    etiqueta: 'Solicitudes',\n    icono: IconoSolicitudes,\n    hijos: [ELEMENTO_MIS_SOLICITUDES, ELEMENTO_NUEVA_SOLICITUD],\n  },`,
  'grupo de solicitudes'
);

contenido = contenido.replace(
  /onClick=\{\(\) => seleccionarElemento\(ELEMENTOS_AFILIADO\[2\]\)\}/g,
  "onClick={() => seleccionarElemento(ELEMENTO_MIS_SOLICITUDES)}"
);
contenido = contenido.replace(
  /onClick=\{\(\) => seleccionarElemento\(ELEMENTOS_AFILIADO\[1\]\)\}/g,
  "onClick={() => seleccionarElemento(ELEMENTO_NUEVA_SOLICITUD)}"
);
contenido = contenido.replace(
  /onClick=\{\(\) => seleccionarElemento\(ELEMENTOS_AFILIADO\[4\]\)\}/g,
  "onClick={() => seleccionarElemento(ELEMENTOS_AFILIADO[3])}"
);

reemplazar(
  `  const [elementoActivo, setElementoActivo] = useState('resumen');\n  const [turnosAbierto, setTurnosAbierto] = useState(false);`,
  `  const [elementoActivo, setElementoActivo] = useState('resumen');\n  const [grupoAbierto, setGrupoAbierto] = useState(null);`,
  'estado genérico de grupos'
);

const inicio = contenido.indexOf('  const contenidoBarra = (abierta) => (');
const fin = contenido.indexOf('\n\n  return (', inicio);
if (inicio === -1 || fin === -1) throw new Error('No se encontró contenidoBarra');

const nuevoBloque = `  const contenidoBarra = (abierta) => (\n    <List className="sidebar-list" sx={{ flexGrow: 1 }}>\n      {elementos.map((elemento) => {\n        const Icono = elemento.icono;\n        const esGrupo = Boolean(elemento.hijos?.length);\n        const hijoActivo =\n          esGrupo && elemento.hijos.some((hijo) => hijo.clave === elementoActivo);\n        const seleccionado = elementoActivo === elemento.clave || Boolean(hijoActivo);\n        const estaAbierto = grupoAbierto === elemento.clave;\n\n        const manejarClickPrincipal = () => {\n          if (esGrupo) {\n            if (!abierta && !esMobile) {\n              setBarraAbierta(true);\n              setGrupoAbierto(elemento.clave);\n              return;\n            }\n            setGrupoAbierto((grupoActual) =>\n              grupoActual === elemento.clave ? null : elemento.clave\n            );\n            return;\n          }\n          seleccionarElemento(elemento);\n        };\n\n        const boton = (\n          <ListItemButton\n            key={elemento.clave}\n            selected={seleccionado}\n            onClick={manejarClickPrincipal}\n            className={\`sidebar-item-button \${seleccionado ? 'active' : ''}\`}\n            sx={{ justifyContent: abierta ? 'initial' : 'center' }}\n          >\n            <ListItemIcon\n              className={\`sidebar-item-icon \${seleccionado ? 'active' : ''}\`}\n              sx={{ minWidth: abierta ? 40 : 0 }}\n            >\n              <Icono />\n            </ListItemIcon>\n            {abierta && (\n              <>\n                <ListItemText\n                  primary={elemento.etiqueta}\n                  className={\`sidebar-item-text \${seleccionado ? 'active' : ''}\`}\n                  primaryTypographyProps={{ fontSize: '1rem' }}\n                />\n                {esGrupo &&\n                  (estaAbierto ? <IconoContraer /> : <IconoExpandir />)}\n              </>\n            )}\n          </ListItemButton>\n        );\n\n        const principal = abierta ? (\n          <Box className={\`sidebar-item \${seleccionado ? 'active' : ''}\`}>\n            {boton}\n          </Box>\n        ) : (\n          <Tooltip title={elemento.etiqueta} placement="right">\n            <Box\n              className={\`sidebar-item collapsed \${seleccionado ? 'active' : ''}\`}\n            >\n              {boton}\n            </Box>\n          </Tooltip>\n        );\n\n        if (!esGrupo || !abierta || !estaAbierto) {\n          return <Box key={elemento.clave}>{principal}</Box>;\n        }\n\n        return (\n          <Box key={elemento.clave}>\n            {principal}\n            {elemento.hijos.map((hijo) => {\n              const IconoHijo = hijo.icono;\n              const hijoSeleccionado = elementoActivo === hijo.clave;\n              return (\n                <ListItemButton\n                  key={hijo.clave}\n                  selected={hijoSeleccionado}\n                  onClick={() => seleccionarElemento(hijo)}\n                  className={\`sidebar-item-button \${\n                    hijoSeleccionado ? 'active' : ''\n                  }\`}\n                  sx={{ pl: 4.5, minHeight: 48 }}\n                >\n                  <ListItemIcon\n                    className={\`sidebar-item-icon \${\n                      hijoSeleccionado ? 'active' : ''\n                    }\`}\n                    sx={{ minWidth: 40 }}\n                  >\n                    <IconoHijo />\n                  </ListItemIcon>\n                  <ListItemText\n                    primary={hijo.etiqueta}\n                    className={\`sidebar-item-text \${\n                      hijoSeleccionado ? 'active' : ''\n                    }\`}\n                    primaryTypographyProps={{ fontSize: '0.95rem' }}\n                  />\n                </ListItemButton>\n              );\n            })}\n          </Box>\n        );\n      })}\n    </List>\n  );`;

contenido = contenido.slice(0, inicio) + nuevoBloque + contenido.slice(fin);
fs.writeFileSync(ruta, contenido);

const rutaTest = 'tests/menuTurnosAfiliado.test.js';
let test = fs.readFileSync(rutaTest, 'utf8');
test += `\n\ntest('Solicitudes agrupa Mis solicitudes y Nueva solicitud en el sidebar', () => {\n  const diseno = leer('src/layout/DisenoPortal.jsx');\n\n  assert.match(diseno, /etiqueta: 'Solicitudes'/);\n  assert.match(diseno, /etiqueta: 'Mis solicitudes'/);\n  assert.match(diseno, /etiqueta: 'Nueva solicitud'/);\n  assert.match(\n    diseno,\n    /hijos: \\[ELEMENTO_MIS_SOLICITUDES, ELEMENTO_NUEVA_SOLICITUD\\]/\n  );\n  assert.match(diseno, /const esGrupo = Boolean\\(elemento\\.hijos\\?\\.length\\)/);\n  assert.match(diseno, /grupoAbierto === elemento\\.clave/);\n});\n`;
fs.writeFileSync(rutaTest, test);

console.log('Submenú de solicitudes aplicado.');
