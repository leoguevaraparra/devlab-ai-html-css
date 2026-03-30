import React, { useState, useMemo } from 'react';
import { Exercise, Difficulty } from '../types';
import { Search, Filter, Code2, BookOpen } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  exercises: Exercise[];
  activeExerciseId: string | null;
  onSelectExercise: (id: string) => void;
}

export function Sidebar({ exercises, activeExerciseId, onSelectExercise }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'Todas'>('Todas');

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = selectedDifficulty === 'Todas' || ex.difficulty === selectedDifficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [exercises, searchTerm, selectedDifficulty]);

  const difficulties: (Difficulty | 'Todas')[] = ['Todas', 'Junior', 'Semi senior', 'Senior'];

  return (
    <div className="w-full bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300 min-w-80">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3 text-emerald-400 mb-6 pb-2 border-b border-slate-800/50">
          <img src="/logo.png" alt="Logo Change" className="h-10 object-contain" title="Logo" />
          <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
            <Code2 size={24} />
            <h1 className="text-xl font-bold tracking-tight text-white">DevLab HTML</h1>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Buscar ejercicios o etiquetas..."
            className="w-full bg-slate-800 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-slate-700 placeholder-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Filter size={14} className="text-slate-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dificultad</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={clsx(
                "text-xs px-2.5 py-1 rounded-full transition-colors border",
                selectedDifficulty === diff
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
              )}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredExercises.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-8">
            No se encontraron ejercicios.
          </div>
        ) : (
          filteredExercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => onSelectExercise(ex.id)}
              className={clsx(
                "w-full text-left p-3 rounded-xl transition-all border",
                activeExerciseId === ex.id
                  ? "bg-slate-800 border-emerald-500/50 shadow-sm"
                  : "bg-slate-800/50 border-transparent hover:bg-slate-800 hover:border-slate-700"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={clsx("font-medium text-sm", activeExerciseId === ex.id ? "text-white" : "text-slate-200")}>
                  {ex.title}
                </h3>
                <span className={clsx(
                  "text-[10px] px-1.5 py-0.5 rounded font-medium",
                  ex.difficulty === 'Junior' && "bg-emerald-500/10 text-emerald-400",
                  ex.difficulty === 'Semi senior' && "bg-amber-500/10 text-amber-400",
                  ex.difficulty === 'Senior' && "bg-rose-500/10 text-rose-400"
                )}>
                  {ex.difficulty}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {ex.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
                {ex.tags.length > 3 && <span className="text-[10px] text-slate-500">+{ex.tags.length - 3}</span>}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
