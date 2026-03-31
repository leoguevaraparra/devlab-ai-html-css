// ============================================================
// Tipos del Dominio — DevLab HTML/CSS Virtual Lab
// ============================================================

/** Niveles de dificultad para los ejercicios del laboratorio. */
export type Difficulty = 'Junior' | 'Semi senior' | 'Senior';

/** Contexto del usuario autenticado vía LTI 1.3. */
export interface LtiUser {
  /** Identificador único del usuario en Moodle. */
  id: string;
  /** Nombre completo del estudiante. */
  name: string;
  /** Roles LTI asignados (ej. Learner, Instructor). */
  roles: string[];
}

/** Contexto del curso/actividad proporcionado por Moodle vía LTI. */
export interface LtiContext {
  id?: string;
  label?: string;
  title?: string;
}

/** Definición completa de un ejercicio del laboratorio. */
export interface Exercise {
  /** Identificador único e inmutable del ejercicio. */
  id: string;
  /** Título visible para el estudiante. */
  title: string;
  /** Descripción general del objetivo del ejercicio. */
  description: string;
  /** Instrucciones paso a paso visibles para el estudiante. */
  instructions: string[];
  /**
   * Criterios de evaluación internos (NO se muestran al estudiante).
   * La IA los usa para calificar con mayor precisión y consistencia.
   * Si no se define, la IA utiliza las `instructions` como referencia.
   */
  evaluationCriteria?: string[];
  /** Nivel de complejidad del ejercicio. */
  difficulty: Difficulty;
  /** Etiquetas para búsqueda y filtrado en la barra lateral. */
  tags: string[];
  /** Código HTML inicial provisto al estudiante al comenzar. */
  initialHtml: string;
  /** Código CSS inicial provisto al estudiante al comenzar. */
  initialCss: string;
}

/** Estado del código activo en el editor (HTML + CSS). */
export interface CodeState {
  html: string;
  css: string;
}

/** Resultado estructurado de una evaluación realizada por la IA. */
export interface EvaluationResult {
  /** Calificación de 0 a 100. */
  score: number;
  /** Retroalimentación detallada en formato Markdown. */
  feedback: string;
  /** `true` si el resultado fue servido desde caché local (sin costo de API). */
  fromCache?: boolean;
}

/** Resultado de un intento de envío de nota al libro de Moodle. */
export interface GradeSubmissionResult {
  /** `true` si la nota fue aceptada correctamente por Moodle. */
  success: boolean;
  /** Mensaje descriptivo del resultado (éxito o error). */
  message: string;
}
