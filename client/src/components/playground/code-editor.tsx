import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Code, Save, RotateCcw, Lightbulb, Download } from 'lucide-react';
import { motion } from 'framer-motion';

// Sample code templates
const CODE_TEMPLATES = {
  'javascript': `// Welcome to the NURD JavaScript Playground!
// Try editing this code and click Run to see the result.

function greet(name) {
  return \`Hello, \${name}! Welcome to NURD coding!\`;
}

// Call the function with your name
const message = greet("NURD Student");
console.log(message);

// Try creating a simple loop
for (let i = 1; i <= 5; i++) {
  console.log(\`Count: \${i}\`);
}`,

  'python': `# Welcome to the NURD Python Playground!
# Try editing this code and click Run to see the result.

def greet(name):
    return f"Hello, {name}! Welcome to NURD coding!"

# Call the function with your name
message = greet("NURD Student")
print(message)

# Try creating a simple loop
for i in range(1, 6):
    print(f"Count: {i}")`,

  'html': `<!-- Welcome to the NURD HTML Playground! -->
<!-- Try editing this code and click Run to see the result. -->

<!DOCTYPE html>
<html>
<head>
    <title>My NURD Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        h1 {
            color: #3DE053;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to NURD!</h1>
        <p>This is my first web page.</p>
        <p>Try editing this HTML to create your own design!</p>
    </div>
</body>
</html>`,
};

