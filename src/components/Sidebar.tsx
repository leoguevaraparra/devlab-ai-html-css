import React, { useState, useMemo } from 'react';
import { Exercise, Difficulty } from '../types';
import { Search, Filter, Code2, X, Trophy, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  exercises: Exercise[];
  activeExerciseId: string | null;
  onSelectExercise: (id: string) => void;
  /** Mapa de ejercicios completados: id → score obtenido. */
  completedExercises?: Record<string, number>;
}

/** Mapeo de dificultad a estilos de badge. */
const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Junior: 'bg-emerald-500/10 text-emerald-400',
  'Semi senior': 'bg-amber-500/10 text-amber-400',
  Senior: 'bg-rose-500/10 text-rose-400',
};

/**
 * Barra lateral de navegación de ejercicios.
 *
 * Permite:
 * - Buscar ejercicios por título o etiqueta
 * - Filtrar por nivel de dificultad
 * - Ver badges de ejercicios completados con su nota
 * - Ver el contador de progreso total
 */
export function Sidebar({
  exercises,
  activeExerciseId,
  onSelectExercise,
  completedExercises = {},
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'Todas'>('Todas');

  const filteredExercises = useMemo(
    () =>
      exercises.filter((ex) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          !q ||
          ex.title.toLowerCase().includes(q) ||
          ex.tags.some((tag) => tag.toLowerCase().includes(q));
        const matchesDifficulty =
          selectedDifficulty === 'Todas' || ex.difficulty === selectedDifficulty;
        return matchesSearch && matchesDifficulty;
      }),
    [exercises, searchTerm, selectedDifficulty]
  );

  const difficulties: (Difficulty | 'Todas')[] = ['Todas', 'Junior', 'Semi senior', 'Senior'];
  const completedCount = Object.keys(completedExercises).length;
  const totalCount = exercises.length;

  return (
    <div className="w-full bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300 min-w-80">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="p-4 border-b border-slate-800">
        {/* Logo + Título */}
        <div className="flex items-center gap-3 text-emerald-400 mb-5 pb-3 border-b border-slate-800/50">
          <img src="/logo.png" alt="Logo DevLab" className="h-10 object-contain" />
          <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
            <Code2 size={22} />
            <h1 className="text-xl font-bold tracking-tight text-white">DevLab HTML</h1>
          </div>
        </div>

        {/* Barra de progreso global */}
        {totalCount > 0 && (
          <div className="mb-4 bg-slate-800/60 rounded-lg p-3 border border-slate-700/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Trophy size={12} className="text-amber-400" />
                Progreso Total
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Búsqueda */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            id="search-exercises-input"
            type="text"
            placeholder="Buscar ejercicios o etiquetas..."
            className="w-full bg-slate-800 text-sm rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-slate-700 placeholder-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              id="clear-search-btn"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              title="Limpiar búsqueda"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filtro por dificultad */}
        <div className="flex items-center gap-2 mb-2">
          <Filter size={13} className="text-slate-500" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Dificultad
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {difficulties.map((diff) => (
            <button
              key={diff}
              id={`filter-${diff.toLowerCase().replace(' ', '-')}-btn`}
              onClick={() => setSelectedDifficulty(diff)}
              className={clsx(
                'text-xs px-2.5 py-1 rounded-full transition-colors border',
                selectedDifficulty === diff
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              )}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* ── Lista de ejercicios ─────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {/* Contador de resultados */}
        <p className="text-[11px] text-slate-500 px-1 pb-1">
          {filteredExercises.length} ejercicio{filteredExercises.length !== 1 ? 's' : ''}
          {searchTerm || selectedDifficulty !== 'Todas' ? ' encontrado' + (filteredExercises.length !== 1 ? 's' : '') : ' disponible' + (filteredExercises.length !== 1 ? 's' : '')}
        </p>

        {filteredExercises.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-10 flex flex-col items-center gap-2">
            <Search size={24} className="opacity-30" />
            <p>No se encontraron ejercicios.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedDifficulty('Todas'); }}
              className="text-emerald-500 hover:text-emerald-400 text-xs underline"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          filteredExercises.map((ex) => {
            const isActive = activeExerciseId === ex.id;
            const isCompleted = ex.id in completedExercises;
            const completedScore = completedExercises[ex.id];

            return (
              <button
                key={ex.id}
                id={`exercise-${ex.id}-btn`}
                onClick={() => onSelectExercise(ex.id)}
                className={clsx(
                  'w-full text-left p-3 rounded-xl transition-all border group',
                  isActive
                    ? 'bg-slate-800 border-emerald-500/50 shadow-sm shadow-emerald-900/20'
                    : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700'
                )}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <h3
                    className={clsx(
                      'font-medium text-sm leading-snug flex-1 pr-2',
                      isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                    )}
                  >
                    {ex.title}
                  </h3>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className={clsx(
                        'text-[10px] px-1.5 py-0.5 rounded font-medium',
                        DIFFICULTY_STYLES[ex.difficulty]
                      )}
                    >
                      {ex.difficulty}
                    </span>
                    {isCompleted && (
                      <span
                        className={clsx(
                          'flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded font-semibold',
                          completedScore >= 80
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : completedScore >= 50
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-rose-500/15 text-rose-400'
                        )}
                      >
                        <CheckCircle2 size={9} />
                        {completedScore}/100
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ex.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-slate-500 bg-slate-900/80 px-1.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {ex.tags.length > 3 && (
                    <span className="text-[10px] text-slate-600">
                      +{ex.tags.length - 3}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
