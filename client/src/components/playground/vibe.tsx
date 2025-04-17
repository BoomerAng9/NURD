import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Code, Edit, Settings, Wand2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getCodeGenerationWithAskCodi, getCodeExplanationWithAskCodi, getCodeCompletionWithAskCodi, getAvailableModels } from '@/services/askcodi-service';

export default function VIBE() {
  const [tab, setTab] = useState('generate');
  const [code, setCode] = useState('');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [temperature, setTemperature] = useState(0.7);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  // Load available models
  useEffect(() => {
    async function loadModels() {
      try {
        const models = await getAvailableModels();
        setAvailableModels(models);
        // Set default model to the first one
        if (models.length > 0) {
          setSelectedModel(models[0]);
        }
      } catch (error) {
        console.error('Failed to load models:', error);
        toast({
          title: 'Error loading models',
          description: 'Could not load available models. Please try again later.',
          variant: 'destructive',
        });
      }
    }
    
    loadModels();
  }, []);
  
  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value[0]);
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const clearInputs = () => {
    if (tab === 'generate') {
      setPrompt('');
    } else {
      setCode('');
    }
    setResult('');
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast({
        title: 'Copied to clipboard',
        description: 'Result has been copied to clipboard',
      });
    }
  };

  const handleSubmit = async () => {
    if ((tab === 'generate' && !prompt) || (tab !== 'generate' && !code)) {
      toast({
        title: 'Input required',
        description: `Please enter a ${tab === 'generate' ? 'prompt' : 'code snippet'} first.`,
        variant: 'destructive',
      });
      return;
    }

    if (!selectedModel) {
      toast({
        title: 'Model selection required',
        description: 'Please select a model first.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setResult('');

    try {
      let response: string = '';

      if (tab === 'generate') {
        response = await getCodeGenerationWithAskCodi({
          prompt,
          model: selectedModel,
          temperature,
          maxTokens: 2048
        });
      } else if (tab === 'explain') {
        response = await getCodeExplanationWithAskCodi({
          code,
          language,
          model: selectedModel
        });
      } else if (tab === 'complete') {
        response = await getCodeCompletionWithAskCodi({
          code,
          language,
          model: selectedModel,
          temperature,
          maxTokens: 2048
        });
      }

      setResult(response);
      
      // Scroll to result
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error(`Error in ${tab} operation:`, error);
      toast({
        title: `${tab.charAt(0).toUpperCase() + tab.slice(1)} failed`,
        description: 'An error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card border border-purple-400/30 shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                    V.I.B.E. (Vibe Interactive Build Environment)
                  </div>
                </CardTitle>
                <CardDescription>
                  Powerful multi-model AI coding environment supporting multiple LLMs including GPT, Claude, Mistral, Gemini, and Meta models
                </CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <Select value={selectedModel} onValueChange={handleModelChange}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="generate" className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  Generate
                </TabsTrigger>
                <TabsTrigger value="explain" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Explain
                </TabsTrigger>
                <TabsTrigger value="complete" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Complete
                </TabsTrigger>
              </TabsList>

              <div className="space-y-4">
                {/* Generate Tab Content */}
                <TabsContent value="generate" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Describe the code you want to generate:</label>
                    <Textarea
                      placeholder="E.g., Create a React component that displays a responsive image gallery with lightbox functionality"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-32"
                    />
                  </div>
                </TabsContent>

                {/* Explain Tab Content */}
                <TabsContent value="explain" className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">Enter code to explain:</label>
                      <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="csharp">C#</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                          <SelectItem value="rust">Rust</SelectItem>
                          <SelectItem value="ruby">Ruby</SelectItem>
                          <SelectItem value="php">PHP</SelectItem>
                          <SelectItem value="swift">Swift</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="css">CSS</SelectItem>
                          <SelectItem value="sql">SQL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      placeholder="Paste code to explain here..."
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="min-h-32 font-mono"
                    />
                  </div>
                </TabsContent>

                {/* Complete Tab Content */}
                <TabsContent value="complete" className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">Enter code to complete:</label>
                      <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="csharp">C#</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                          <SelectItem value="rust">Rust</SelectItem>
                          <SelectItem value="ruby">Ruby</SelectItem>
                          <SelectItem value="php">PHP</SelectItem>
                          <SelectItem value="swift">Swift</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="css">CSS</SelectItem>
                          <SelectItem value="sql">SQL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      placeholder="Enter partial code to complete..."
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="min-h-32 font-mono"
                    />
                  </div>
                </TabsContent>

                {/* Temperature Control */}
                {(tab === 'generate' || tab === 'complete') && (
                  <div className="space-y-2 p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Temperature: {temperature.toFixed(1)}
                      </label>
                      <Badge variant="outline" className="text-xs font-normal">
                        {temperature < 0.4 ? 'More Precise' : temperature > 0.7 ? 'More Creative' : 'Balanced'}
                      </Badge>
                    </div>
                    <Slider
                      value={[temperature]}
                      min={0}
                      max={1}
                      step={0.1}
                      onValueChange={handleTemperatureChange}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-3">
                  <Button variant="outline" onClick={clearInputs}>
                    Clear
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading} className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {tab === 'generate' ? 'Generate Code' : tab === 'explain' ? 'Explain Code' : 'Complete Code'}
                      </>
                    )}
                  </Button>
                </div>

                {loading && (
                  <div className="flex justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-sm text-muted-foreground">AI is working on your request...</p>
                    </div>
                  </div>
                )}

                {result && (
                  <div ref={resultRef} className="mt-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                        {tab === 'generate'
                          ? 'Generated Code'
                          : tab === 'explain'
                          ? 'Code Explanation'
                          : 'Completed Code'}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={copyResult}>
                        Copy
                      </Button>
                    </div>
                    <div className="relative">
                      <pre className="p-4 rounded-lg bg-black/30 backdrop-blur-sm overflow-x-auto max-h-[500px] overflow-y-auto font-mono text-sm">
                        {result}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-purple-400/30 pt-4">
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold">Tip:</span> For best results, provide detailed prompts with specific requirements and examples.
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Powered by V.I.B.E. Technology
            </Badge>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}