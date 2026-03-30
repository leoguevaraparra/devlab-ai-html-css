import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Loader2 } from 'lucide-react';

interface FeedbackPanelProps {
  feedback: string | null;
  isLoading: boolean;
}

export function FeedbackPanel({ feedback, isLoading }: FeedbackPanelProps) {
  return (
    <div className="h-full w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-sm flex flex-col">
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
        <Bot className="text-emerald-400" size={18} />
        <h3 className="text-sm font-semibold text-white tracking-wide">Asistente IA</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 text-slate-300 text-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
            <Loader2 className="animate-spin text-emerald-500" size={24} />
            <p>Analizando tu código...</p>
          </div>
        ) : feedback ? (
          <div className="prose prose-invert prose-sm max-w-none prose-emerald">
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center px-6">
            <Bot size={32} className="mb-3 opacity-50" />
            <p>Haz clic en "Evaluar Código" para recibir retroalimentación personalizada sobre tu solución.</p>
          </div>
        )}
      </div>
    </div>
  );
}
