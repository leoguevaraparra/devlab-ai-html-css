import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ExerciseView } from './components/ExerciseView';
import { exercises } from './data/exercises';
import { useLTI } from './hooks/useLTI';
import clsx from 'clsx';
import { GraduationCap, AlertTriangle, Wifi } from 'lucide-react';

// ============================================================
// Persistencia del progreso en localStorage
// ============================================================

const PROGRESS_STORAGE_KEY = 'devlab-html-css-progress';

/**
 * Carga el progreso previo del estudiante desde localStorage.
 * Retorna un mapa de  exerciseId → score obtenido.
 */
function loadProgress(): Record<string, number> {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

/**
 * Persiste el mapa de progreso en localStorage.
 */
function saveProgress(progress: Record<string, number>): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.warn('[Progress] No se pudo guardar el progreso en localStorage.');
  }
}

// ============================================================
// Componente Raíz
// ============================================================

/**
 * Componente raíz de DevLab HTML/CSS.
 *
 * Gestiona:
 * - La sesión LTI (autenticación vía Moodle)
 * - El ejercicio activo seleccionado en la sidebar
 * - La persistencia del progreso en localStorage
 * - El banner de estado de conexión LTI
 */
export default function App() {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(
    exercises[0]?.id ?? null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [completedExercises, setCompletedExercises] = useState<Record<string, number>>(
    loadProgress
  );

  const { ltiUser, isValidating, hasLti, error: ltiError } = useLTI();

  const activeExercise = exercises.find((ex) => ex.id === activeExerciseId);

  /**
   * Callback invocado por ExerciseView al completar una evaluación.
   * Actualiza el progreso en memoria y en localStorage.
   * Solo sobreescribe si la nueva nota es mayor que la anterior.
   */
  const handleExerciseComplete = useCallback((exerciseId: string, score: number) => {
    setCompletedExercises((prev) => {
      const previousScore = prev[exerciseId] ?? -1;
      if (score > previousScore) {
        const updated = { ...prev, [exerciseId]: score };
        saveProgress(updated);
        return updated;
      }
      return prev;
    });
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden font-sans text-slate-300">
      {/* ── Banners de estado LTI ──────────────────────────── */}

      {/* Validando conexión */}
      {isValidating && (
        <div className="bg-emerald-900/30 text-emerald-400 px-4 py-1.5 text-xs text-center border-b border-emerald-900/50 flex items-center justify-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Validando conexión con Moodle...
        </div>
      )}

      {/* Conectado vía LTI */}
      {!isValidating && hasLti && (
        <div className="bg-emerald-900/20 text-emerald-400 px-4 py-2 text-sm flex items-center justify-center gap-2 border-b border-emerald-800/40">
          <GraduationCap size={15} />
          Conectado como <strong>{ltiUser?.name}</strong> vía Moodle LTI
          {ltiUser?.roles && ltiUser.roles.length > 0 && (
            <span className="text-xs text-emerald-600 ml-1">
              ({ltiUser.roles[0]?.split('#')[1] ?? 'Learner'})
            </span>
          )}
        </div>
      )}

      {/* Error de conexión LTI (no bloquea la app) */}
      {!isValidating && ltiError && (
        <div className="bg-rose-900/20 text-rose-400 px-4 py-2 text-xs flex items-center justify-center gap-2 border-b border-rose-800/40">
          <AlertTriangle size={13} />
          Error LTI: {ltiError} — La app funciona en modo standalone (sin sincronización de notas).
        </div>
      )}

      {/* Sin LTI — modo standalone */}
      {!isValidating && !hasLti && !ltiError && (
        <div className="bg-slate-800/40 text-slate-500 px-4 py-1.5 text-xs flex items-center justify-center gap-2 border-b border-slate-800">
          <Wifi size={11} />
          Modo standalone — Las notas no se sincronizarán con Moodle.
        </div>
      )}

      {/* ── Layout principal ───────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar con animación de apertura/cierre */}
        <div
          className={clsx(
            'transition-all duration-300 ease-in-out flex-shrink-0 overflow-hidden',
            isSidebarOpen ? 'w-80' : 'w-0'
          )}
        >
          <Sidebar
            exercises={exercises}
            activeExerciseId={activeExerciseId}
            onSelectExercise={setActiveExerciseId}
            completedExercises={completedExercises}
          />
        </div>

        {/* Área de ejercicio activo */}
        <main className="flex-1 h-full overflow-hidden relative">
          {activeExercise ? (
            <ExerciseView
              exercise={activeExercise}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
              onExerciseComplete={handleExerciseComplete}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
              <p className="text-sm">Selecciona un ejercicio de la barra lateral para comenzar.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
