const fs = require('node:fs');

fs.writeFileSync(
  'tests/credencialesDemoAcceso.test.js',
  `import fs from 'node:fs';\nimport test from 'node:test';\nimport assert from 'node:assert/strict';\n\nconst leerArchivo = (rutaRelativa) =>\n  fs.readFileSync(new URL(\`../\${rutaRelativa}\`, import.meta.url), 'utf8');\n\ntest('muestra las credenciales demo correspondientes a cada rol', () => {\n  const acceso = leerArchivo('src/pages/portales/Acceso.jsx');\n\n  assert.match(acceso, /Credenciales de demostración/);\n  assert.match(acceso, /admin@medintegral\\.com/);\n  assert.match(acceso, /Admin1234/);\n  assert.match(acceso, /homero@simpson\\.com/);\n  assert.match(acceso, /house@medical\\.com/);\n  assert.match(acceso, /Demo1234/);\n  assert.match(acceso, /CREDENCIALES_DEMO/);\n});\n\ntest('el aviso demo se muestra solamente en la pestaña de ingreso', () => {\n  const acceso = leerArchivo('src/pages/portales/Acceso.jsx');\n\n  assert.match(acceso, /pestana === 0/);\n  assert.match(acceso, /credencialesActuales/);\n});\n`
);

fs.writeFileSync(
  'tests/menuTurnosAfiliado.test.js',
  `import fs from 'node:fs';\nimport test from 'node:test';\nimport assert from 'node:assert/strict';\n\nconst leer = (rutaRelativa) =>\n  fs.readFileSync(new URL(\`../\${rutaRelativa}\`, import.meta.url), 'utf8');\n\ntest('el afiliado tiene Turnos con Mis turnos y Sacar turno en el sidebar', () => {\n  const diseno = leer('src/layout/DisenoPortal.jsx');\n\n  assert.match(diseno, /etiqueta: 'Turnos'/);\n  assert.match(diseno, /etiqueta: 'Mis turnos'/);\n  assert.match(diseno, /etiqueta: 'Sacar turno'/);\n  assert.match(\n    diseno,\n    /hijos: \\[ELEMENTO_MIS_TURNOS, ELEMENTO_SACAR_TURNO\\]/\n  );\n  assert.match(diseno, /IconoExpandir/);\n  assert.match(diseno, /IconoContraer/);\n});\n\ntest('los accesos del sidebar abren el modo correcto de turnos', () => {\n  const diseno = leer('src/layout/DisenoPortal.jsx');\n  const turnos = leer('src/components/portales/TurnosAfiliado.jsx');\n\n  assert.match(diseno, /vistaTurnos: 'listado'/);\n  assert.match(diseno, /vistaTurnos: 'sacar'/);\n  assert.match(diseno, /medintegral:navegar-turnos/);\n  assert.match(turnos, /medintegral:navegar-turnos/);\n  assert.match(turnos, /evento\\.detail\\?\\.vista === 'sacar'/);\n  assert.match(turnos, /evento\\.detail\\?\\.vista === 'listado'/);\n});\n`
);

console.log('Tests convertidos a ES modules.');
