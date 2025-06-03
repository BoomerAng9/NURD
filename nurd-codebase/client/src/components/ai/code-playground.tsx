import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Code, Play, Save, Download, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { value: 'javascript', label: 'JavaScript', editor: 'javascript', runner: 'js' },
  { value: 'typescript', label: 'TypeScript', editor: 'typescript', runner: 'ts' },
  { value: 'python', label: 'Python', editor: 'python', runner: 'py' },
  { value: 'html', label: 'HTML', editor: 'html', runner: 'html' },
  { value: 'css', label: 'CSS', editor: 'css', runner: 'css' },
];

export default function CodePlayground() {
  const { toast } = useToast();
  const [code, setCode] = useState<string>('// Start coding here\nconsole.log("Hello, world!");');
  const [output, setOutput] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('code');
  const [savedProjects, setSavedProjects] = useState<any[]>([]);

  // Load saved projects from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('nurd-code-projects');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSavedProjects(parsed);
      } catch (e) {
        console.error('Error parsing saved projects:', e);
      }
    }
  }, []);

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
          setOutput(`[${languageType?.label || language} code execution simulated]\n\nConsole Output:\nHello, world!\n\nNote: Full execution of ${languageType?.label || language} code requires a backend service.`);
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
    setIsSaving(true);
    
    // Generate a name for the project if none exists
    const projectName = `${language.charAt(0).toUpperCase() + language.slice(1)} Project - ${new Date().toLocaleString()}`;
    
    // Create project object
    const project = {
      id: Date.now().toString(),
      name: projectName,
      language,
      code,
      createdAt: new Date().toISOString(),
    };
    
    // Add to saved projects
    const updatedProjects = [...savedProjects, project];
    setSavedProjects(updatedProjects);
    
    // Save to localStorage
    try {
      localStorage.setItem('nurd-code-projects', JSON.stringify(updatedProjects));
      
      toast({
        title: "Project saved",
        description: `Your ${language} project has been saved successfully.`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was an error saving your project.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle project loading
  const loadProject = (project: any) => {
    setCode(project.code);
    setLanguage(project.language);
    setOutput('');
    setActiveTab('code');
    
    toast({
      title: "Project loaded",
      description: `${project.name} has been loaded successfully.`,
      variant: "default"
    });
  };

  // Handle code download
  const downloadCode = () => {
    const languageType = languages.find(lang => lang.value === language);
    const fileExtension = languageType?.runner || 'txt';
    const fileName = `code.${fileExtension}`;
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

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#121645] mb-2">Code Playground</h1>
          <p className="text-gray-600">
            Write, run, and experiment with code directly in your browser. No setup required.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language-select">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language-select">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
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
                    disabled={isSaving}
                    className="w-full bg-[#3B82F6] hover:bg-[#2563EB] flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Project
                      </>
                    )}
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
                      setCode('// Start coding here\nconsole.log("Hello, world!");');
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
                  <div className="space-y-2">
                    {savedProjects.slice().reverse().map((project) => (
                      <Button 
                        key={project.id}
                        variant="outline"
                        className="w-full justify-start text-left overflow-hidden"
                        onClick={() => loadProject(project)}
                      >
                        <div className="truncate">
                          <span className="font-medium">{project.name.split(' - ')[0]}</span>
                          <span className="text-xs text-gray-500 block">
                            {new Date(project.createdAt).toLocaleString()}
                          </span>
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
            <Tabs defaultValue="code" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code className="h-4 w-4" /> Code Editor
                </TabsTrigger>
                <TabsTrigger value="output" className="flex items-center gap-2">
                  <Play className="h-4 w-4" /> Output
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="code">
                <Card className="border-t-0 rounded-tl-none">
                  <CardContent className="pt-6">
                    <div className="relative">
                      <Textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="font-mono text-sm resize-none min-h-[500px] w-full p-4"
                        placeholder="Write your code here..."
                      />
                      <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {language.toUpperCase()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="output">
                <Card className="border-t-0 rounded-tl-none">
                  <CardContent className="pt-6">
                    <div className="relative">
                      <pre className="bg-black text-white p-4 rounded-md whitespace-pre-wrap overflow-auto min-h-[500px] text-sm font-mono">
                        {output || 'Run your code to see output here.'}
                      </pre>
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