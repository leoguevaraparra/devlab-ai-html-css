import React, { useState, useEffect } from 'react';
import { Exercise, CodeState } from '../types';
import { CodeEditor } from './CodeEditor';
import { Preview } from './Preview';
import { FeedbackPanel } from './FeedbackPanel';
import { evaluateExercise } from '../services/aiService';
import { Play, CheckCircle2, FileCode2, Paintbrush, Loader2, GripVertical, GripHorizontal, PanelLeftClose, PanelLeftOpen, ChevronUp, ChevronDown } from 'lucide-react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import clsx from 'clsx';

interface ExerciseViewProps {
  exercise: Exercise;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function ExerciseView({ exercise, isSidebarOpen, onToggleSidebar }: ExerciseViewProps) {
  const [code, setCode] = useState<CodeState>({ html: exercise.initialHtml, css: exercise.initialCss });
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);

  useEffect(() => {
    setCode({ html: exercise.initialHtml, css: exercise.initialCss });
    setFeedback(null);
    setActiveTab('html');
  }, [exercise]);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    const result = await evaluateExercise(exercise, code);
    setFeedback(result);
    setIsEvaluating(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300">
      <div className="flex-none p-6 border-b border-slate-800 bg-slate-900/50">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4">
            <button
              onClick={onToggleSidebar}
              className="mt-1 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              title={isSidebarOpen ? "Ocultar barra lateral" : "Mostrar barra lateral"}
            >
              {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight mb-2">{exercise.title}</h1>
              <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">{exercise.description}</p>
            </div>
          </div>
          <button
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEvaluating ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
            Evaluar Código
          </button>
        </div>

        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
          <button 
            onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-800/80 transition-colors"
          >
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Instrucciones
            </h3>
            {isInstructionsOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
          </button>
          
          <div className={clsx("transition-all duration-300 ease-in-out overflow-hidden", isInstructionsOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0")}>
            <ul className="space-y-2 p-4 pt-0">
              {exercise.instructions.map((inst, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-xs font-medium mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{inst}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <PanelGroup direction="horizontal" className="h-full w-full">
          <Panel defaultSize={50} minSize={30} className="flex flex-col gap-4 pr-3">
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start">
              <button
                onClick={() => setActiveTab('html')}
                className={clsx(
                  "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                  activeTab === 'html' ? "bg-slate-800 text-emerald-400 shadow-sm" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <FileCode2 size={16} />
                HTML
              </button>
              <button
                onClick={() => setActiveTab('css')}
                className={clsx(
                  "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                  activeTab === 'css' ? "bg-slate-800 text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Paintbrush size={16} />
                CSS
              </button>
            </div>
            <div className="flex-1 relative">
              <div className={clsx("absolute inset-0 transition-opacity duration-200", activeTab === 'html' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
                <CodeEditor
                  mode="html"
                  value={code.html}
                  onChange={(val) => setCode({ ...code, html: val })}
                />
              </div>
              <div className={clsx("absolute inset-0 transition-opacity duration-200", activeTab === 'css' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
                <CodeEditor
                  mode="css"
                  value={code.css}
                  onChange={(val) => setCode({ ...code, css: val })}
                />
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-transparent hover:bg-emerald-500/20 active:bg-emerald-500/40 transition-colors cursor-col-resize flex items-center justify-center rounded-full group">
            <div className="w-1 h-8 bg-slate-700 group-hover:bg-emerald-500 rounded-full transition-colors flex items-center justify-center">
              <GripVertical size={12} className="text-slate-500 group-hover:text-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </PanelResizeHandle>

          <Panel defaultSize={50} minSize={30} className="pl-3">
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={20} className="pb-3">
                <Preview code={code} />
              </Panel>

              <PanelResizeHandle className="h-2 bg-transparent hover:bg-emerald-500/20 active:bg-emerald-500/40 transition-colors cursor-row-resize flex items-center justify-center rounded-full group">
                <div className="h-1 w-8 bg-slate-700 group-hover:bg-emerald-500 rounded-full transition-colors flex items-center justify-center">
                  <GripHorizontal size={12} className="text-slate-500 group-hover:text-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </PanelResizeHandle>

              <Panel defaultSize={50} minSize={20} className="pt-3">
                <FeedbackPanel feedback={feedback} isLoading={isEvaluating} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