interface CodeEditorProps {
  onCodeChange?: (code: string) => void;
  initialLanguage?: 'javascript' | 'python' | 'html';
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  onCodeChange,
  initialLanguage = 'javascript',
  readOnly = false,
}) => {
  const [code, setCode] = useState(CODE_TEMPLATES[initialLanguage]);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'html'>(initialLanguage);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [aiHelp, setAiHelp] = useState('');
  const [showAiHelp, setShowAiHelp] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Update code when language changes
  useEffect(() => {
    setCode(CODE_TEMPLATES[language]);
  }, [language]);

  // Notify parent component when code changes
  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code);
    }
  }, [code, onCodeChange]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput(''); // Clear previous output
    
    setTimeout(() => {
      try {
        // For simplicity, we're just simulating code execution here
        // In a real implementation, you would use a secure sandbox or backend service
        let simulatedOutput = '';
        
        if (language === 'javascript') {
          // Extract console.log statements and simulate their output
          const logStatements = code.match(/console\.log\((.*?)\)/g) || [];
          simulatedOutput = logStatements
            .map(statement => {
              const content = statement.match(/console\.log\((.*?)\)/)?.[1] || '';
              try {
                // Very simple evaluation - in a real app, use proper sandboxing!
                return `${eval(content)}`;
              } catch (error: any) {
                return `Error: ${error.message}`;
              }
            })
            .join('\\n');
        } else if (language === 'python') {
          simulatedOutput = 'Python code execution is simulated for demonstration.\\nFor security reasons, actual Python execution requires a backend service.';
          // Extract print statements
          const printStatements = code.match(/print\((.*?)\)/g) || [];
          if (printStatements.length > 0) {
            simulatedOutput += '\\n\\nPrint statements would output:';
            printStatements.forEach(statement => {
              const content = statement.match(/print\((.*?)\)/)?.[1] || '';
              simulatedOutput += `\\n${content.replace(/['"]/g, '')}`;
            });
          }
        } else if (language === 'html') {
          // For HTML, we'll show a preview in the output
          simulatedOutput = 'HTML Preview (simulated)';
          // Create an iframe for rendering, but this is just a placeholder
          // In a real app, you would create a sandboxed iframe
        }
        
        setOutput(simulatedOutput);
        // Simulate AI generating suggestions based on the code
        simulateAIHelp();
      } catch (error: any) {
        setOutput(`Error: ${error.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 1000); // Simulate execution delay
  };

  const simulateAIHelp = () => {
    const helpMessages = [
      "Try adding comments to explain your code. Good documentation is a key skill!",
      "Consider adding error handling with try/catch blocks for more robust code.",
      "You could refactor this into smaller functions for better readability.",
      "Great job using variables! Next, try exploring more complex data structures like arrays or objects.",
      "Have you considered using a loop to make this code more efficient?",
      "This is a good start! To challenge yourself, try adding user interaction with inputs and outputs.",
    ];
    
    const randomIndex = Math.floor(Math.random() * helpMessages.length);
    setAiHelp(helpMessages[randomIndex]);
  };

  const handleReset = () => {
    setCode(CODE_TEMPLATES[language]);
    setOutput('');
    setAiHelp('');
  };

  const handleAiHelp = () => {
    setShowAiHelp(!showAiHelp);
    if (!aiHelp) simulateAIHelp();
  };

  const handleDownload = () => {
    const fileExtensions = {
      'javascript': 'js',
      'python': 'py',
      'html': 'html',
    };
    
    const fileName = `nurd_code_${Date.now()}.${fileExtensions[language]}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col rounded-lg overflow-hidden bg-gray-900/80 backdrop-blur-lg border border-gray-700 h-full">
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-white font-medium">NURD Code Playground</h3>
        <div className="flex space-x-2">
          <Tabs defaultValue="javascript">
            <TabsList>
              <TabsTrigger 
                value="javascript" 
                onClick={() => setLanguage('javascript')}
                className={language === 'javascript' ? 'bg-blue-600 text-white' : ''}
              >
                JavaScript
              </TabsTrigger>
              <TabsTrigger 
                value="python" 
                onClick={() => setLanguage('python')}
                className={language === 'python' ? 'bg-blue-600 text-white' : ''}
              >
                Python
              </TabsTrigger>
              <TabsTrigger 
                value="html" 
                onClick={() => setLanguage('html')}
                className={language === 'html' ? 'bg-blue-600 text-white' : ''}
              >
                HTML
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-1/2 h-80 md:h-auto border-r border-gray-700 flex flex-col">
          <div className="p-2 bg-gray-800 text-gray-300 border-b border-gray-700 flex items-center">
            <Code size={16} className="mr-2" />
            <span>Editor</span>
          </div>
          <textarea
            ref={editorRef}
            value={code}
            onChange={handleCodeChange}
            className="flex-grow p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
            readOnly={readOnly}
            spellCheck={false}
          />
        </div>
        
        <div className="w-full md:w-1/2 h-80 md:h-auto flex flex-col">
          <div className="p-2 bg-gray-800 text-gray-300 border-b border-gray-700 flex items-center">
            <span>Output</span>
          </div>
          <div 
            ref={outputRef}
            className="flex-grow p-4 bg-black text-green-400 font-mono text-sm overflow-auto whitespace-pre-wrap"
          >
            {isRunning ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-center">
                  <p>Running code...</p>
                  <div className="mt-2 h-1 w-24 bg-green-600 mx-auto rounded"></div>
                </div>
              </div>
            ) : output ? (
              output.split('\\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))
            ) : (
              <div className="text-gray-500 flex items-center justify-center h-full">
                <p>Run your code to see the output here</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
        <div className="flex space-x-2">
          <Button 
            onClick={handleRun} 
            disabled={isRunning || readOnly}
            className="bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-1"
          >
            <Play size={16} className="mr-1" />
            Run
          </Button>
          <Button 
            onClick={handleReset} 
            variant="outline" 
            disabled={readOnly}
            className="flex items-center"
          >
            <RotateCcw size={16} className="mr-1" />
            Reset
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleAiHelp} 
            variant="secondary" 
            className="flex items-center"
          >
            <Lightbulb size={16} className="mr-1" />
            AI Help
          </Button>
          <Button 
            onClick={handleDownload} 
            variant="ghost" 
            className="flex items-center"
          >
            <Download size={16} className="mr-1" />
            Download
          </Button>
        </div>
      </div>
      
      {showAiHelp && aiHelp && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="p-4 bg-blue-900/70 border-t border-blue-700 text-white"
        >
          <div className="flex items-start">
            <Lightbulb size={20} className="text-yellow-300 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">AI Mentor Suggestion:</p>
              <p>{aiHelp}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};