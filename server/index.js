import express from 'express';
import { Provider } from 'ltijs';
import { Database } from 'ltijs-sequelize';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupLtiRoutes } from './routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '../.env' }); // load .env from root

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const LTI_KEY = process.env.LTI_KEY || 'LlaveSecretaEncriptadaParaFirmarLtikLocalmente';
const DB_PATH = process.env.MAC_DB_PATH || path.join(__dirname, 'lti-estado.sqlite');

// Configure Sequelize para SQLite
const dbPlugin = new Database({
  dialect: 'sqlite',
  storage: DB_PATH,
  logging: false
});

// Configure LTI Provider
Provider.setup(LTI_KEY,
  {
    plugin: dbPlugin
  }, {
  staticPath: path.join(__dirname, '../public'),
  cookies: {
    secure: false, // For local dev. In production, change to true
    sameSite: 'None'
  },
  devMode: true, // development
  ltiaas: true, // LTI as a Service for SPA
});

// Avoid problems with load balancers (Heroku, Railway)
Provider.app.enable('trust proxy');

// Setup CORS to allow requests from the React frontend
Provider.app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Authorization-LTIK', 'ltik']
}));

// Setup LTI Launch Callback
Provider.onConnect((token, req, res) => {
  // Pass the token to the frontend via query string
  // It's the front end's responsibility to store it and clear the URL.
  // We append it to the FRONTEND_URL
  const frontendUrl = new URL(FRONTEND_URL);
  frontendUrl.searchParams.append('ltik', res.locals.ltik);

  return Provider.redirect(res, frontendUrl.toString());
});

async function start() {
  await Provider.deploy({ port: PORT, serverless: false });

  // Optional: Register dynamic platform if ENV specifies
  if (process.env.MOODLE_URL) {
    try {
      await Provider.registerPlatform({
        url: process.env.MOODLE_URL,
        name: 'Moodle Institucional',
        clientId: process.env.MOODLE_CLIENT_ID,
        authenticationEndpoint: process.env.MOODLE_AUTH_ENDPOINT,
        accesstokenEndpoint: process.env.MOODLE_TOKEN_ENDPOINT,
        authConfig: { method: 'JWK_SET', key: process.env.MOODLE_JWKS_URL }
      });
      console.log('✅ Plataforma registrada:', process.env.MOODLE_URL);
    } catch (e) {
      console.log('⚠️ Plataforma posiblemente ya registrada. Omitiendo.');
    }
  }

  // Bind the /api routes
  setupLtiRoutes(Provider.app, Provider);

  console.log(`🚀 Integración LTI Provider corriendo en el puerto ${PORT}`);
}

start();
