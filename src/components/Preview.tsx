import React from 'react';
import { CodeState } from '../types';

interface PreviewProps {
  code: CodeState;
}

/**
 * Componente de vista previa en tiempo real del código HTML/CSS del estudiante.
 *
 * Renderiza el código en un iframe con debounce de 500ms para evitar
 * re-renders excesivos mientras el estudiante escribe.
 *
 * ## Seguridad:
 * El atributo `sandbox` usa SOLO `allow-scripts`, excluyendo deliberadamente
 * `allow-same-origin`. Esto impide que el código del estudiante acceda al
 * `sessionStorage`, `localStorage` o cookies del documento padre, protegiendo
 * el token LTIK de posibles ataques XSS en el contexto de Moodle.
 */
export function Preview({ code }: PreviewProps) {
  const [debouncedCode, setDebouncedCode] = React.useState<CodeState>(code);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(code);
    }, 500);

    return () => clearTimeout(timer);
  }, [code]);

  const fullHtml = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <style>
      body { margin: 0; padding: 16px; font-family: sans-serif; box-sizing: border-box; }
      *, *::before, *::after { box-sizing: inherit; }
      ${debouncedCode.css}
    </style>
  </head>
  <body>
    ${debouncedCode.html}
  </body>
</html>`;

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm flex flex-col">
      {/* Barra de título estilo navegador */}
      <div className="flex-none h-7 bg-slate-100 border-b border-slate-200 flex items-center px-3 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <span className="text-[10px] text-slate-400 font-medium ml-2 uppercase tracking-wider">
          Vista Previa en Vivo
        </span>
      </div>
      <iframe
        title="Vista previa del código del estudiante"
        className="w-full flex-1 bg-white border-none"
        /* SEGURIDAD: allow-same-origin EXCLUIDO deliberadamente para proteger
           el sessionStorage del padre (token LTIK) ante código malicioso. */
        sandbox="allow-scripts"
        srcDoc={fullHtml}
      />
    </div>
  );
}
