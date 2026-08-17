# MedIntegral – Frontend

Interfaz de usuario del sistema **MedIntegral**, construida con React, Vite y Material UI.

---

## Descripción

MedIntegral integra tres experiencias dentro de la misma aplicación:

- **Administración**: afiliados, grupos familiares, prestadores, agendas y reportes.
- **Portal del afiliado**: cartilla, turnos y solicitudes.
- **Portal del prestador**: solicitudes, pacientes, situaciones terapéuticas, turnos e historia clínica.

La aplicación consume la API de MedIntegral y mantiene navegación, autenticación y permisos según el rol del usuario.

---

## Funcionalidades principales

### Administración

- Gestión de afiliados y todos los integrantes del grupo familiar.
- Baja y reincorporación individual o de todo el grupo familiar.
- Gestión de prestadores y centros médicos.
- Gestión de agendas y horarios.
- Reportes administrativos.

### Afiliados

- Dashboard de resumen.
- Cartilla médica.
- Disponibilidad y reserva de turnos.
- Cancelación y consulta de turnos.
- Solicitudes de recetas, autorizaciones y reintegros.
- Respuesta a solicitudes observadas.

### Prestadores

- Dashboard profesional.
- Bandeja de solicitudes.
- Gestión del estado de solicitudes.
- Búsqueda de afiliados.
- Situaciones terapéuticas.
- Turnos.
- Historia clínica y notas de atención.

### Autenticación

- Acceso por roles `ADMIN`, `AFILIADO` y `PRESTADOR`.
- Activación de cuentas de afiliados y prestadores.
- Cambio obligatorio de contraseña temporal.
- Token centralizado en el cliente Axios para todas las llamadas protegidas.

---

## Estructura general

```text
/public                  recursos públicos
/src
├── assets               imágenes y recursos estáticos
├── components           componentes reutilizables de UI
├── context              contextos globales de React
├── hooks                hooks personalizados
├── layout               headers, sidebars, footers y layouts
├── mocks                datos simulados heredados para desarrollo
├── pages                vistas asociadas a rutas
├── services             cliente API, servicios y adaptadores
└── utils                formateadores, validadores y utilidades
/tests                   pruebas de regresión y contratos
```

---

## Instalación y desarrollo local

```bash
git clone https://github.com/gabrielledezma21/obra-social-frontend.git
cd obra-social-frontend
npm install
```

Para desarrollo:

```bash
npm run dev
```

Vite utiliza normalmente:

```text
http://localhost:5173
```

La API local predeterminada es:

```text
http://localhost:3002
```

También puede configurarse explícitamente:

```env
VITE_API_URL=http://localhost:3002
```

---

## Pruebas y validación

Ejecutar las pruebas de regresión y contratos:

```bash
npm test
```

Validar formato y reglas del código:

```bash
npm run lint
```

Compilar para producción:

```bash
npm run build
```

La suite `tests/*.test.js` protege, entre otros casos:

- adaptación de afiliados, prestadores y agendas recibidos desde la API;
- número de integrante y parentesco de grupos familiares;
- conversión de horarios;
- paginación y búsqueda;
- rutas administrativas bajo `/administracion/...`;
- enlaces de alta y detalle;
- contratos HTTP de los servicios administrativos;
- contratos HTTP de los portales de afiliado y prestador;
- contratos de autenticación;
- interceptor central de `Authorization: Bearer <token>`.

### Integración continua

`.github/workflows/pruebas-frontend.yml` ejecuta automáticamente:

```bash
npm ci
npm audit --audit-level=high
npm test
npm run lint
npm run build
```

La CI falla si aparece una vulnerabilidad alta, una regresión de servicios, un error de ESLint o un fallo de compilación.

---

## Despliegue en Vercel

El proyecto está preparado como SPA de Vite. `vercel.json` redirige las rutas de React Router a `index.html`.

Configurar:

```env
VITE_API_URL=https://medintegral-api.vercel.app
```

La URL no debe incluir el sufijo `/api`.

---

## Tecnologías

- React 19
- Vite
- React Router
- JavaScript
- Material UI
- Axios
- ESLint
- Prettier
- Node Test Runner para pruebas de regresión
- GitHub Actions

---

## Equipo

- [Ailen Pisoni](https://github.com/AilenPisoni0)
- [Alina Marquez](https://github.com/alymarquez)
- [Melina Alvarez](https://github.com/MeliAlvarez14)
- [Cristian Gonzalez](https://github.com/CristianEGonzalez)
- [Gabriel Ledezma](https://www.github.com/gabrielledezma21/)
