import express from 'express';
import jwt from 'jsonwebtoken';

function extractToken(req) {
  if (req.query && req.query.ltik) {
    return req.query.ltik;
  }
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}

export function setupLtiRoutes(app, Provider) {
  const LTI_KEY = process.env.LTI_KEY || 'LlaveSecretaEncriptadaParaFirmarLtikLocalmente';

  app.use('/api', express.json());

  // Custom middleware to verify the LTI Token (ltik) from the frontend
  const verifyLti = async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ error: 'Falta token LTIK' });
    }

    try {
      // Validamos el JWT con la misma llave maestra que usa ltijs para firmar
      // El payload contiene la sesión { context, user, data, ... }
      const decoded = jwt.verify(token, LTI_KEY);
      req.ltiSession = decoded;

      // ltijs expone métodos útiles si inyectamos los IDs,
      // pero para extraer nombre y rol, el payload decodificado suele bastar.
      // O podemos recuperar el IdToken nativo de ltijs:
      const idtoken = await Provider.Database.Get(false, 'idtoken', { _id: req.ltiSession.data.id });
      if (idtoken) {
        req.ltiUser = idtoken.user;
        req.ltiContext = idtoken.platformContext;
      }

      next();
    } catch (error) {
      console.error('Invalid LTI Token:', error.message);
      return res.status(403).json({ error: 'Token LTIK inválido o expirado' });
    }
  };

  // Endpoint: GET /api/me
  app.get('/api/me', verifyLti, (req, res) => {
    res.json({
      success: true,
      user: {
        id: req.ltiUser ? req.ltiUser : req.ltiSession.user,
        name: req.ltiSession.data && req.ltiSession.data.user ? req.ltiSession.data.user : 'Estudiante anónimo',
        roles: req.ltiSession.data && req.ltiSession.data.roles ? req.ltiSession.data.roles : []
      },
      context: req.ltiContext ? req.ltiContext : {}
    });
  });

  // Endpoint: POST /api/grade
  app.post('/api/grade', verifyLti, async (req, res) => {
    try {
      const { score, comment } = req.body; // score expects 0 to 100

      // Retrieve the full lti token so we can use Provider.Grade API natively
      const idtoken = req.ltiSession;

      if (!score && score !== 0) {
        return res.status(400).json({ error: 'Se requiere una nota numérica (score)' });
      }

      const ltiScore = score / 100; // Moodle expects 0.0 to 1.0 generally, but let's check ltijs docs (0-1 usually)

      // Enviar nota a Moodle usando Provider.Grade
      // En lti.Grade.scorePublish(token, { scoreGiven, activityProgress, gradingProgress...})
      const gradePayload = {
        scoreGiven: ltiScore,
        scoreMaximum: 1,
        activityProgress: 'Completed',
        gradingProgress: 'FullyGraded',
        comment: comment || 'Laboratorio finalizado.'
      };

      // Invocamos el publicador de notas (necesita el request de lti real o el token extraído)
      const tokenForGrade = req.ltiSession.data ? req.ltiSession.data : req.ltiSession;

      // La mejor forma nativa de pasar notas con ltijs en un middleware manual: 
      // idtoken de req.ltiSession es válido, pero normalmente usamos Provider.Grade
      const result = await Provider.Grade.scorePublish(extractToken(req), gradePayload);

      res.json({
        success: true,
        message: 'Nota enviada correctamente a Moodle',
        result
      });
    } catch (error) {
      console.error('Error enviando nota:', error.message);
      res.status(500).json({ error: 'Fallo la sincronización con Moodle', details: error.message });
    }
  });

}
