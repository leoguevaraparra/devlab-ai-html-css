import express from 'express';
import jwt from 'jsonwebtoken';

// ============================================================
// Utilidades de extracción de token
// ============================================================

/**
 * Extrae el token LTIK del request.
 * Soporta dos fuentes (redundancia recomendada para iframes y proxies):
 * 1. Query string: ?ltik=<token>
 * 2. Authorization header: Bearer <token>
 *
 * @param {import('express').Request} req
 * @returns {string | null}
 */
function extractToken(req) {
  if (req.query?.ltik) {
    return req.query.ltik;
  }
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}

// ============================================================
// Configuración de rutas LTI
// ============================================================

/**
 * Registra las rutas API protegidas por LTI en la aplicación Express.
 *
 * @param {import('express').Application} app
 * @param {import('ltijs').IdToken} Provider - Instancia del proveedor ltijs
 */
export function setupLtiRoutes(app, Provider) {
  const LTI_KEY = process.env.LTI_KEY || 'LlaveSecretaEncriptadaParaFirmarLtikLocalmente';

  app.use('/api', express.json());

  // ============================================================
  // Middleware: Verificación del LTIK
  // Valida el JWT y recupera el idtoken de la DB de ltijs
  // ============================================================
  const verifyLti = async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ error: 'Token LTIK ausente en la solicitud.' });
    }

    try {
      // Decodificar el LTIK con la llave maestra para obtener la sesión
      const decoded = jwt.verify(token, LTI_KEY);
      req.ltiSession = decoded;

      // Recuperar el idtoken completo desde la base de datos de ltijs
      // El idtoken es necesario para las operaciones de calificación (Grade API)
      const sessionId = decoded?.data?.id || decoded?.id;
      if (sessionId) {
        const idtokenRecord = await Provider.Database.Get(false, 'idtoken', { _id: sessionId });
        if (idtokenRecord && idtokenRecord[0]) {
          req.ltiIdToken = idtokenRecord[0];
        }
      }

      next();
    } catch (error) {
      console.error('[LTI] Token inválido:', error.message);
      return res.status(403).json({ error: 'Token LTIK inválido o expirado.', detail: error.message });
    }
  };

  // ============================================================
  // GET /api/me — Contexto del usuario autenticado
  // ============================================================
  app.get('/api/me', verifyLti, (req, res) => {
    // Construir respuesta con fallbacks robustos para cada campo
    const idtoken = req.ltiIdToken;
    const session = req.ltiSession;

    const userId = idtoken?.user || session?.user || session?.data?.id || 'unknown';
    const userName = idtoken?.userInfo?.name
      || session?.data?.user
      || session?.userInfo?.name
      || 'Estudiante';
    const userRoles = idtoken?.platformContext?.roles
      || session?.data?.roles
      || [];
    const context = idtoken?.platformContext?.context
      || session?.platformContext?.context
      || {};

    return res.json({
      success: true,
      user: { id: userId, name: userName, roles: userRoles },
      context,
    });
  });

  // ============================================================
  // POST /api/grade — Envío de calificación al libro de Moodle
  // ============================================================
  app.post('/api/grade', verifyLti, async (req, res) => {
    const { score, comment } = req.body;

    // Validar que score sea un número en rango válido
    const numericScore = Number(score);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      return res.status(400).json({
        error: 'El campo "score" es obligatorio y debe ser un número entre 0 y 100.',
      });
    }

    try {
      // ltijs espera score en escala 0.0 – 1.0 para el protocolo LTI AGS
      const ltiScore = numericScore / 100;

      const gradePayload = {
        scoreGiven: ltiScore,
        scoreMaximum: 1,
        activityProgress: 'Completed',
        gradingProgress: 'FullyGraded',
        comment: comment || 'Laboratorio completado.',
      };

      // scorePublish en modo ltiaas acepta el token LTIK como primer argumento
      const ltik = extractToken(req);
      const result = await Provider.Grade.scorePublish(ltik, gradePayload);

      console.log(`[Grade] ✅ Nota enviada: ${numericScore}/100 (${ltiScore})`);
      return res.json({
        success: true,
        message: `Nota ${numericScore}/100 enviada correctamente a Moodle.`,
        result,
      });
    } catch (error) {
      console.error('[Grade] ❌ Error al publicar nota:', error.message);
      return res.status(500).json({
        error: 'No se pudo sincronizar la calificación con Moodle.',
        detail: error.message,
      });
    }
  });
}
