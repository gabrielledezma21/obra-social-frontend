# MedIntegral - Frontend

Interfaz web de **MedIntegral**, desarrollada con React, Vite y Material UI. La aplicación integra en un mismo frontend los módulos de Administración, Afiliados y Prestadores, conectados a la API real mediante Axios.

La **versión actual fue desarrollada por Gabriel Ledezma**. El proyecto tomó como punto de partida una versión anterior realizada en equipo, en la que también participé, pero esta implementación fue ampliamente rediseñada, refactorizada, ampliada e integrada y ya no corresponde a aquella versión original.

## Estado del proyecto

La aplicación se encuentra en etapa de integración y validación. La rama de trabajo actual incluye navegación por roles, pruebas de regresión, validación de contratos HTTP, filtros administrativos y los flujos principales de turnos, solicitudes e historia clínica.

## Tecnologías

- React 19
- Vite 7
- React Router
- Material UI
- Axios
- Day.js
- JavaScript
- ESLint
- Prettier
- Husky + lint-staged
- Node Test Runner
- GitHub Actions

## Roles y experiencias

MedIntegral integra tres experiencias dentro de la misma aplicación:

```text
ADMIN
AFILIADO
PRESTADOR
```

El acceso y la navegación se adaptan al rol autenticado.

## Administración

Las vistas administrativas están agrupadas bajo:

```text
/administracion
```

### Dashboard

El dashboard muestra indicadores de:

- afiliados;
- prestadores;
- agendas;
- especialidades;
- recordatorios y distribuciones administrativas.

Las tarjetas de Afiliados, Prestadores y Agendas funcionan como accesos directos a sus listados dentro de `/administracion/...`.

### Afiliados

- Listado de afiliados e integrantes de grupos familiares.
- Búsqueda y filtros avanzados.
- Alta de afiliados.
- Edición de datos personales y contractuales.
- Plan, vigencia, contacto y domicilio.
- Gestión de titulares e integrantes.
- Baja y reincorporación individual o del grupo familiar.

Los filtros permiten combinar, entre otros criterios:

- estado;
- credencial o documento;
- plan;
- provincia y localidad;
- vigencia;
- fechas;
- teléfono;
- email;
- búsqueda general.

### Prestadores

- Listado de profesionales y centros médicos.
- Búsqueda y filtros avanzados.
- Alta y edición.
- Especialidades.
- Centros de atención.
- Direcciones, teléfonos y emails.
- Relaciones entre profesionales y centros médicos.

Los filtros contemplan tipo de prestador, especialidad, provincia, localidad, fecha y búsqueda general.

### Agendas

- Listado de agendas.
- Alta y edición.
- Días de atención.
- Bloques horarios.
- Duración de turnos.
- Prestador, especialidad y centro de atención.
- Filtros combinables por ubicación, día, duración, horario y búsqueda.

### Reportes

La sección `/administracion/reportes` consume los reportes administrativos de la API y permanece integrada al layout administrativo.

## Portal del afiliado

Ruta principal:

```text
/portal/afiliado
```

### Resumen

El dashboard del afiliado muestra información relevante de su cuenta, solicitudes y próximos turnos.

### Solicitudes

El afiliado puede crear y consultar:

- recetas;
- autorizaciones;
- reintegros.

Las solicitudes pueden recorrer los estados:

```text
Recibido
En análisis
Observado
Aprobado
Rechazado
```

Cuando una solicitud está observada, el afiliado puede responder la observación para continuar el flujo.

### Turnos

Turnos funciona como una única sección de gestión, similar al patrón de listados administrativos.

La pantalla permite:

- ver **Próximos**;
- ver **Anteriores**;
- cancelar una reserva cuando corresponde;
- utilizar la acción **Sacar turno** para abrir el buscador de disponibilidad.

Un turno se clasifica utilizando **fecha + hora de Argentina**, no únicamente el día calendario.

### Sacar turno

La búsqueda de disponibilidad permite combinar:

- médico o prestador;
- especialidad;
- localidad;
- día de la semana;
- horario desde/hasta.

El médico se busca mediante autocompletado remoto a medida que se escribe, evitando cargar una lista completa de prestadores.

Si no se selecciona un día, se muestran automáticamente los próximos espacios libres disponibles.

Después de reservar, la aplicación vuelve al listado de próximos turnos para mostrar inmediatamente la reserva creada.

### Cartilla médica

La cartilla es **solo de consulta**. No mezcla acciones de reserva.

Utiliza un listado compacto similar al de Prestadores de Administración, con:

- buscador;
- prestador;
- tipo;
- especialidades;
- direcciones;
- teléfonos;
- emails;
- paginación.

## Portal del prestador

Ruta principal:

```text
/portal/prestador
```

### Bandeja de solicitudes

El prestador puede consultar solicitudes y gestionar sus estados según las reglas del backend.

### Turnos

Permite consultar los turnos correspondientes al profesional y registrar la atención cuando corresponde.

### Historia clínica

La historia clínica se encuentra unificada en una sola sección. Ya no es necesario buscar un afiliado en una pantalla y cambiar después a otra sección.

El flujo actual es:

```text
Buscar paciente -> seleccionar -> consultar historia en la misma pantalla
```

El buscador permite encontrar afiliados por:

- nombre;
- apellido;
- DNI;
- credencial;
- teléfono.

Al seleccionar un paciente se muestran en la misma vista:

- datos principales;
- situaciones terapéuticas activas y finalizadas;
- historia clínica completa;
- filtro para consultar únicamente las notas del profesional;
- acciones relacionadas con situaciones terapéuticas.

## Autenticación

La aplicación soporta:

