import React from 'react';
import AceEditor from 'react-ace';
import ace from 'ace-builds';

ace.config.set('basePath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.43.6/src-noconflict/');
ace.config.set('modePath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.43.6/src-noconflict/');
ace.config.set('themePath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.43.6/src-noconflict/');
ace.config.set('workerPath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.43.6/src-noconflict/');

import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github_dark';
import 'ace-builds/src-noconflict/ext-language_tools';

interface CodeEditorProps {
  mode: 'html' | 'css';
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ mode, value, onChange, readOnly = false }: CodeEditorProps) {
  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-slate-700 shadow-inner">
      <AceEditor
        mode={mode}
        theme="github_dark"
        name={`editor-${mode}`}
        onChange={onChange}
        value={value}
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        readOnly={readOnly}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
          useWorker: false, // Disable syntax checker worker to avoid cross-origin issues in some environments
          fontFamily: '"JetBrains Mono", monospace',
        }}
        style={{ width: '100%', height: '100%' }}
        className="ace-editor-custom"
      />
    </div>
  );
}
