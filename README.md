# MedIntegral – Frontend

> Interfaz de usuario del sistema **MedIntegral**, construida con React y Vite.  
> <img width="4032" height="2302" alt="image" src="https://github.com/user-attachments/assets/50fe2b69-f212-4664-b207-0d57e66fc93b" />

---

## Descripción

MedIntegral-frontend es la parte visual del proyecto MedIntegral, pensado para administrar la gestión de datos médicos / de salud (turnos, pacientes, historial, etc.). El frontend consume una API (backend), presentando formularios, vistas y componentes de interfaz para que los administrativos accedan a las funcionalidades del sistema.

---

## Aplicación Productiva

La versión productiva de MedIntegral se encuentra actualmente desplegada y accesible en:

[https://medintegral.vmdigitai.com/](https://medintegral.vmdigitai.com/)

Desde esta instancia se puede acceder a todas las funcionalidades principales del sistema:

- Gestión de prestadores

- Administración de agendas y horarios

- Manejo de afiliados

- Estadísticas en tiempo real

- Navegación optimizada y UI responsiva

La aplicación se actualiza automáticamente con cada merge a dev de este repositorio.

---

## Estructura general

```
/public – recursos públicos, index.html, favicon, etc.
/src – código fuente React JSX
├── assets – imágenes, logos, estilos y otros recursos estáticos.
├── components – omponentes reutilizables de UI usados en distintas partes de la app.
├── context – contextos globales de React.
├── hooks – hooks personalizados con lógica reutilizable (fetch, formularios, helpers).
├── layout - componentes estructurales como headers, sidebars, footers y layouts de página.
├── mocks  – datos simulados para desarrollo sin backend o para testing manual.
├── pages – vistas completas asociadas a rutas; representan pantallas de la aplicación.
├── services – funciones para interactuar con la API: fetch/axios, manejo de errores, mappers.
├── utils – utilidades genéricas: formateadores, validadores y funciones auxiliares.
```

Esta organización sigue buenas prácticas de proyectos React + Vite, manteniendo una arquitectura modular y legible.

---

## Instalación / Desarrollo local

1. Clonar el repositorio

```
 git clone https://github.com/DesApp-2025c2-Grupo3/MedIntegral-frontend.git
 cd MedIntegral-frontend
```

2. Instalar dependencias

```
npm install
```

3. Ejecutar en modo desarrollo (con recarga automática — HMR)

```
npm run dev
```

4. Abrir en el browser en la URL que indique la terminal (por defecto suele ser http://localhost:3000)
   5.(Opcional) Linter / formateo: si querés asegurarte de seguir las reglas de estilo/proyectos

```
npm run lint
npm run format
```

## Despliegue en Vercel

El proyecto está preparado como una SPA de Vite. Al importarlo en Vercel, la
configuración se detecta automáticamente y `vercel.json` redirige las rutas de
React Router a `index.html`.

Configurar la siguiente variable de entorno en Vercel:

```env
VITE_API_URL=https://medintegral-api.vercel.app
```

La URL no debe incluir el sufijo `/api`. Para desarrollo local se utiliza
`http://localhost:3002` cuando `VITE_API_URL` no está definida.

Este frontend incluye una capa de adaptación para el contrato actual de la API
de MedIntegral. Los catálogos fijos (planes, documentos, parentescos y
provincias) se mantienen en el cliente porque el backend no expone esos
endpoints.

---

## Tecnologías

- React + Vite
- React Routes
- JavaScript
- Material UI
- ESLint / Prettier

---

## Equipo

- [Ailen Pisoni](https://github.com/AilenPisoni0)
- [Alina Marquez](https://github.com/alymarquez)
- [Melina Alvarez](https://github.com/MeliAlvarez14)
- [Cristian Gonzalez](https://github.com/CristianEGonzalez)
- [Gabriel Ledezma](https://www.github.com/gabrielledezma21/)
