import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Code, Info, ChevronDown, ListChecks } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getGroqModels } from '@/services/groq-service';

// Sample prompts for testing different model capabilities
const samplePrompts = [
  {
    category: 'Code Generation',
    prompts: [
      "Create a React component that displays a responsive image gallery with lazy loading",
      "Write a Python function to analyze sentiment in a text using NLTK",
      "Create a TypeScript utility function that deep merges two objects",
      "Write a SQL query to find the top 5 customers who spent the most in each month",
      "Implement a binary search tree in JavaScript with insert, delete and search methods"
    ]
  },
  {
    category: 'Explanation',
    prompts: [
      "Explain the differences between artificial intelligence, machine learning, and deep learning",
      "How does OAuth 2.0 authorization work? Explain the flow and components",
      "Explain the concept of neural networks to a 10-year-old",
      "What are the key differences between REST and GraphQL APIs?",
      "Explain how database indexing works and when to use different types of indexes"
    ]
  },
  {
    category: 'Problem Solving',
    prompts: [
      "How can I optimize a React application that's rendering slowly?",
      "What's the best approach to implementing a real-time chat feature in a web app?",
      "How would you design a scalable event scheduling system?",
      "What are some strategies for implementing effective error handling in an API?",
      "How can I implement a secure authentication system for my application?"
    ]
  }
];

