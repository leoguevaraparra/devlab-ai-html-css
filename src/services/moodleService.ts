/// <reference types="vite/client" />
import { GradeSubmissionResult } from '../types';

/** URL base del backend LTI. */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/** Tiempo máximo de espera para sincronizar nota con Moodle (8 segundos). */
const GRADE_TIMEOUT_MS = 8_000;

/**
 * Envía la calificación del estudiante al libro de notas de Moodle
 * a través del backend LTI.
 *
 * - Solo se ejecuta si existe un token LTIK activo en sessionStorage.
 * - En modo standalone (sin LTI), informa al caller sin hacer petición.
 * - Incluye un AbortController para abortar si el servidor no responde.
 *
 * @param score - Calificación de 0 a 100
 * @param comment - Feedback textual para asociar a la nota en Moodle
 */
export async function submitLtiGrade(
  score: number,
  comment: string
): Promise<GradeSubmissionResult> {
  const ltik = sessionStorage.getItem('ltik');

  if (!ltik) {
    console.info('[Moodle] Sin contexto LTI activo — la nota no se sincronizará.');
    return { success: false, message: 'Sin conexión LTI activa.' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GRADE_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}/api/grade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ltik}`,
      },
      body: JSON.stringify({ score, comment }),
      signal: controller.signal,
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.info('[Moodle] ✅ Nota sincronizada:', data.message);
      return { success: true, message: data.message || 'Nota enviada a Moodle correctamente.' };
    }

    console.error('[Moodle] ❌ Moodle rechazó la nota:', data);
    return { success: false, message: data.error || 'Moodle rechazó la calificación.' };
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[Moodle] Timeout al enviar nota.');
      return { success: false, message: 'Tiempo de espera agotado al contactar Moodle.' };
    }
    console.error('[Moodle] Error de red:', error);
    return { success: false, message: 'Error de red al sincronizar con Moodle.' };
  } finally {
    clearTimeout(timeoutId);
  }
}
