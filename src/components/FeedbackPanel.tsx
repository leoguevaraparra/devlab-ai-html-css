import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Loader2, Award, Zap } from 'lucide-react';
import clsx from 'clsx';

interface FeedbackPanelProps {
  /** Texto de retroalimentación en formato Markdown. */
  feedback: string | null;
  /** Calificación numérica de 0 a 100. */
  score: number | null;
  /** `true` si la IA está evaluando el código actualmente. */
  isLoading: boolean;
  /** `true` si el resultado fue servido desde caché (sin costo de API). */
  fromCache?: boolean;
}

/**
 * Calcula el color representativo para una nota dada.
 * - 80–100: verde (excelente)
 * - 50–79: amarillo (aceptable)
 * - 0–49: rojo (necesita mejorar)
 */
function getScoreStyle(score: number): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  if (score >= 80) return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Excelente' };
  if (score >= 50) return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Aceptable' };
  return { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30', label: 'A mejorar' };
}

/**
 * Panel de retroalimentación del Asistente IA.
 * Muestra el resultado de la evaluación incluyendo:
 * - Badge visual con la calificación numérica y color semántico
 * - Barra de progreso proporcional al score
 * - Texto de retroalimentación en Markdown enriquecido
 * - Indicador de caché (cuando aplica, para transparencia con el estudiante)
 */
export function FeedbackPanel({ feedback, score, isLoading, fromCache }: FeedbackPanelProps) {
  const scoreStyle = score !== null ? getScoreStyle(score) : null;

  return (
    <div className="h-full w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-sm flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="text-emerald-400" size={18} />
          <h3 className="text-sm font-semibold text-white tracking-wide">Asistente IA</h3>
        </div>
        {fromCache && (
          <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <Zap size={10} />
            Desde caché
          </span>
        )}
      </div>

      {/* Score Badge — visible solo cuando hay resultado */}
      {score !== null && scoreStyle && !isLoading && (
        <div className={clsx('flex items-center gap-4 px-4 py-3 border-b border-slate-700/50', scoreStyle.bg)}>
          <div className={clsx('flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 flex-shrink-0', scoreStyle.border)}>
            <Award size={16} className={scoreStyle.text} />
            <span className={clsx('text-xl font-bold leading-none', scoreStyle.text)}>
              {score}
            </span>
            <span className={clsx('text-[9px] leading-none', scoreStyle.text)}>/ 100</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1.5">
              <span className={clsx('text-xs font-semibold', scoreStyle.text)}>{scoreStyle.label}</span>
              <span className="text-xs text-slate-400">{score}%</span>
            </div>
            {/* Barra de progreso */}
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={clsx('h-full rounded-full transition-all duration-700 ease-out', {
                  'bg-emerald-500': score >= 80,
                  'bg-amber-500': score >= 50 && score < 80,
                  'bg-rose-500': score < 50,
                })}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto p-4 text-slate-300 text-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
            <Loader2 className="animate-spin text-emerald-500" size={28} />
            <p className="text-sm">Analizando tu código con IA...</p>
            <p className="text-xs text-slate-600">Evaluando criterios de calidad</p>
          </div>
        ) : feedback ? (
          <div className="prose prose-invert prose-sm max-w-none prose-emerald prose-headings:text-slate-200 prose-strong:text-slate-100">
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center px-6 gap-3">
            <Bot size={36} className="opacity-30" />
            <p className="text-sm leading-relaxed">
              Haz clic en <strong className="text-emerald-500">Evaluar Código</strong> para recibir
              retroalimentación personalizada y tu calificación.
            </p>
            <p className="text-xs text-slate-600">La IA analizará cada criterio del ejercicio.</p>
          </div>
        )}
      </div>
    </div>
  );
}
