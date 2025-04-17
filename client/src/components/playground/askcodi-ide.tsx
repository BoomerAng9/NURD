import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, Code, Play, Save, Download, RotateCw, 
  Lightbulb, Zap, Settings, PanelLeft, MessageSquare 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getCodeGenerationWithAskCodi, 
  getCodeExplanationWithAskCodi, 
  getCodeCompletionWithAskCodi,
  getAvailableModels
} from '../../services/askcodi-service';

// Programming languages supported in the IDE
const languages = [
  { value: 'javascript', label: 'JavaScript', extension: 'js' },
  { value: 'typescript', label: 'TypeScript', extension: 'ts' },
  { value: 'python', label: 'Python', extension: 'py' },
  { value: 'java', label: 'Java', extension: 'java' },
  { value: 'csharp', label: 'C#', extension: 'cs' },
  { value: 'go', label: 'Go', extension: 'go' },
  { value: 'rust', label: 'Rust', extension: 'rs' },
  { value: 'html', label: 'HTML', extension: 'html' },
  { value: 'css', label: 'CSS', extension: 'css' },
  { value: 'sql', label: 'SQL', extension: 'sql' },
];

// Initial code templates
const codeTemplates = {
  javascript: `// Welcome to the NURD JavaScript Playground!
// Powered by AskCodi AI

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
  typescript: `// Welcome to the NURD TypeScript Playground!
// Powered by AskCodi AI

function greet(name: string): string {
  return \`Hello, \${name}! Welcome to NURD coding!\`;
}

// Call the function with your name
const message: string = greet("NURD Student");
console.log(message);

// Try creating a simple loop
for (let i: number = 1; i <= 5; i++) {
  console.log(\`Count: \${i}\`);
}`,
  python: `# Welcome to the NURD Python Playground!
# Powered by AskCodi AI

def greet(name):
    return f"Hello, {name}! Welcome to NURD coding!"

# Call the function with your name
message = greet("NURD Student")
print(message)

# Try creating a simple loop
for i in range(1, 6):
    print(f"Count: {i}")`,
  java: `// Welcome to the NURD Java Playground!
// Powered by AskCodi AI

public class Main {
    public static void main(String[] args) {
        String message = greet("NURD Student");
        System.out.println(message);
        
        // Try creating a simple loop
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "! Welcome to NURD coding!";
    }
}`,
  csharp: `// Welcome to the NURD C# Playground!
// Powered by AskCodi AI

using System;

class Program {
    static void Main() {
        string message = Greet("NURD Student");
        Console.WriteLine(message);
        
        // Try creating a simple loop
        for (int i = 1; i <= 5; i++) {
            Console.WriteLine($"Count: {i}");
        }
    }
    
    static string Greet(string name) {
        return $"Hello, {name}! Welcome to NURD coding!";
    }
}`,
  go: `// Welcome to the NURD Go Playground!
// Powered by AskCodi AI

package main

import "fmt"

func greet(name string) string {
    return fmt.Sprintf("Hello, %s! Welcome to NURD coding!", name)
}

func main() {
    message := greet("NURD Student")
    fmt.Println(message)
    
    // Try creating a simple loop
    for i := 1; i <= 5; i++ {
        fmt.Printf("Count: %d\\n", i)
    }
}`,
  rust: `// Welcome to the NURD Rust Playground!
// Powered by AskCodi AI

fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to NURD coding!", name)
}

fn main() {
    let message = greet("NURD Student");
    println!("{}", message);
    
    // Try creating a simple loop
    for i in 1..=5 {
        println!("Count: {}", i);
    }
}`,
  html: `<!-- Welcome to the NURD HTML Playground! -->
<!-- Powered by AskCodi AI -->

<!DOCTYPE html>
<html>
<head>
    <title>NURD Playground</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #3A6EA5;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to NURD Coding!</h1>
        <p>This is a simple HTML template you can edit.</p>
        <p>Try modifying this code to create your own webpage!</p>
    </div>
</body>
</html>`,
  css: `/* Welcome to the NURD CSS Playground! */
/* Powered by AskCodi AI */

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f0f2f5;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    background-color: #3A6EA5;
    color: white;
    padding: 1rem;
    text-align: center;
}

.card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
    margin-bottom: 20px;
}

button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #45a049;
}`,
  sql: `-- Welcome to the NURD SQL Playground!
-- Powered by AskCodi AI

-- Create a table for students
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    grade CHAR(1),
    enrollment_date DATE
);

-- Insert some sample data
INSERT INTO students (id, name, age, grade, enrollment_date)
VALUES 
    (1, 'John Smith', 16, 'A', '2023-09-01'),
    (2, 'Emily Johnson', 15, 'B', '2023-09-02'),
    (3, 'Michael Brown', 16, 'A', '2023-08-15'),
    (4, 'Sarah Davis', 15, 'C', '2023-09-10'),
    (5, 'James Wilson', 16, 'B', '2023-08-20');

-- Query to find all students with grade 'A'
SELECT * FROM students WHERE grade = 'A';

-- Query to find average age by grade
SELECT grade, AVG(age) as average_age
FROM students
GROUP BY grade
ORDER BY grade;`
};

// Default prompts for AI-assisted actions
const defaultPrompts = {
  completion: "Complete this code",
  explanation: "Explain this code in detail",
  optimization: "Optimize this code for better performance",
  refactoring: "Refactor this code to make it more maintainable",
  debugging: "Debug this code and fix any errors"
};

export default function AskCodiIDE() {
  const { toast } = useToast();
  
  // Editor state
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [code, setCode] = useState<string>(codeTemplates.javascript);
  const [language, setLanguage] = useState<string>('javascript');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Chat/AI assistant state
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([
    {role: 'assistant', content: 'Hi! I\'m your AI coding assistant. How can I help you with your code today?'}
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  
  // AI model settings
  const [askCodiModels, setAskCodiModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('default');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(true);
  
  // Project management
  const [projectName, setProjectName] = useState<string>('Untitled Project');
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  
  // Add a reference for the chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch AskCodi models on component mount
  useEffect(() => {
    async function fetchAskCodiModels() {
      setIsLoadingModels(true);
      try {
        const models = await getAvailableModels();
        setAskCodiModels(models.length > 0 ? models : ['default']);
      } catch (error) {
        console.error('Error fetching AskCodi models:', error);
        setAskCodiModels(['default', 'GPT 4o mini', 'Claude 3.5 Haiku', 'Mistral Nemo', 'Gemini 2.0 Flash', 'Meta', 'Claude 3.7 Sonnet']);
        
        toast({
          title: "Couldn't fetch models",
          description: "Using default model list instead.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingModels(false);
      }
    }
    
    fetchAskCodiModels();
    
    // Load saved projects
    const savedData = localStorage.getItem('nurd-askcodi-projects');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSavedProjects(parsed);
      } catch (e) {
        console.error('Error parsing saved projects:', e);
      }
    }
  }, [toast]);
  
  // Update code when language changes
  useEffect(() => {
    // Only change if we have a template for this language
    if (codeTemplates[language as keyof typeof codeTemplates]) {
      setCode(codeTemplates[language as keyof typeof codeTemplates]);
      setOutput('');
    }
  }, [language]);
  
  // Scroll chat to bottom whenever chat history changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    if (code !== codeTemplates[language as keyof typeof codeTemplates]) {
      if (confirm('Changing language will reset your current code. Continue?')) {
        setLanguage(newLanguage);
      }
    } else {
      setLanguage(newLanguage);
    }
  };
  
  // Handle code execution
  const runCode = () => {
    setIsRunning(true);
    setOutput('');
    
    // Simple code execution simulation with timeout to mimic processing
    setTimeout(() => {
      try {
        const languageType = languages.find(lang => lang.value === language);
        
        if (language === 'javascript') {
          // For JavaScript, we can actually execute the code in a safe way
          // Create a new function with the code and capture console.log output
          const originalLog = console.log;
          let outputBuffer = '';
          
          console.log = (...args) => {
            outputBuffer += args.join(' ') + '\n';
            originalLog(...args);
          };
          
          try {
            // Create a safe execution environment
            const safeEval = new Function('code', `
              try {
                ${code}
                return { success: true, output: "" };
              } catch (error) {
                return { success: false, error: error.toString() };
              }
            `);
            
            const result = safeEval(code);
            
            if (!result.success) {
              outputBuffer += `Error: ${result.error}\n`;
            }
            
            setOutput(outputBuffer || 'Code executed successfully. No output generated.');
          } catch (error: any) {
            setOutput(`Error: ${error?.toString() || 'Unknown error occurred'}`);
          } finally {
            // Restore original console.log
            console.log = originalLog;
          }
        } else {
          // For other languages, we'll just simulate execution
          setOutput(`[${languageType?.label || language} code execution simulated]\n\nConsole Output:\nNote: Full execution of ${languageType?.label || language} code requires a backend service.`);
          
          // Add simulated output for some languages to make it realistic
          if (language === 'python') {
            const printStatements = code.match(/print\((.*?)\)/g) || [];
            if (printStatements.length > 0) {
              setOutput(prev => prev + '\n\nSimulated Output:');
              printStatements.forEach(statement => {
                const content = statement.match(/print\((.*?)\)/)?.[1] || '';
                setOutput(prev => prev + `\n${content.replace(/['"]/g, '')}`);
              });
            }
          }
        }
      } catch (error: any) {
        setOutput(`Error executing code: ${error?.toString() || 'Unknown error occurred'}`);
      } finally {
        setIsRunning(false);
      }
    }, 1000);
  };
  
  // Handle project saving
  const saveProject = () => {
    // Generate a name for the project if none exists
    const newProjectName = projectName || `${language.charAt(0).toUpperCase() + language.slice(1)} Project - ${new Date().toLocaleString()}`;
    
    // Create project object
    const project = {
      id: Date.now().toString(),
      name: newProjectName,
      language,
      code,
      model: selectedModel,
      createdAt: new Date().toISOString(),
    };
    
    // Add to saved projects
    const updatedProjects = [...savedProjects, project];
    setSavedProjects(updatedProjects);
    
    // Save to localStorage
    try {
      localStorage.setItem('nurd-askcodi-projects', JSON.stringify(updatedProjects));
      
      toast({
        title: "Project saved",
        description: `${newProjectName} has been saved successfully.`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was an error saving your project.",
        variant: "destructive"
      });
    }
  };
  
  // Handle project loading
  const loadProject = (project: any) => {
    setCode(project.code);
    setLanguage(project.language);
    setProjectName(project.name);
    if (project.model && askCodiModels.includes(project.model)) {
      setSelectedModel(project.model);
    }
    setOutput('');
    setActiveTab('editor');
    
    toast({
      title: "Project loaded",
      description: `${project.name} has been loaded successfully.`,
      variant: "default"
    });
  };
  
  // Handle code download
  const downloadCode = () => {
    const languageType = languages.find(lang => lang.value === language);
    const fileExtension = languageType?.extension || 'txt';
    const fileName = `${projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExtension}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code downloaded",
      description: `Your code has been downloaded as ${fileName}.`,
      variant: "default"
    });
  };
  
  // AI code completion using AskCodi
  const completeCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to complete",
        description: "Please write some code first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    try {
      const completion = await getCodeCompletionWithAskCodi({
        code: code,
        language: language,
        model: selectedModel,
        maxTokens: 500,
        temperature: temperature
      });
      
      setCode(completion);
      
      toast({
        title: "Code completed",
        description: "AI has completed your code.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error completing code:', error);
      toast({
        title: "Completion failed",
        description: "There was an error completing your code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  // AI code explanation using AskCodi
  const explainCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to explain",
        description: "Please write some code first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsChatLoading(true);
    try {
      const explanation = await getCodeExplanationWithAskCodi({
        code: code,
        language: language,
        model: selectedModel
      });
      
      // Add to chat history
      setChatHistory(prev => [
        ...prev, 
        { role: 'user', content: 'Please explain this code.' },
        { role: 'assistant', content: explanation }
      ]);
      
      // Switch to chat tab
      setActiveTab('chat');
      
      toast({
        title: "Code explained",
        description: "AI has explained your code.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error explaining code:', error);
      toast({
        title: "Explanation failed",
        description: "There was an error explaining your code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChatLoading(false);
    }
  };
  
  // Handle chat input and AI response
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setChatInput('');
    
    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsChatLoading(true);
    try {
      // Get response from AskCodi API
      let prompt = `CODE CONTEXT (${language}):\n${code}\n\nUSER QUERY: ${userMessage}\n\nRespond to the user query about the code shown above:`;
      
      const response = await getCodeGenerationWithAskCodi({
        prompt: prompt,
        model: selectedModel,
        maxTokens: 1000,
        temperature: temperature
      });
      
      // Add assistant response to chat history
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error processing your request. Please try again." 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };
  
  // Predefined AI actions
  const performAIAction = async (action: 'completion' | 'explanation' | 'optimization' | 'refactoring' | 'debugging') => {
    if (!code.trim()) {
      toast({
        title: "No code",
        description: "Please write some code first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsChatLoading(true);
    try {
      const prompt = `${defaultPrompts[action]}:\n\n${code}`;
      
      const response = await getCodeGenerationWithAskCodi({
        prompt: prompt,
        model: selectedModel,
        maxTokens: 1000,
        temperature: temperature
      });
      
      // Add to chat history
      setChatHistory(prev => [
        ...prev, 
        { role: 'user', content: defaultPrompts[action] },
        { role: 'assistant', content: response }
      ]);
      
      // Switch to chat tab
      setActiveTab('chat');
    } catch (error) {
      console.error(`${action} error:`, error);
      toast({
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} failed`,
        description: `There was an error with the ${action}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsChatLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#121645] mb-2">
            AskCodi AI Powered IDE
          </h1>
          <p className="text-gray-600">
            Advanced coding environment with AI assistance powered by AskCodi. Write, run, and get intelligent help with your code.
          </p>
          
          {/* AI Model and Settings Panel */}
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-2">
                <Button 
                  variant={showSettings ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  {showSettings ? 'Hide Settings' : 'Show Settings'}
                </Button>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium">Current model:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {isLoadingModels ? 'Loading...' : selectedModel}
                  </span>
                </div>
              </div>
            </div>
            
            {showSettings && (
              <div className="mt-4 space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* AI Model Selection */}
                  <div>
                    <Label htmlFor="model-select" className="text-sm mb-1 block">AI Model</Label>
                    <Select 
                      value={selectedModel} 
                      onValueChange={setSelectedModel} 
                      disabled={isLoadingModels}
                    >
                      <SelectTrigger id="model-select" className="w-full">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingModels ? (
                          <SelectItem value="loading">
                            <span className="flex items-center">
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                              Loading models...
                            </span>
                          </SelectItem>
                        ) : askCodiModels.length > 0 ? (
                          askCodiModels.map((model) => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                          ))
                        ) : (
                          <SelectItem value="default">Default</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Temperature Setting */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <Label htmlFor="temperature-slider" className="text-sm">Temperature: {temperature}</Label>
                      <span className="text-xs text-gray-500">
                        {temperature <= 0.4 ? 'More precise' : temperature >= 0.8 ? 'More creative' : 'Balanced'}
                      </span>
                    </div>
                    <Slider
                      id="temperature-slider"
                      min={0.1}
                      max={1.0}
                      step={0.1}
                      defaultValue={[temperature]}
                      onValueChange={(value) => setTemperature(value[0])}
                      className="py-2"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project Name */}
                  <div>
                    <Label htmlFor="project-name" className="text-sm mb-1 block">Project Name</Label>
                    <input
                      id="project-name"
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Enter project name"
                    />
                  </div>
                  
                  {/* Programming Language */}
                  <div>
                    <Label htmlFor="language-select" className="text-sm mb-1 block">Language</Label>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger id="language-select" className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with AI Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>AI Actions</CardTitle>
                <CardDescription>
                  Powered by AskCodi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button 
                    onClick={completeCode}
                    disabled={isRunning}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2"
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Working...
                      </>
                    ) : (
                      <>
                        <Code className="h-4 w-4" />
                        Complete Code
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={explainCode}
                    disabled={isChatLoading}
                    className="w-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2"
                  >
                    {isChatLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Working...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="h-4 w-4" />
                        Explain Code
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={() => performAIAction('optimization')}
                    disabled={isChatLoading}
                    className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    {isChatLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Working...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Optimize Code
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={() => performAIAction('refactoring')}
                    disabled={isChatLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    {isChatLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Working...
                      </>
                    ) : (
                      <>
                        <RotateCw className="h-4 w-4" />
                        Refactor Code
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={() => performAIAction('debugging')}
                    disabled={isChatLoading}
                    className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    {isChatLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Working...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Debug Code
                      </>
                    )}
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button 
                    onClick={runCode} 
                    disabled={isRunning}
                    className="w-full bg-[#22C55E] hover:bg-[#16A34A] flex items-center justify-center gap-2"
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Run Code
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={saveProject}
                    className="w-full bg-[#3B82F6] hover:bg-[#2563EB] flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Project
                  </Button>
                  
                  <Button 
                    onClick={downloadCode}
                    className="w-full bg-gray-700 hover:bg-gray-800 flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Code
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      if (codeTemplates[language as keyof typeof codeTemplates]) {
                        setCode(codeTemplates[language as keyof typeof codeTemplates]);
                      } else {
                        setCode('// Start coding here');
                      }
                      setOutput('');
                    }}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <RotateCw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {savedProjects.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Saved Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {savedProjects.slice().reverse().map((project) => (
                      <Button 
                        key={project.id}
                        variant="outline"
                        className="w-full justify-start text-left overflow-hidden"
                        onClick={() => loadProject(project)}
                      >
                        <div className="truncate">
                          <span className="font-medium">{project.name}</span>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span>{project.language}</span>
                            <span>•</span>
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Main editor area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <Code className="h-4 w-4" /> Code Editor
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> AI Chat Assistant
                </TabsTrigger>
              </TabsList>
              
              {/* Code Editor Tab */}
              <TabsContent value="editor" className="h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  {/* Code Editor */}
                  <Card className="min-h-[500px] flex flex-col">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Editor
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-0">
                      <Textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="font-mono text-sm h-full min-h-[450px] rounded-none border-0 resize-none focus-visible:ring-0"
                        placeholder="Write your code here..."
                      />
                    </CardContent>
                  </Card>
                  
                  {/* Output Console */}
                  <Card className="min-h-[500px] flex flex-col">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <PanelLeft className="h-4 w-4" />
                        Output
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-0">
                      {isRunning ? (
                        <div className="bg-black text-green-400 p-4 h-full min-h-[450px] flex items-center justify-center">
                          <div className="text-center">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                            <p>Running your code...</p>
                          </div>
                        </div>
                      ) : (
                        <pre className="bg-black text-green-400 p-4 h-full min-h-[450px] font-mono text-sm overflow-auto">
                          {output || 'Run your code to see output here.'}
                        </pre>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* AI Chat Assistant Tab */}
              <TabsContent value="chat">
                <Card className="min-h-[500px] flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      AI Chat Assistant
                    </CardTitle>
                    <CardDescription>
                      Chat with AI about your code to get help and suggestions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow p-0 flex flex-col">
                    {/* Chat Messages */}
                    <div 
                      ref={chatContainerRef}
                      className="flex-grow overflow-y-auto p-4 min-h-[400px] max-h-[400px]"
                    >
                      {chatHistory.map((message, index) => (
                        <div 
                          key={index} 
                          className={`mb-4 ${message.role === 'assistant' ? 'mr-12' : 'ml-12'}`}
                        >
                          <div className={`p-3 rounded-lg ${
                            message.role === 'assistant' 
                              ? 'bg-blue-100 text-blue-900' 
                              : 'bg-gray-100 text-gray-900 ml-auto'
                          }`}>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                          </p>
                        </div>
                      ))}
                      
                      {isChatLoading && (
                        <div className="mb-4 mr-12">
                          <div className="bg-blue-100 text-blue-900 p-3 rounded-lg flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <p>Thinking...</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">AI Assistant</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Chat Input */}
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Textarea 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask AI for help with your code..."
                          className="resize-none min-h-[60px]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (!isChatLoading) sendChatMessage();
                            }
                          }}
                        />
                        <Button 
                          onClick={sendChatMessage}
                          disabled={isChatLoading || !chatInput.trim()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isChatLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span>Send</span>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Tip: Press Enter to send, Shift+Enter for a new line
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}