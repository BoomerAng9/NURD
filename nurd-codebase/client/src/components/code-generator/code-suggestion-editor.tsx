import React, { useState, useEffect, useRef, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Code, Copy, Check, BrainCircuit } from 'lucide-react';

// Debounce helper to prevent too many API calls
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Interface for component props
interface CodeSuggestionEditorProps {
  initialLanguage?: string;
  className?: string;
}

export const CodeSuggestionEditor: React.FC<CodeSuggestionEditorProps> = ({
  initialLanguage = 'javascript',
  className = '',
}) => {
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [language, setLanguage] = useState(initialLanguage);
  const [isCopied, setIsCopied] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const debouncedCode = useDebounce(code, 800);
  const debouncedCursorPosition = useDebounce(cursorPosition, 800);

  // Get suggestions while typing
  useEffect(() => {
    const getSuggestion = async () => {
      if (debouncedCode.trim().length < 10) {
        setSuggestion('');
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await apiRequest('POST', '/api/code-suggestion', {
          code: debouncedCode,
          language,
          cursorPosition: debouncedCursorPosition
        });
        
        if (!response.ok) {
          throw new Error('Failed to get suggestion');
        }
        
        const data = await response.json();
        setSuggestion(data.suggestion);
      } catch (error) {
        console.error('Error getting suggestion:', error);
        setSuggestion('');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (debouncedCode) {
      getSuggestion();
    }
  }, [debouncedCode, debouncedCursorPosition, language]);

  // Update cursor position when typing
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleTextAreaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (textAreaRef.current) {
      setCursorPosition(textAreaRef.current.selectionStart);
    }
  };

  const handleTextAreaKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (textAreaRef.current) {
      setCursorPosition(textAreaRef.current.selectionStart);
    }
  };

  // Apply the AI suggestion
  const applySuggestion = () => {
    if (!suggestion) return;
    
    const beforeCursor = code.substring(0, cursorPosition);
    const afterCursor = code.substring(cursorPosition);
    setCode(beforeCursor + suggestion + afterCursor);
    
    // Reset suggestion
    setSuggestion('');
    
    // Focus the textarea
    if (textAreaRef.current) {
      const newPosition = cursorPosition + suggestion.length;
      setTimeout(() => {
        textAreaRef.current?.focus();
        textAreaRef.current?.setSelectionRange(newPosition, newPosition);
        setCursorPosition(newPosition);
      }, 50);
    }
  };

  // Copy code to clipboard
  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code)
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
  }, [code, toast]);

  return (
    <div className={`bg-gray-900 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="border-b border-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Smart Code Editor</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            className="px-3 py-1 rounded bg-gray-800 border border-gray-700 text-white text-sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
          </select>
          
          <button
            className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-white transition-all"
            onClick={copyCode}
            title="Copy code"
          >
            {isCopied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          ref={textAreaRef}
          className="w-full h-80 p-4 bg-gray-950 text-gray-200 font-mono resize-none focus:outline-none focus:ring-0"
          value={code}
          onChange={handleTextAreaChange}
          onClick={handleTextAreaClick}
          onKeyUp={handleTextAreaKeyUp}
          placeholder="Start typing code to receive AI suggestions..."
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
        />
        
        {/* Suggestion UI */}
        {isLoading && (
          <div className="absolute top-3 right-3 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        
        {suggestion && !isLoading && (
          <div className="absolute bottom-3 right-3 flex flex-col items-end">
            <div className="bg-gray-800 rounded-lg p-3 max-w-xs text-sm">
              <div className="text-gray-400 mb-2 text-xs flex items-center gap-2">
                <BrainCircuit className="h-3.5 w-3.5" />
                <span>AI Suggestion</span>
              </div>
              <pre className="text-gray-300 font-mono text-xs whitespace-pre-wrap mb-2">{suggestion}</pre>
              <button
                className="w-full px-2 py-1 bg-purple-700 hover:bg-purple-600 text-white rounded text-xs transition-colors"
                onClick={applySuggestion}
              >
                Apply Suggestion
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-800 p-3 flex items-center text-xs text-gray-500">
        <Code className="h-3.5 w-3.5 mr-2" />
        <span>Type code and pause briefly to receive AI suggestions</span>
      </div>
    </div>
  );
};

export default CodeSuggestionEditor;