export default function ModelTest() {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Ready to test models');

  useEffect(() => {
    async function loadModels() {
      try {
        setStatus('Loading GROQ models...');
        const groqModels = await getGroqModels();
        
        // Create a comprehensive list with all model types
        const allModels = [
          // OpenAI models
          'gpt-4-1106-preview',
          'gpt-3.5-turbo',
          
          // GROQ models with prefix
          ...groqModels.map(model => `groq:${model}`),
          
          // Example models from other providers
          'meta:llama-3.1-8b',
          'meta:llama-3.1-70b',
          'mistral:mistral-7b',
          'mistral:mistral-saba-24b'
        ];
        
        setModels(allModels);
        setSelectedModel(allModels[0]);
        setStatus(`Loaded ${allModels.length} models successfully`);
      } catch (error) {
        console.error('Error loading models:', error);
        setStatus('Error loading models, using fallback list');
        
        // Fallback models
        const fallbackModels = [
          'gpt-4-1106-preview',
          'gpt-3.5-turbo',
          'groq:llama3-70b-8192',
          'groq:mixtral-8x7b-32768'
        ];
        
        setModels(fallbackModels);
        setSelectedModel(fallbackModels[0]);
      }
    }
    
    loadModels();
  }, []);

  const handleSubmit = async () => {
    if (!prompt) {
      toast({
        title: 'Prompt required',
        description: 'Please enter a prompt first',
        variant: 'destructive'
      });
      return;
    }
    
    if (!selectedModel) {
      toast({
        title: 'Model required',
        description: 'Please select a model first',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    setResponse('');
    
    try {
      setStatus(`Testing with model: ${selectedModel}`);
      
      // Determine which API to call based on model prefix
      const isGroqModel = selectedModel.startsWith('groq:');
      const isMistralModel = selectedModel.startsWith('mistral:');
      const isMetaModel = selectedModel.startsWith('meta:');
      const isGoogleModel = selectedModel.startsWith('google:');
      const isHuggingFaceModel = selectedModel.startsWith('hf:');
      
      // Extract the actual model name without prefix
      const actualModel = isGroqModel || isMistralModel || isMetaModel || isGoogleModel || isHuggingFaceModel
        ? selectedModel.substring(selectedModel.indexOf(':') + 1) 
        : selectedModel;
      
      // Determine the API endpoint based on model type
      let endpoint = '/api/ai/code-suggestion'; // Default to OpenAI
      let apiType = 'openai';
      
      if (isGroqModel) {
        endpoint = '/api/groq/generate';
        apiType = 'groq';
      } else if (isMistralModel) {
        // Currently routing through GROQ for Mistral models
        endpoint = '/api/groq/generate';
        apiType = 'groq';
      } else if (isMetaModel) {
        // Currently routing through GROQ for Meta models
        endpoint = '/api/groq/generate';
        apiType = 'groq';
      }
      
      console.log(`Using API endpoint: ${endpoint} for model: ${actualModel} (${apiType})`);
      
      // Different parameters for different APIs
      let requestBody = {};
      if (apiType === 'openai') {
        requestBody = {
          prompt,
          model: actualModel,
          temperature: 0.7,
          maxTokens: 1500
        };
      } else if (apiType === 'groq') {
        requestBody = {
          prompt,
          model: actualModel,
          temperature: 0.7,
          maxTokens: 1500
        };
      }
      
      // Make API request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText}. ${errorText || ''}`);
      }
      
      const data = await response.json();
      setResponse(data.result || 'No result returned');
      
      // Track success details
      const responseTime = performance.now() - performance.timeOrigin;
      setStatus(`Success with ${selectedModel} (${Math.round(responseTime)}ms)`);
      
      // Log success for analytics
      console.log(`Model test successful for ${selectedModel}`, {
        apiType,
        responseTime,
        hasResult: !!data.result,
        resultLength: data.result ? data.result.length : 0
      });
    } catch (error) {
      console.error('Error in model test:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatus(`Failed with ${selectedModel}`);
      
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Detailed error:', {
          message: error.message,
          stack: error.stack,
          model: selectedModel,
          promptLength: prompt.length
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">AI Model Test Console</CardTitle>
          <CardDescription>
            Test access to various AI models through different API services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {/* OpenAI Models */}
                <SelectItem value="_openai_header" disabled className="text-xs font-bold uppercase text-gray-500">
                  OpenAI Models
                </SelectItem>
                <SelectItem value="gpt-4-1106-preview">
                  GPT-4 Nano (Advanced)
                </SelectItem>
                <SelectItem value="gpt-3.5-turbo">
                  GPT-3.5 Turbo (Fast)
                </SelectItem>
                
                {/* GROQ Models */}
                <SelectItem value="_groq_header" disabled className="text-xs font-bold uppercase text-gray-500 mt-2">
                  GROQ Models (Llama, Mistral)
                </SelectItem>
                {models
                  .filter(model => model.startsWith('groq:'))
                  .map((model) => (
                    <SelectItem key={model} value={model}>
                      {model.includes('llama3-70b') ? '⭐ GROQ: Llama 3 70B' :
                       model.includes('llama3-8b') ? 'GROQ: Llama 3 8B' :
                       model.includes('llama3.1-70b') ? '⭐ GROQ: Llama 3.1 70B' :
                       model.includes('llama3.1-8b') ? 'GROQ: Llama 3.1 8B' :
                       model.includes('mixtral-8x7b') ? 'GROQ: Mixtral 8x7B' :
                       model.includes('mixtral-8x22b') ? '⭐ GROQ: Mixtral 8x22B' :
                       model.includes('mistral-7b') ? 'GROQ: Mistral 7B' :
                       model.includes('gemma-7b') ? 'GROQ: Gemma 7B' :
                       model.includes('stable-code') ? 'GROQ: Stable Code 3B' :
                       `GROQ: ${model.substring(5)}`}
                    </SelectItem>
                  ))
                }
                
                {/* Meta Models */}
                <SelectItem value="_meta_header" disabled className="text-xs font-bold uppercase text-gray-500 mt-2">
                  Meta AI Models
                </SelectItem>
                {models
                  .filter(model => model.startsWith('meta:'))
                  .map((model) => (
                    <SelectItem key={model} value={model}>
                      {model.includes('llama-3.1-70b') ? '⭐ Meta: Llama 3.1 70B' :
                       model.includes('llama-3.1-8b') ? 'Meta: Llama 3.1 8B' :
                       model.includes('llama-3-70b') ? '⭐ Meta: Llama 3 70B' :
                       model.includes('llama-3-8b') ? 'Meta: Llama 3 8B' :
                       model.includes('llama-4-maverick') ? '⭐ Meta: Llama 4 Maverick' :
                       model.includes('llama-4-scout') ? 'Meta: Llama 4 Scout' :
                       `Meta: ${model.substring(5)}`}
                    </SelectItem>
                  ))
                }
                
                {/* Mistral Models */}
                <SelectItem value="_mistral_header" disabled className="text-xs font-bold uppercase text-gray-500 mt-2">
                  Mistral AI Models
                </SelectItem>
                {models
                  .filter(model => model.startsWith('mistral:'))
                  .map((model) => (
                    <SelectItem key={model} value={model}>
                      {model.includes('mistral-saba-24b') ? '⭐ Mistral: Saba 24B' :
                       model.includes('mixtral-8x7b') ? 'Mistral: Mixtral 8x7B' :
                       model.includes('mistral-7b') ? 'Mistral: Mistral 7B' :
                       `Mistral: ${model.substring(8)}`}
                    </SelectItem>
                  ))
                }
                
                {/* Other Models */}
                <SelectItem value="_other_header" disabled className="text-xs font-bold uppercase text-gray-500 mt-2">
                  Other Models
                </SelectItem>
                {models
                  .filter(model => !model.startsWith('groq:') && 
                                  !model.startsWith('meta:') && 
                                  !model.startsWith('mistral:') &&
                                  model !== 'gpt-4-1106-preview' &&
                                  model !== 'gpt-3.5-turbo')
                  .map((model) => (
                    <SelectItem key={model} value={model}>
                      {model.startsWith('sdaia:') ? `SDAIA: ${model.substring(6)}` :
                       model.startsWith('hf:') ? `Hugging Face: ${model.substring(3)}` :
                       model.startsWith('google:') ? `Google: ${model.substring(7)}` :
                       model}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Test Prompt</label>
              <div className="relative group">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center text-xs h-7 px-2 text-gray-500"
                  onClick={() => document.getElementById('sample-prompts')?.classList.toggle('hidden')}
                >
                  <ListChecks className="h-3.5 w-3.5 mr-1" />
                  Sample Prompts
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
                
                <div 
                  id="sample-prompts" 
                  className="hidden absolute right-0 top-full mt-1 z-50 w-96 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs font-medium">
                    Click any prompt to use it
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {samplePrompts.map((category, idx) => (
                      <div key={idx} className="p-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <h4 className="text-xs font-bold mb-2 text-primary">{category.category}</h4>
                        <ul className="space-y-1">
                          {category.prompts.map((item, promptIdx) => (
                            <li 
                              key={promptIdx} 
                              className="text-xs p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                              onClick={() => {
                                setPrompt(item);
                                document.getElementById('sample-prompts')?.classList.add('hidden');
                              }}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <Textarea
              placeholder="Enter a prompt to test the model, e.g., 'Write a function to calculate Fibonacci numbers in JavaScript'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
            
            <div className="flex flex-wrap gap-1 mt-1">
              {['Code Generation', 'Explanation', 'Math', 'Reasoning'].map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs">
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2 text-blue-500" />
              <div className="font-semibold">Status:</div>
            </div>
            <div className="mt-1 pl-6">{status}</div>
          </div>
          
          {response && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Response</label>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm">{response}</pre>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setPrompt('')}>
            Clear
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Model'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}