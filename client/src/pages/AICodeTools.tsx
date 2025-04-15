import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AICodeGenerator from '@/components/code-generator/ai-code-generator';
import CodeSuggestionEditor from '@/components/code-generator/code-suggestion-editor';
import { ChevronLeft, Code, BrainCircuit, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

const AICodeTools: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500">
                AI-Powered Code Tools
              </h1>
              <p className="text-gray-400 max-w-2xl">
                Boost your coding productivity with AI-assisted code generation and smart suggestions. 
                Perfect for learning, prototyping, or solving coding challenges.
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900 bg-opacity-50">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-900 bg-opacity-50">
                <BrainCircuit className="h-5 w-5 text-pink-400" />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 bg-opacity-50">
                <Code className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-8 bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="generator" className="rounded-md data-[state=active]:bg-purple-800">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>Code Generator</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="editor" className="rounded-md data-[state=active]:bg-pink-800">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" />
                <span>Smart Editor</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-700">
              <AICodeGenerator />
            </div>
            
            <div className="mt-8 bg-gray-800 bg-opacity-20 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">How to Use the Code Generator</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="inline-block h-5 w-5 rounded-full bg-purple-900 text-purple-300 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                  <span>Select the programming language you want to generate code for</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block h-5 w-5 rounded-full bg-purple-900 text-purple-300 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                  <span>Describe what you want to create in plain English (e.g., "Create a function that calculates the fibonacci sequence")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block h-5 w-5 rounded-full bg-purple-900 text-purple-300 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                  <span>Optionally, add context code if you're enhancing an existing project</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block h-5 w-5 rounded-full bg-purple-900 text-purple-300 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                  <span>Click "Generate Code" and watch AI create a solution for you</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block h-5 w-5 rounded-full bg-purple-900 text-purple-300 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">5</span>
                  <span>Copy the result or try running JavaScript code directly in the browser</span>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="editor" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-700">
              <CodeSuggestionEditor />
            </div>
            
            <div className="mt-8 bg-gray-800 bg-opacity-20 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-pink-300">Smart Editor Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="inline-block h-5 w-5 rounded-full bg-pink-900 text-pink-300 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                  <span>Start typing code in your selected programming language</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block h-5 w-5 rounded-full bg-pink-900 text-pink-300 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                  <span>Pause briefly after typing to see AI suggestions appear</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block h-5 w-5 rounded-full bg-pink-900 text-pink-300 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                  <span>Click "Apply Suggestion" to insert the AI-generated code at your cursor position</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block h-5 w-5 rounded-full bg-pink-900 text-pink-300 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                  <span>Continue typing to refine your code with AI assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block h-5 w-5 rounded-full bg-pink-900 text-pink-300 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">5</span>
                  <span>Copy the finished code when you're done</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AICodeTools;