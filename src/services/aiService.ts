/// <reference types="vite/client" />
import { GoogleGenAI } from '@google/genai';
import { Exercise, CodeState, EvaluationResult } from '../types';

// ============================================================
// Cliente Singleton de Google Generative AI
// ============================================================

let ai: GoogleGenAI | null = null;

/**
 * Retorna la instancia singleton del cliente de Google Generative AI.
 * Lanza un error descriptivo si la API key no está configurada en .env.local.
 */
export function getAI(): GoogleGenAI {
  if (!ai) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'VITE_GEMINI_API_KEY no está definida. Agrega la variable a tu archivo .env.local.'
      );
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

// ============================================================
// Optimización de costos — Caché en memoria
// ============================================================

/** Duración máxima de una entrada en caché (10 minutos). */
const CACHE_TTL_MS = 10 * 60 * 1000;

interface CacheEntry {
  result: EvaluationResult;
  expiresAt: number;
}

/** Mapa de caché: clave única → resultado de evaluación. */
const evaluationCache = new Map<string, CacheEntry>();

/**
 * Genera una clave de caché única y determinística usando un hash DJB2
 * basado en el ID del ejercicio y el contenido exacto del código.
 * Código idéntico → misma clave → retorna resultado desde caché sin costo de API.
 */
function buildCacheKey(exerciseId: string, code: CodeState): string {
  const raw = `${exerciseId}::${code.html.trim()}::${code.css.trim()}`;
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = (((hash << 5) + hash) ^ raw.charCodeAt(i)) >>> 0;
  }
  return `${exerciseId}-${hash}`;
}

/** Elimina entradas de caché expiradas para liberar memoria. */
function pruneExpiredCache(): void {
  const now = Date.now();
  for (const [key, entry] of evaluationCache) {
    if (entry.expiresAt < now) evaluationCache.delete(key);
  }
}

// ============================================================
// Optimización de costos — Preprocesamiento del código
// ============================================================

/** Máximo de caracteres por bloque de código enviado a la IA. */
const MAX_CODE_CHARS = 4_000;

/**
 * Preprocesa el código del estudiante para reducir tokens de entrada:
 * - Colapsa líneas en blanco excesivas (máximo 2 consecutivas)
 * - Trunca el código si supera el límite de caracteres con una nota clara
 */
function preprocessCode(code: string): string {
  const cleaned = code.replace(/\n{3,}/g, '\n\n').trim();
  if (cleaned.length > MAX_CODE_CHARS) {
    return `${cleaned.substring(0, MAX_CODE_CHARS)}\n/* [Código truncado — límite de ${MAX_CODE_CHARS} caracteres] */`;
  }
  return cleaned;
}

// ============================================================
// Construcción del Prompt — Optimizado para precisión y costo
// ============================================================

/**
 * Construye el prompt de evaluación de la IA.
 * - Usa `evaluationCriteria` si está definido en el ejercicio (más preciso).
 * - Cae en las `instructions` del estudiante como referencia alternativa.
 * - Prompt estructurado y conciso para minimizar tokens de salida.
 */
function buildEvaluationPrompt(exercise: Exercise, code: CodeState): string {
  const htmlCode = preprocessCode(code.html);
  const cssCode = preprocessCode(code.css);

  const hasCriteria = exercise.evaluationCriteria && exercise.evaluationCriteria.length > 0;

  const criteriaSection = hasCriteria
    ? `CRITERIOS DE EVALUACIÓN (usa ÚNICAMENTE estos para calificar):\n${exercise.evaluationCriteria!.map((c, i) => `${i + 1}. ${c}`).join('\n')}`
    : `INSTRUCCIONES DEL EJERCICIO (úsalas como criterios de evaluación):\n${exercise.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}`;

  return `Eres un evaluador automático de HTML5/CSS3 en un laboratorio virtual universitario.

EJERCICIO: "${exercise.title}" | Nivel: ${exercise.difficulty}
DESCRIPCIÓN: ${exercise.description}

${criteriaSection}

=== HTML DEL ESTUDIANTE ===
\`\`\`html
${htmlCode}
\`\`\`

=== CSS DEL ESTUDIANTE ===
\`\`\`css
${cssCode}
\`\`\`

REGLAS DE EVALUACIÓN:
- Evalúa SOLO según los criterios listados. Cada criterio cumplido aporta puntos.
- Sé específico: menciona líneas o propiedades concretas.
- Da retroalimentación constructiva en español. No entregues la solución completa.
- Usa este formato Markdown para el campo "feedback":
  **Evaluación General**: [1 línea de resumen]
  **✅ Puntos Fuertes**: [lista de lo correcto, o "Ninguno por ahora" si aplica]
  **⚠️ Áreas de Mejora**: [lista de lo que falta, específico]
  **💡 Consejo Pro**: [tip opcional de buenas prácticas]

RETORNA ÚNICAMENTE este JSON válido, sin texto adicional:
{"score": <entero 0-100>, "feedback": "<texto Markdown con \\n escapados>"}`;
}

