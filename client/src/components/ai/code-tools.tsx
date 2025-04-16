import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Code, Lightbulb, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCodeSuggestion, getCodeExplanation, getCodeOptimization } from '../../services/openai-service';

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
];

export default function CodeTools() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('generate');
  
  // Generate Code state
  const [promptInput, setPromptInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [generationLanguage, setGenerationLanguage] = useState('javascript');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Explain Code state
  const [codeToExplain, setCodeToExplain] = useState('');
  const [codeExplanation, setCodeExplanation] = useState('');
  const [explanationLanguage, setExplanationLanguage] = useState('javascript');
  const [isExplaining, setIsExplaining] = useState(false);
  
  // Optimize Code state
  const [codeToOptimize, setCodeToOptimize] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [optimizationLanguage, setOptimizationLanguage] = useState('javascript');
  const [optimizationFocus, setOptimizationFocus] = useState('all');
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Handle code generation
  const handleGenerateCode = async () => {
    if (!promptInput.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a prompt to generate code.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const suggestion = await getCodeSuggestion({
        prompt: promptInput,
        language: generationLanguage,
      });
      
      setGeneratedCode(suggestion);
      
      toast({
        title: "Code generated successfully",
        description: "Your code has been generated based on the provided prompt.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle code explanation
  const handleExplainCode = async () => {
    if (!codeToExplain.trim()) {
      toast({
        title: "Code required",
        description: "Please enter code to explain.",
        variant: "destructive"
      });
      return;
    }

    setIsExplaining(true);
    
    try {
      const explanation = await getCodeExplanation({
        code: codeToExplain,
        language: explanationLanguage,
      });
      
      setCodeExplanation(explanation);
      
      toast({
        title: "Explanation generated",
        description: "Your code has been explained successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error explaining code:", error);
      toast({
        title: "Explanation failed",
        description: "There was an error explaining your code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExplaining(false);
    }
  };

  // Handle code optimization
  const handleOptimizeCode = async () => {
    if (!codeToOptimize.trim()) {
      toast({
        title: "Code required",
        description: "Please enter code to optimize.",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    
    try {
      const optimization = await getCodeOptimization({
        code: codeToOptimize,
        language: optimizationLanguage,
        focus: optimizationFocus as 'performance' | 'readability' | 'security' | 'all',
      });
      
      setOptimizedCode(optimization);
      
      toast({
        title: "Code optimized",
        description: "Your code has been optimized successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error optimizing code:", error);
      toast({
        title: "Optimization failed",
        description: "There was an error optimizing your code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#121645] mb-2">AI Code Tools</h1>
          <p className="text-gray-600">
            Leverage AI to generate, explain, and optimize your code. Powered by OpenAI's GPT-3.5.
          </p>
        </div>
        
        <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Code className="h-4 w-4" /> Generate Code
            </TabsTrigger>
            <TabsTrigger value="explain" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" /> Explain Code
            </TabsTrigger>
            <TabsTrigger value="optimize" className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> Optimize Code
            </TabsTrigger>
          </TabsList>
          
          {/* Generate Code Tab */}
          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>Generate Code from Prompt</CardTitle>
                <CardDescription>
                  Describe what you want to create, and AI will generate code for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt-input">Prompt</Label>
                  <Textarea
                    id="prompt-input"
                    placeholder="Describe the code you want to generate, e.g., 'Create a function that calculates the fibonacci sequence'"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="language-select">Language</Label>
                  <Select value={generationLanguage} onValueChange={setGenerationLanguage}>
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
                
                {generatedCode && (
                  <div className="space-y-2 mt-4">
                    <Label>Generated Code</Label>
                    <div className="bg-black text-white p-4 rounded-md whitespace-pre-wrap overflow-auto max-h-[400px]">
                      <pre>{generatedCode}</pre>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGenerateCode} 
                  disabled={isGenerating || !promptInput.trim()}
                  className="w-full bg-[#3B82F6] hover:bg-[#2563EB]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Code'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Explain Code Tab */}
          <TabsContent value="explain">
            <Card>
              <CardHeader>
                <CardTitle>Get Code Explanation</CardTitle>
                <CardDescription>
                  Paste code and get a detailed explanation in simple terms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code-to-explain">Your Code</Label>
                  <Textarea
                    id="code-to-explain"
                    placeholder="Paste the code you want explained here"
                    value={codeToExplain}
                    onChange={(e) => setCodeToExplain(e.target.value)}
                    className="min-h-[150px] font-mono text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="explanation-language">Language</Label>
                  <Select value={explanationLanguage} onValueChange={setExplanationLanguage}>
                    <SelectTrigger id="explanation-language">
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
                
                {codeExplanation && (
                  <div className="space-y-2 mt-4">
                    <Label>Explanation</Label>
                    <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap overflow-auto max-h-[400px] border border-gray-200">
                      {codeExplanation}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleExplainCode} 
                  disabled={isExplaining || !codeToExplain.trim()}
                  className="w-full bg-[#3B82F6] hover:bg-[#2563EB]"
                >
                  {isExplaining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Explain Code'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Optimize Code Tab */}
          <TabsContent value="optimize">
            <Card>
              <CardHeader>
                <CardTitle>Optimize Your Code</CardTitle>
                <CardDescription>
                  Improve your code's performance, readability, or security.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code-to-optimize">Your Code</Label>
                  <Textarea
                    id="code-to-optimize"
                    placeholder="Paste the code you want to optimize here"
                    value={codeToOptimize}
                    onChange={(e) => setCodeToOptimize(e.target.value)}
                    className="min-h-[150px] font-mono text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="optimization-language">Language</Label>
                    <Select value={optimizationLanguage} onValueChange={setOptimizationLanguage}>
                      <SelectTrigger id="optimization-language">
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
                  <div>
                    <Label>Optimization Focus</Label>
                    <RadioGroup 
                      value={optimizationFocus} 
                      onValueChange={setOptimizationFocus}
                      className="flex space-x-2 pt-2"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="performance" id="performance" />
                        <Label htmlFor="performance" className="text-sm">Performance</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="readability" id="readability" />
                        <Label htmlFor="readability" className="text-sm">Readability</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="security" id="security" />
                        <Label htmlFor="security" className="text-sm">Security</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all" className="text-sm">All</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                {optimizedCode && (
                  <div className="space-y-2 mt-4">
                    <Label>Optimized Code</Label>
                    <div className="bg-black text-white p-4 rounded-md whitespace-pre-wrap overflow-auto max-h-[400px]">
                      <pre>{optimizedCode}</pre>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleOptimizeCode} 
                  disabled={isOptimizing || !codeToOptimize.trim()}
                  className="w-full bg-[#3B82F6] hover:bg-[#2563EB]"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    'Optimize Code'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}