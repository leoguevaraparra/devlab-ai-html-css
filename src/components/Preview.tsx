import React, { useEffect, useState } from 'react';
import { CodeState } from '../types';

interface PreviewProps {
  code: CodeState;
}

export function Preview({ code }: PreviewProps) {
  const [debouncedCode, setDebouncedCode] = useState<CodeState>(code);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(code);
    }, 500);

    return () => clearTimeout(timer);
  }, [code]);

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 16px; font-family: sans-serif; }
          ${debouncedCode.css}
        </style>
      </head>
      <body>
        ${debouncedCode.html}
      </body>
    </html>
  `;

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm flex flex-col">
      <div className="flex-none h-6 bg-slate-100 border-b border-slate-200 flex items-center px-2 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
        <span className="text-[10px] text-slate-400 font-medium ml-2 uppercase tracking-wider">Preview</span>
      </div>
      <iframe
        title="preview"
        className="w-full flex-1 bg-white border-none"
        sandbox="allow-scripts allow-same-origin"
        srcDoc={fullHtml}
      />
    </div>
  );
}