// ============================================================
// Función Principal de Evaluación
// ============================================================

/**
 * Evalúa el código HTML/CSS del estudiante usando Gemini AI.
 *
 * ## Estrategias de optimización de costos implementadas:
 * 1. **Caché en memoria (10 min)**: Si el estudiante reenvía código idéntico,
 *    el resultado se sirve desde caché sin ningún costo de API.
 * 2. **Preprocesamiento**: Elimina whitespace excesivo y trunca a 4000 chars
 *    por bloque para reducir tokens de entrada.
 * 3. **Prompt conciso**: Estructura mínima pero precisa para reducir tokens de salida.
 * 4. **maxOutputTokens: 1024**: Cap estricto en la respuesta para evitar salidas largas.
 * 5. **thinkingBudget: 0**: Desactiva el "thinking" de Gemini Flash (~50% reducción de tokens).
 * 6. **Temperatura 0.1**: Respuestas determinísticas y consistentes.
 *
 * @param exercise - Definición completa del ejercicio
 * @param code - Estado actual del código del estudiante
 */
export async function evaluateExercise(
  exercise: Exercise,
  code: CodeState
): Promise<EvaluationResult> {
  // 1. Consultar caché — respuesta inmediata sin costo
  const cacheKey = buildCacheKey(exercise.id, code);
  const cached = evaluationCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    console.info(`[AI] ⚡ Cache hit para "${exercise.title}" — sin costo de API.`);
    return { ...cached.result, fromCache: true };
  }

  // Limpiar entradas expiradas periódicamente
  pruneExpiredCache();

  // 2. Llamar a la IA
  const prompt = buildEvaluationPrompt(exercise, code);
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.1,       // Determinismo alto = respuestas consistentes
        maxOutputTokens: 1024,  // Cap de costo en salida
        thinkingConfig: {
          thinkingBudget: 0,    // Desactiva thinking en Flash → ~50% menos tokens
        },
      },
    });

    const rawText = response.text ?? '';
    const cleanText = rawText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    // 3. Parseo defensivo
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleanText);
    } catch {
      throw new Error(`Respuesta de IA con formato inválido: ${cleanText.substring(0, 200)}`);
    }

    const rawScore = typeof parsed.score === 'number' ? parsed.score : Number(parsed.score);
    const score = Math.min(100, Math.max(0, Math.round(isNaN(rawScore) ? 0 : rawScore)));

    const feedback =
      typeof parsed.feedback === 'string' && parsed.feedback.trim()
        ? parsed.feedback.trim()
        : 'La IA no generó retroalimentación. Intenta de nuevo.';

    const result: EvaluationResult = { score, feedback, fromCache: false };

    // 4. Guardar en caché
    evaluationCache.set(cacheKey, { result, expiresAt: Date.now() + CACHE_TTL_MS });
    console.info(`[AI] ✅ Evaluación completada: ${score}/100 para "${exercise.title}".`);

    return result;
  } catch (error) {
    console.error('[AI] Error en evaluación:', error);
    return {
      score: 0,
      feedback:
        'Hubo un error al contactar el asistente de IA. Por favor, intenta de nuevo en unos momentos.',
      fromCache: false,
    };
  }
}
