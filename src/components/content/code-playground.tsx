'use client';

import { useState, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function CodePlayground({ code: initialCode }: { code: string }) {
  const [code, setCode] = useState(initialCode);
  const [srcDoc, setSrcDoc] = useState('');

  const runCode = () => {
    // Basic HTML template to make the code run safely
    const template = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 1rem; color: #333; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          ${code}
        </body>
      </html>
    `;
    setSrcDoc(template);
  };

  useEffect(() => {
    runCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="my-8 overflow-hidden rounded-3xl border border-border bg-background">
      <div className="flex flex-col md:flex-row">
        {/* Editor Area */}
        <div className="flex-1 border-b border-border md:border-b-0 md:border-r">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">HTML Playground</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setCode(initialCode)}>
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" className="h-7 px-3 text-xs" onClick={runCode}>
                <Play className="mr-1 h-3 w-3 fill-current" /> Run
              </Button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-[300px] w-full resize-none bg-[hsl(var(--code-bg))] p-4 font-mono text-sm text-[hsl(var(--code-foreground))] outline-none"
            spellCheck={false}
          />
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-white">
          <div className="flex items-center border-b border-border bg-muted/30 px-4 py-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Live Preview</span>
          </div>
          <iframe
            srcDoc={srcDoc}
            title="Preview"
            className="h-[300px] w-full border-none bg-white"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </Card>
  );
}
