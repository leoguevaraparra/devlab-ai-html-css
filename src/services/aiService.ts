import { GoogleGenAI } from '@google/genai';
import { Exercise, CodeState } from '../types';

let ai: GoogleGenAI | null = null;

export function getAI() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export async function evaluateExercise(exercise: Exercise, code: CodeState): Promise<string> {
  const aiClient = getAI();

  const prompt = `
Actúa como un profesor senior de desarrollo web, experto en diseño instruccional y Clean Code.
Un estudiante está resolviendo el siguiente ejercicio de programación en un laboratorio virtual.

Título del Ejercicio: ${exercise.title}
Descripción: ${exercise.description}
Dificultad: ${exercise.difficulty}
Instrucciones dadas al estudiante:
${exercise.instructions.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

Código HTML del estudiante:
\`\`\`html
${code.html}
\`\`\`

Código CSS del estudiante:
\`\`\`css
${code.css}
\`\`\`

Tu tarea es evaluar el código del estudiante basándote en las instrucciones.
Proporciona una retroalimentación constructiva, precisa y clara en español.
Sigue esta estructura:
1.  **Evaluación General**: Un breve resumen de cómo lo hizo (ej. "¡Excelente trabajo!", "Vas por buen camino, pero faltan detalles").
2.  **Puntos Fuertes**: Qué hizo bien, destacando buenas prácticas si las hay.
3.  **Áreas de Mejora / Errores**: Qué instrucciones faltaron por cumplir o qué errores de sintaxis/lógica cometió. Sé específico indicando la línea o el concepto.
4.  **Sugerencia (Opcional)**: Un pequeño consejo adicional sobre Clean Code o mejores prácticas relacionadas con el tema, sin darle la solución completa directamente si aún no lo ha logrado.

Usa formato Markdown para tu respuesta. Sé alentador pero riguroso.
`;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.2,
      }
    });
    return response.text || 'No se pudo generar retroalimentación.';
  } catch (error) {
    console.error('Error evaluating code:', error);
    return 'Hubo un error al contactar con el asistente de IA. Por favor, intenta de nuevo más tarde.';
  }
}
