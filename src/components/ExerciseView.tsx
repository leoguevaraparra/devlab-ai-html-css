import React, { useState, useEffect, useCallback } from 'react';
import { Exercise, CodeState } from '../types';
import { CodeEditor } from './CodeEditor';
import { Preview } from './Preview';
import { FeedbackPanel } from './FeedbackPanel';
import { evaluateExercise } from '../services/aiService';
import { submitLtiGrade } from '../services/moodleService';
import {
  Play, CheckCircle2, FileCode2, Paintbrush, Loader2, GripVertical,
  GripHorizontal, PanelLeftClose, PanelLeftOpen, ChevronUp, ChevronDown,
  RotateCcw, CheckCheck, AlertTriangle, Clock,
} from 'lucide-react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import clsx from 'clsx';

// ============================================================
// Tipos del componente
// ============================================================

interface ExerciseViewProps {
  exercise: Exercise;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  /** Callback para notificar al padre cuando se completa una evaluación con nota. */
  onExerciseComplete?: (exerciseId: string, score: number) => void;
}

/** Estado posible de un toast de notificación. */
type ToastState = {
  visible: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
};

/** Cooldown en segundos entre evaluaciones para prevenir spam a la API. */
const EVALUATION_COOLDOWN_S = 20;

// ============================================================
// Componente Principal
// ============================================================

/**
 * Vista principal del ejercicio de laboratorio.
 *
 * Gestiona:
 * - El estado del código HTML/CSS del estudiante
 * - La evaluación asíncrona con la IA (con cooldown anti-spam)
 * - El envío de la nota a Moodle vía LTI
 * - Las notificaciones toast de resultado
 * - El reset del código al estado inicial
 */
