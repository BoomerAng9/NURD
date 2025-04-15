import React, { useState, useRef, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Code, Copy, Check, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Available programming languages
const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Go', value: 'go' },
  { label: 'PHP', value: 'php' },
  { label: 'Swift', value: 'swift' },
  { label: 'Rust', value: 'rust' },
];

export const AICodeGenerator: React.FC = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [context, setContext] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  // Function to generate code using AI
  const generateCode = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please describe what code you want to generate",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/code-generator', {
        prompt,
        language,
        context: context.trim() ? context : undefined
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate code');
      }

      const data = await response.json();
      setGeneratedCode(data.code);
      
      toast({
        title: "Code Generated",
        description: "Your code has been generated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate code. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to copy code to clipboard
  const copyCode = () => {
    if (!generatedCode) return;
    
    navigator.clipboard.writeText(generatedCode)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        
        toast({
          title: "Copied!",
          description: "Code copied to clipboard"
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

  // Execute code (only for JavaScript for now)
  const executeCode = () => {
    if (!generatedCode || language !== 'javascript') return;
    
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(generatedCode)();
      console.log('Code execution result:', result);
      
      toast({
        title: "Code Executed",
        description: "Check the console for results (F12)"
      });
    } catch (error: any) {
      toast({
        title: "Execution Failed",
        description: error.message || "Failed to execute code",
        variant: "destructive"
      });
    }
  };

  // Reset everything
  const resetGenerator = () => {
    setPrompt('');
    setContext('');
    setGeneratedCode('');
  };

  return (
    <div className="w-full mx-auto bg-gray-900 text-white rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-800">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Code className="h-6 w-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">AI Code Generator</h2>
        </div>
        
        {/* Language selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Programming Language</label>
          <select
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
        
        {/* Prompt input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">What code would you like to generate?</label>
          <textarea
            className="w-full h-24 px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="E.g., 'Create a button component with hover effects' or 'Generate a function to sort an array of objects by date property'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        
        {/* Optional context */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">Additional Context (Optional)</label>
            <button
              type="button"
              className="text-xs text-purple-400 hover:text-purple-300"
              onClick={() => setIsContextExpanded(!isContextExpanded)}
            >
              {isContextExpanded ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {isContextExpanded && (
            <textarea
              className="w-full h-32 px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Paste existing code here for context-aware generation"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            className={`flex-1 px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={generateCode}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Code className="h-4 w-4" />
                <span>Generate Code</span>
              </>
            )}
          </button>
          
          <button
            className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white font-medium transition-all"
            onClick={resetGenerator}
          >
            Reset
          </button>
        </div>
      </div>
      
      {/* Generated code display */}
      {generatedCode && (
        <div className="border-t border-gray-800 bg-gray-900">
          <div className="p-4 bg-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Generated Code</h3>
            <div className="flex gap-2">
              <button
                className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-all"
                onClick={copyCode}
                title="Copy code"
              >
                {isCopied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </button>
              
              {language === 'javascript' && (
                <button
                  className="p-2 rounded-md bg-green-700 hover:bg-green-600 text-white transition-all"
                  onClick={executeCode}
                  title="Run code (JavaScript only)"
                >
                  <Play className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-[500px] overflow-auto p-4 bg-gray-950">
            <pre ref={codeRef} className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
              {generatedCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICodeGenerator;