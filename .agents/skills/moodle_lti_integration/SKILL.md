---
name: IntegraLaboratoriosMoodleLTI
description: Guía detallada y paso a paso para convertir laboratorios virtuales en herramientas LTI 1.3 integradas con Moodle.
---

# Skill: Integración de Laboratorios Virtuales con Moodle vía LTI 1.3

## Contexto y Objetivo
Esta skill contiene las instrucciones precisas para transformar cualquier aplicación de laboratorio virtual (React/Vite en el Frontend + Node/Express en el Backend) en una herramienta **LTI 1.3**. Esto permite integrarla perfectamente con Moodle, facilitando la autenticación automática de estudiantes, herencia del contexto (curso, roles) y sincronización automatizada de calificaciones directamente al libro de notas de Moodle.

## Arquitectura LTI 1.3 Implementada
El flujo consta de dos componentes fundamentales que colaboran entre sí:
1. **Backend (LTI Provider)**: Utiliza la librería `ltijs` actuando como puente seguro. Se encarga de procesar el "Launch" (handshake OIDC), registrar la plataforma (Moodle), validar las firmas JWT, y almacenar el estado de la sesión en base de datos (Ej. SQLite). Como respuesta inicial exitosa, retorna al Frontend un token temporal de sesión llamado **LTIK**.
2. **Frontend (SPA/React)**: Se encarga de interceptar el `ltik` desde la URL (pasado por redirección), lo guarda en `sessionStorage` (para sobrevivir a recargas dentro del iframe) y lo envía en cada petición al backend.

---

## Pasos de Implementación Obligatorios

### Fase 1: Configuración del Backend (Express.js)

1. **Dependencias Base**:
   Asegúrate de instalar los paquetes fundamentales en el directorio del servidor:
   ```bash
   npm install express ltijs ltijs-sequelize dotenv cors jsonwebtoken sqlite3
   ```

2. **Configuración Inicial del Proveedor (`index.js` o `server.js`)**:
   Implementa la configuración maestra de `ltijs`:
   - Utiliza `lti.setup()` inyectando tu llave secreta (`LTI_KEY`), y define una base de datos temporal (SQLite es ideal para la persistencia del estado LTI).
   - Activa el modo fundamental: `ltiaas: true` (LTI as a Service), ideal para arquitecturas desacopladas SPA (Single Page Applications).
   - Asegura la transmisión de cookies agregando la configuración: `cookies: { secure: true, sameSite: 'None' }`.
   - Habilita `lti.app.enable('trust proxy')` para evitar fallos de protocolo HTTPS detrás de Load Balancers o PaaS (Heroku, Render, Railway).
   - Configura un middleware global `cors()` restringido a la URL del frontend.

3. **Registro Dinámico o Estático y Handshake**:
   - Registra Moodle como plataforma en `ltijs` con `lti.registerPlatform()` inyectando cliente, endpoints de autenticación, token y JWKS extraídos de las variables de entorno.
   - Intercepta el evento de conexión `lti.onConnect(async (token, req, res) => {...})`. Su única función aquí es concatenar el `res.locals.ltik` a la URL del frontend configurado y lanzar un `lti.redirect(res, urlCompleta)`.

4. **Creación de Rutas Seguras Seguidas por LTI (`routes.js`)**:
   Crea middlewares personalizados:
   - **`verifyLti`**: Intercepta toda petición API del frontend. Extrae el token `ltik` desde los query params o headers de autorización y los valida localmente con `jsonwebtoken` usando tu `process.env.LTI_KEY`.
   - **Endpoint `GET /api/me`**: Retorna el contexto educativo, roles, IDs y nombre del usuario logueado en base al token decodificado.
   - **Endpoint `POST /api/grade`**: Recibe un payload con `score` y `comment`, invoca el método `lti.Grade.scorePublish()` pasándole la nota calculada (0-100) e inyectándola al libro de Moodle.

---

### Fase 2: Configuración del Frontend (React/Vite)

1. **Gestión de Sesión con Hook (`useLTI.ts`)**:
   Crea un React Hook que supervise el ciclo de vida de conexión al montar la aplicación:
   - Lee `window.location.search` (`?ltik=...`) o `window.location.hash`, así como el `sessionStorage`.
   - Si encuentra un token nuevo en la URL, guárdalo en almacenamiento y **limpia inmediatamente la URL** de forma silenciosa para que no quede expuesto utilizando `window.history.replaceState`.
   - Realiza una validación contra el backend solicitando `/api/me?ltik={token}`. Extrae el Nombre del Coder, Contexto de Curso y el identificador, y guarda esto en el gestor de estado global o local.

2. **Capa de Servicios de Calificación (`moodleService.ts`)**:
   Crea la función responsable del pase de nota:
   - `submitLtiGrade(evaluation)`
   - Crea un `POST` usando Fetch hacia el endpoint remoto `/api/grade?ltik={token_ltik_activo}`.
   - Agrega el encabezado: `Authorization: Bearer {token_ltik_activo}`. (Soporte dual Query/Header ayuda a evitar bloqueos de terceros en iframes modernos).

3. **Adecuación Visual de Integración UI**:
   - Integra un Header, Panel de Control o Componente Global que indique el "Estado de Integración".
   - Si la Tool carga sin LTI (stand-alone), desactiva sutilmente la sincronización o muestra una advertencia.
   - Refleja al usuario que su actividad será sincronizada cuando complete el laboratorio (notificaciones toast, progresos de barra color verde al sincronizar).

---

### Fase 3: Despliegue y Variables de Entorno

**Backend Environment (`.env`)**:
Requiere obligatoriamente un Setup previo para LTI 1.3 Advantage:
```env
PORT=3000
LTI_KEY="LlaveSecretaEncriptadaParaFirmarLtikLocalmente"
FRONTEND_URL="https://frontend-del-laboratorio.web.app"
MOODLE_URL="https://lms.tu-institucion.edu"
MOODLE_CLIENT_ID="12345678-abcd-xxxx"
MOODLE_AUTH_ENDPOINT="https://lms.../mod/lti/auth.php"
MOODLE_TOKEN_ENDPOINT="https://lms.../mod/lti/token.php"
MOODLE_JWKS_URL="https://lms.../mod/lti/certs.php"
```

**Frontend Environment (`.env`)**:
Apunta todas las peticiones asíncronas al Endpoint Central:
```env
VITE_API_URL="https://backend-lti-proveedor.up.railway.app"
```

## Resumen de Reglas Críticas ("Gotchas" de LTI en SPAs)
* **El paradigma Iframe/Third-Party Cookies**: Puesto que el Lab se renderiza en un `iframe` dentro de Moodle, Chrome y Safari pueden bloquear cookies de sesión tradicionales. Por este motivo, el uso de **`ltiaas: true` (LTIK)** es mandatario.
* **Redundancia Dual Token**: Pasa el token como Header de Autenticación (`Bearer`) **Y** como Query String (`?ltik=xx`). Ciertos proxies Ingress (como los de plataformas PaaS) purgan custom-headers pero respetan el querystring.
* **Seguridad Cross-Site**: Jamás dejes el `ltik` visualmente en la URL del navegador después de la carga inicial. Utiliza manipulación de historial de API para preservar estética y evitar ataques de filtración.