- inicio de sesión por rol;
- activación de afiliados y prestadores;
- cambio obligatorio de contraseña temporal;
- rutas protegidas;
- redirección según rol;
- token centralizado en el cliente Axios.

Todas las llamadas protegidas utilizan:

```text
Authorization: Bearer <token>
```

El cierre de sesión del portal de Afiliado y Prestador se mantiene únicamente en la navbar superior para evitar acciones duplicadas.

## Rutas principales

### Administración

```text
/administracion
/administracion/reportes
/administracion/afiliados/listado
/administracion/afiliados/alta
/administracion/afiliados/detalle/:id
/administracion/prestadores/listado
/administracion/prestadores/alta
/administracion/prestadores/detalle/:id
/administracion/agenda-turnos/listado
/administracion/agenda-turnos/alta
/administracion/agenda-turnos/detalle/:id
```

### Portales

```text
/portal/acceso
/portal/afiliado
/portal/prestador
/cambiar-contrasena
```

## Estructura del proyecto

```text
/public
/src
├── assets          recursos estáticos
├── components      componentes reutilizables
├── context         contextos globales
├── hooks           hooks personalizados
├── layout          layouts, navbar y sidebars
├── mocks           datos simulados heredados
├── pages           vistas y portales
├── services        cliente API, adaptadores y servicios
└── utils           filtros, formateadores y utilidades
/tests              regresiones y contratos
```

## Instalación

```bash
git clone https://github.com/gabrielledezma21/obra-social-frontend.git
cd obra-social-frontend
npm install
```

## Configuración

Crear un archivo `.env` si se necesita configurar explícitamente la API:

```env
VITE_API_URL=http://localhost:3002
```

En desarrollo local normalmente se utiliza:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3002
```

`VITE_API_URL` debe apuntar a la raíz del backend y no debe agregar `/api` salvo que el despliegue real del backend lo requiera explícitamente.

## Ejecución local

```bash
npm run dev
```

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | inicia Vite en desarrollo |
| `npm run build` | genera el build de producción |
| `npm run preview` | previsualiza el build |
| `npm test` | ejecuta las regresiones y contratos |
| `npm run lint` | valida ESLint y Prettier integrados |
| `npm run lint:fix` | corrige automáticamente lo posible |
| `npm run format` | aplica Prettier |

## Pruebas automatizadas

Ejecutar:

```bash
npm test
```

Las pruebas actuales verifican, entre otros casos:

- adaptación de afiliados, prestadores y agendas;
- número de integrante, parentesco y relaciones familiares;
- conversión de horarios;
- paginación y búsquedas;
- filtros de afiliados;
- filtros de prestadores;
- filtros de agendas;
- rutas administrativas bajo `/administracion/...`;
- navegación de las tarjetas del dashboard;
- navegación de Reportes;
- contratos HTTP administrativos;
- contratos del portal del afiliado;
- contratos del portal del prestador;
- autenticación centralizada;
- búsqueda de turnos por filtros;
- autocompletado remoto de profesionales;
- clasificación de turnos próximos y anteriores;
- separación entre Cartilla médica y reserva de turnos;
- historia clínica unificada del prestador;
- cierre de sesión únicamente desde la navbar.

Estas pruebas son principalmente regresiones de lógica, rutas, adaptadores y contratos. No sustituyen por completo una prueba E2E de navegador, por lo que antes de una publicación definitiva conviene realizar también un smoke test manual de los flujos principales.

## Calidad de código

Validar ESLint:

```bash
npm run lint
```

Corregir automáticamente:

```bash
npm run lint:fix
```

Compilar:

```bash
npm run build
```

Antes de integrar cambios importantes se recomienda ejecutar:

```bash
npm test
npm run lint
npm run build
```

## Integración continua

El workflow `.github/workflows/pruebas-frontend.yml` ejecuta automáticamente:

```bash
npm ci
npm audit --audit-level=high
npm test
npm run lint
npm run build
```

La CI falla ante:

- vulnerabilidades de severidad alta;
- regresiones automatizadas;
- errores de ESLint/Prettier;
- errores de compilación.

## Validación manual recomendada

Antes de publicar una nueva versión conviene comprobar al menos:

### Administración

- dashboard y accesos rápidos;
- edición y persistencia de afiliados;
- edición de integrantes del grupo familiar;
- baja y reincorporación;
- edición de prestadores;
- edición de agendas;
- filtros de los tres listados;
- Reportes.

### Afiliado

- solicitudes;
- búsqueda de disponibilidad;
- reserva de turno;
- próximos y anteriores;
- cancelación;
- cartilla médica.

### Prestador

- bandeja de solicitudes;
- turnos;
- búsqueda de pacientes;
- historia clínica;
- notas de atención;
- situaciones terapéuticas.

Después de una edición importante, recargar la página y volver a consultar el registro ayuda a comprobar que el cambio quedó persistido en backend y no solamente en el estado local de React.

## Despliegue

El proyecto es una SPA de Vite. `vercel.json` permite que React Router resuelva correctamente rutas internas al refrescar el navegador.

En producción debe configurarse:

```env
VITE_API_URL=https://tu-backend.example.com
```

El backend debe permitir el origen del frontend mediante su configuración `CORS_ORIGIN`.

## Autoría

**Desarrollado actualmente por [Gabriel Ledezma](https://github.com/gabrielledezma21).**

MedIntegral Frontend se basa conceptualmente en una versión previa realizada en equipo, en la que también participé. La versión de este repositorio fue posteriormente rediseñada, refactorizada, ampliada e integrada por mí para unificar Administración, Afiliados y Prestadores sobre la API actual. Por ese motivo, esta implementación se considera una evolución propia y ya no representa el proyecto grupal original.
