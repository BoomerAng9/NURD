import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Code, Copy, Check, Play, BrainCircuit } from 'lucide-react';

interface AICodeGeneratorProps {
  className?: string;
}

const AICodeGenerator: React.FC<AICodeGeneratorProps> = ({ className = '' }) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [context, setContext] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Create code generation mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/code-generator', {
        prompt,
        language,
        context: context.trim() ? context : undefined
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate code');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setGeneratedCode(data.code);
      setOutput('');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Run JavaScript code in the browser
  const runCode = () => {
    if (language !== 'javascript') {
      toast({
        title: 'Not Supported',
        description: 'Running code is only supported for JavaScript',
        variant: 'default'
      });
      return;
    }

    setIsRunning(true);
    setOutput('');

    // Create a sandbox to run the code
    try {
      // Capture console.log output
      const logs: string[] = [];
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      // Execute the code in a try/catch
      try {
        // eslint-disable-next-line no-new-func
        const result = new Function(generatedCode)();
        if (result !== undefined) {
          logs.push(`Return value: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`);
        }
        setOutput(logs.join('\n'));
      } catch (error: unknown) {
        setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }

      // Restore original console.log
      console.log = originalConsoleLog;
    } catch (error: unknown) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Copy code to clipboard
  const copyCode = () => {
    if (!generatedCode) return;
    
    navigator.clipboard.writeText(generatedCode)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        
        toast({
          title: "Copied!",
          description: "Code copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: "Failed to copy code to clipboard",
          variant: "destructive"
        });
      });
  };

  return (
    <div className={`rounded-xl overflow-hidden ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="language" className="block text-sm font-medium text-gray-300">
              Programming Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
              <option value="go">Go</option>
              <option value="ruby">Ruby</option>
              <option value="php">PHP</option>
              <option value="swift">Swift</option>
              <option value="rust">Rust</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="sql">SQL</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
              Describe What You Want to Create
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Create a function that calculates the Fibonacci sequence"
              className="w-full h-36 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="context" className="block text-sm font-medium text-gray-300">
              Context (Optional)
            </label>
            <textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Add existing code or context for better results"
              className="w-full h-36 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending || !prompt.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-purple-700 to-pink-600 text-white font-medium hover:from-purple-600 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="h-4 w-4" />
                <span>Generate Code</span>
              </>
            )}
          </button>
        </div>
        
        {/* Output Section */}
        <div className="space-y-4">
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-300">Generated Code</h3>
              
              <div className="flex items-center gap-2">
                {language === 'javascript' && generatedCode && (
                  <button
                    onClick={runCode}
                    disabled={isRunning || !generatedCode}
                    className="p-1.5 rounded bg-green-800 hover:bg-green-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    title="Run JavaScript code"
                  >
                    {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                    <span className="text-xs">Run</span>
                  </button>
                )}
                
                <button
                  onClick={copyCode}
                  disabled={!generatedCode}
                  className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Copy code"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
            
            <pre className="w-full h-64 px-3 py-2 bg-gray-950 text-gray-300 font-mono text-sm overflow-auto rounded-md border border-gray-800">
              {generatedCode || (
                <span className="text-gray-500 italic">
                  Code will appear here after generation
                </span>
              )}
            </pre>
          </div>
          
          {language === 'javascript' && (
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Output</h3>
              <pre className="w-full h-32 px-3 py-2 bg-gray-900 text-gray-300 font-mono text-sm overflow-auto rounded-md border border-gray-800">
                {isRunning ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                  </div>
                ) : output ? (
                  output
                ) : (
                  <span className="text-gray-500 italic">
                    Output will appear here after running the code
                  </span>
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICodeGenerator;