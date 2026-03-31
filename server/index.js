import express from 'express';
import { Provider } from 'ltijs';
import ltijsSequelize from 'ltijs-sequelize';
const { Database } = ltijsSequelize;
import dotenv from 'dotenv';
import cors from 'cors';
import { setupLtiRoutes } from './routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// ============================================================
// Variables de entorno
// Orden de carga: .env.local (desarrollo) → .env (producción)
// ============================================================
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3001', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const LTI_KEY = process.env.LTI_KEY || 'LlaveSecretaEncriptadaParaFirmarLtikLocalmente';
const DB_PATH = process.env.MAC_DB_PATH || path.join(__dirname, 'lti-estado.sqlite');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ============================================================
// Configuración del proveedor LTI 1.3 con ltijs
// ============================================================
const dbPlugin = new Database({
  dialect: 'sqlite',
  storage: DB_PATH,
  logging: false,
});

Provider.setup(
  LTI_KEY,
  { plugin: dbPlugin },
  {
    staticPath: path.join(__dirname, '../public'),
    cookies: {
      // En producción (HTTPS con iframe desde Moodle) DEBE ser secure:true y SameSite:None
      secure: IS_PRODUCTION,
      sameSite: 'None',
    },
    devMode: !IS_PRODUCTION,
    ltiaas: true, // Modo LTI as a Service requerido para SPAs en iframe
  }
);

// Indispensable para funcionar correctamente detrás de reverse proxies
// (Railway, Render, Heroku, nginx, etc.)
Provider.app.enable('trust proxy');

// CORS restringido únicamente al frontend React
Provider.app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ltik'],
    credentials: true,
  })
);

// ============================================================
// Callback de lanzamiento LTI (OIDC Login → Redirect al frontend)
// ============================================================
Provider.onConnect((token, req, res) => {
  // Inyectar el LTIK como query param para que el SPA lo intercepte
  const redirectUrl = new URL(FRONTEND_URL);
  redirectUrl.searchParams.set('ltik', res.locals.ltik);
  return Provider.redirect(res, redirectUrl.toString());
});

// ============================================================
// Arranque del servidor
// ============================================================
async function start() {
  await Provider.deploy({ port: PORT, serverless: false });

  // Registro dinámico de la plataforma Moodle si las variables están definidas
  if (process.env.MOODLE_URL && process.env.MOODLE_CLIENT_ID) {
    try {
      await Provider.registerPlatform({
        url: process.env.MOODLE_URL,
        name: 'Moodle Institucional',
        clientId: process.env.MOODLE_CLIENT_ID,
        authenticationEndpoint: process.env.MOODLE_AUTH_ENDPOINT,
        accesstokenEndpoint: process.env.MOODLE_TOKEN_ENDPOINT,
        authConfig: {
          method: 'JWK_SET',
          key: process.env.MOODLE_JWKS_URL,
        },
      });
      console.log('✅ Plataforma Moodle registrada:', process.env.MOODLE_URL);
    } catch {
      console.warn('⚠️  Plataforma posiblemente ya registrada. Omitiendo registro duplicado.');
    }
  } else {
    console.warn('⚠️  MOODLE_URL / MOODLE_CLIENT_ID no configurados. Modo desarrollo sin Moodle.');
  }

  // Montar las rutas API protegidas por LTI
  setupLtiRoutes(Provider.app, Provider);

  console.log(`🚀 LTI Provider corriendo en el puerto ${PORT} [${IS_PRODUCTION ? 'PRODUCCIÓN' : 'DESARROLLO'}]`);
  console.log(`   Frontend: ${FRONTEND_URL}`);
  console.log(`   Base de datos: ${DB_PATH}`);
}

start().catch((err) => {
  console.error('❌ Error fatal al iniciar el servidor LTI:', err);
  process.exit(1);
});