export function ExerciseView({
  exercise,
  isSidebarOpen,
  onToggleSidebar,
  onExerciseComplete,
}: ExerciseViewProps) {
  const [code, setCode] = useState<CodeState>({ html: exercise.initialHtml, css: exercise.initialCss });
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [toast, setToast] = useState<ToastState>({ visible: false, type: 'info', message: '' });

  // Reiniciar el estado al cambiar de ejercicio
  useEffect(() => {
    setCode({ html: exercise.initialHtml, css: exercise.initialCss });
    setFeedback(null);
    setScore(null);
    setFromCache(false);
    setActiveTab('html');
    setCooldownSeconds(0);
  }, [exercise]);

  // Gestión del countdown del cooldown
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timerId = setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timerId);
  }, [cooldownSeconds]);

  // ============================================================
  // Toast helper
  // ============================================================
  const showToast = useCallback((type: ToastState['type'], message: string) => {
    setToast({ visible: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4500);
  }, []);

  // ============================================================
  // Manejo de la evaluación
  // ============================================================
  const handleEvaluate = async () => {
    if (isEvaluating || cooldownSeconds > 0) return;

    setIsEvaluating(true);
    try {
      // 1. Evaluar código con IA
      const result = await evaluateExercise(exercise, code);
      setFeedback(result.feedback);
      setScore(result.score);
      setFromCache(result.fromCache ?? false);

      // 2. Notificar al padre para persistir el progreso
      if (result.score !== undefined) {
        onExerciseComplete?.(exercise.id, result.score);
      }

      // 3. Enviar nota a Moodle en background (no bloquea la UI)
      if (result.score !== undefined) {
        const gradeResult = await submitLtiGrade(result.score, result.feedback);
        if (gradeResult.success) {
          showToast('success', `✅ Nota ${result.score}/100 sincronizada con Moodle`);
        } else if (gradeResult.message !== 'Sin conexión LTI activa.') {
          // Solo mostrar error si hay LTI pero falló (no si es standalone)
          showToast('error', `⚠️ No se pudo sincronizar con Moodle: ${gradeResult.message}`);
        }
      }

      // 4. Activar cooldown (no aplica para resultados de caché)
      if (!result.fromCache) {
        setCooldownSeconds(EVALUATION_COOLDOWN_S);
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  // ============================================================
  // Reset de código
  // ============================================================
  const handleResetCode = () => {
    if (!window.confirm('¿Estás seguro de que deseas resetear el código al estado inicial? Perderás tus cambios actuales.')) {
      return;
    }
    setCode({ html: exercise.initialHtml, css: exercise.initialCss });
    setFeedback(null);
    setScore(null);
    showToast('info', 'Código reseteado al estado inicial.');
  };

  const canEvaluate = !isEvaluating && cooldownSeconds === 0;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 relative">
      {/* ── Toast de notificación ─────────────────────────── */}
      <div
        className={clsx(
          'absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium',
          'shadow-xl transition-all duration-300',
          toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none',
          toast.type === 'success' && 'bg-emerald-900/80 border-emerald-600/50 text-emerald-300',
          toast.type === 'error' && 'bg-rose-900/80 border-rose-600/50 text-rose-300',
          toast.type === 'info' && 'bg-slate-800/90 border-slate-600/50 text-slate-300',
        )}
      >
        {toast.type === 'success' && <CheckCheck size={16} />}
        {toast.type === 'error' && <AlertTriangle size={16} />}
        {toast.message}
      </div>

      {/* ── Header del ejercicio ──────────────────────────── */}
      <div className="flex-none p-5 border-b border-slate-800 bg-slate-900/50">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <button
              id="toggle-sidebar-btn"
              onClick={onToggleSidebar}
              className="mt-1 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              title={isSidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
            >
              {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight mb-1">{exercise.title}</h1>
              <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">{exercise.description}</p>
            </div>
          </div>

          {/* Acciones principales */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <button
              id="reset-code-btn"
              onClick={handleResetCode}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 px-3 py-2 rounded-lg text-sm transition-colors"
              title="Resetear código al estado inicial"
            >
              <RotateCcw size={15} />
              Resetear
            </button>
            <button
              id="evaluate-code-btn"
              onClick={handleEvaluate}
              disabled={!canEvaluate}
              className={clsx(
                'flex items-center gap-2 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg',
                canEvaluate
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30 hover:shadow-emerald-900/50'
                  : 'bg-slate-700 cursor-not-allowed opacity-60'
              )}
            >
              {isEvaluating ? (
                <Loader2 className="animate-spin" size={17} />
              ) : cooldownSeconds > 0 ? (
                <Clock size={17} />
              ) : (
                <Play size={17} />
              )}
              {isEvaluating
                ? 'Evaluando...'
                : cooldownSeconds > 0
                ? `Espera ${cooldownSeconds}s`
                : 'Evaluar Código'}
            </button>
          </div>
        </div>

        {/* Instrucciones colapsables */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
          <button
            id="toggle-instructions-btn"
            onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-800/80 transition-colors"
          >
            <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Instrucciones del Ejercicio
            </h3>
            {isInstructionsOpen ? (
              <ChevronUp size={16} className="text-slate-400" />
            ) : (
              <ChevronDown size={16} className="text-slate-400" />
            )}
          </button>
          <div
            className={clsx(
              'transition-all duration-300 ease-in-out overflow-hidden',
              isInstructionsOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <ul className="space-y-2 p-4 pt-0">
              {exercise.instructions.map((inst, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-semibold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{inst}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Área principal (editor + preview + feedback) ───── */}
      <div className="flex-1 overflow-hidden p-4">
        <PanelGroup orientation="horizontal" className="h-full w-full">
          {/* Panel izquierdo: Editor de código */}
          <Panel defaultSize={50} minSize={25} className="flex flex-col gap-3 pr-2">
            {/* Tabs HTML / CSS */}
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start">
              <button
                id="tab-html-btn"
                onClick={() => setActiveTab('html')}
                className={clsx(
                  'flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                  activeTab === 'html'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                )}
              >
                <FileCode2 size={15} />
                HTML
              </button>
              <button
                id="tab-css-btn"
                onClick={() => setActiveTab('css')}
                className={clsx(
                  'flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                  activeTab === 'css'
                    ? 'bg-slate-800 text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                )}
              >
                <Paintbrush size={15} />
                CSS
              </button>
            </div>

            {/* Editores superpuestos — visibilidad por CSS para no desmontar */}
            <div className="flex-1 relative">
              <div
                className={clsx(
                  'absolute inset-0 transition-opacity duration-200',
                  activeTab === 'html' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                )}
              >
                <CodeEditor
                  mode="html"
                  value={code.html}
                  onChange={(val) => setCode((prev) => ({ ...prev, html: val }))}
                />
              </div>
              <div
                className={clsx(
                  'absolute inset-0 transition-opacity duration-200',
                  activeTab === 'css' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                )}
              >
                <CodeEditor
                  mode="css"
                  value={code.css}
                  onChange={(val) => setCode((prev) => ({ ...prev, css: val }))}
                />
              </div>
            </div>
          </Panel>

          {/* Separador horizontal redimensionable */}
          <PanelResizeHandle className="w-2 bg-transparent hover:bg-emerald-500/20 active:bg-emerald-500/40 transition-colors cursor-col-resize flex items-center justify-center rounded-full group">
            <div className="w-1 h-8 bg-slate-700 group-hover:bg-emerald-500 rounded-full transition-colors flex items-center justify-center">
              <GripVertical size={12} className="text-slate-500 group-hover:text-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </PanelResizeHandle>

          {/* Panel derecho: Preview + Feedback */}
          <Panel defaultSize={50} minSize={25} className="pl-2">
            <PanelGroup orientation="vertical">
              <Panel defaultSize={50} minSize={20} className="pb-2">
                <Preview code={code} />
              </Panel>

              <PanelResizeHandle className="h-2 bg-transparent hover:bg-emerald-500/20 active:bg-emerald-500/40 transition-colors cursor-row-resize flex items-center justify-center rounded-full group">
                <div className="h-1 w-8 bg-slate-700 group-hover:bg-emerald-500 rounded-full transition-colors flex items-center justify-center">
                  <GripHorizontal size={12} className="text-slate-500 group-hover:text-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </PanelResizeHandle>

              <Panel defaultSize={50} minSize={20} className="pt-2">
                <FeedbackPanel
                  feedback={feedback}
                  score={score}
                  isLoading={isEvaluating}
                  fromCache={fromCache}
                />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
