import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ExerciseView } from './components/ExerciseView';
import { exercises } from './data/exercises';
import clsx from 'clsx';

export default function App() {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(exercises[0]?.id || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeExercise = exercises.find((ex) => ex.id === activeExerciseId);

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans">
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
  );
}
