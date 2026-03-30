import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ExerciseView } from './components/ExerciseView';
import { exercises } from './data/exercises';
import { useLTI } from './hooks/useLTI';
import clsx from 'clsx';
import { GraduationCap } from 'lucide-react';

export default function App() {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(exercises[0]?.id || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { ltiUser, isValidating, hasLti } = useLTI();

  const activeExercise = exercises.find((ex) => ex.id === activeExerciseId);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden font-sans text-slate-300">
      {/* LTI Top Banner */}
      {isValidating && (
        <div className="bg-emerald-900/40 text-emerald-400 px-4 py-1 text-xs text-center border-b border-emerald-900/60">
          Validando conexión LTI con Moodle...
        </div>
      )}
      {!isValidating && hasLti && (
        <div className="bg-emerald-900/20 text-emerald-400 px-4 py-2 text-sm flex items-center justify-center gap-2 border-b border-emerald-800/40">
          <GraduationCap size={16} />
          Conectado como <strong>{ltiUser?.name}</strong> vía Moodle LTI
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div
          className={clsx(
            "transition-all duration-300 ease-in-out flex-shrink-0 overflow-hidden",
            isSidebarOpen ? "w-80" : "w-0"
          )}
        >
          <Sidebar
            exercises={exercises}
            activeExerciseId={activeExerciseId}
            onSelectExercise={setActiveExerciseId}
          />
        </div>
        <main className="flex-1 h-full overflow-hidden relative">
          {activeExercise ? (
            <ExerciseView
              exercise={activeExercise}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <p>Selecciona un ejercicio de la barra lateral para comenzar.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
