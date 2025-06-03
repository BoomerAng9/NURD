import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Code, Sparkles, FileText, Braces, Search } from 'lucide-react';
import { Link } from 'wouter';

const CodeTools: React.FC = () => {
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
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500">
                Code Tools
              </h1>
              <p className="text-gray-400 max-w-2xl">
                A collection of tools to help you write better code, learn programming concepts, and improve your development skills.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Code Playground Card */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-lg hover:shadow-cyan-900/20 transition-all">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-900 bg-opacity-50">
                  <Code className="h-4 w-4 text-cyan-400" />
                </div>
                <CardTitle className="text-white">Code Playground</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Write, run, and test code directly in your browser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Our interactive code playground lets you experiment with various programming languages without any setup. Perfect for testing ideas or practicing coding challenges.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-cyan-300">JavaScript</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-cyan-300">HTML/CSS</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-cyan-300">Python</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-cyan-300">Java</span>
              </div>
              <Button className="w-full bg-cyan-700 hover:bg-cyan-600 text-white" asChild>
                <Link href="/code-playground">Open Playground</Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* AI Code Generator Card */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-lg hover:shadow-purple-900/20 transition-all">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-900 bg-opacity-50">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </div>
                <CardTitle className="text-white">AI Code Tools</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Generate, explain, and optimize code with AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Use the power of GPT-3.5 to generate code snippets, explain complex functions, or optimize your existing code. Perfect for learning and improving your code quality.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-purple-300">Code Generation</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-purple-300">Explanations</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-purple-300">Optimization</span>
              </div>
              <Button className="w-full bg-purple-700 hover:bg-purple-600 text-white" asChild>
                <Link href="/ai-code-tools">Open AI Tools</Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Syntax Reference Card */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-lg hover:shadow-green-900/20 transition-all">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-900 bg-opacity-50">
                  <FileText className="h-4 w-4 text-green-400" />
                </div>
                <CardTitle className="text-white">Syntax Reference</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Quick reference guides for popular languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Access cheat sheets and reference guides for common programming languages. Perfect for when you need to quickly look up syntax or common patterns.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-green-300">JavaScript</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-green-300">Python</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-green-300">SQL</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-green-300">HTML/CSS</span>
              </div>
              <Button className="w-full bg-green-700 hover:bg-green-600 text-white" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
          
          {/* Algorithm Visualizer Card */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-lg hover:shadow-orange-900/20 transition-all">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-900 bg-opacity-50">
                  <Braces className="h-4 w-4 text-orange-400" />
                </div>
                <CardTitle className="text-white">Algorithm Visualizer</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Watch algorithms in action with visual demonstrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                See how sorting, searching, and other common algorithms work through interactive visualizations. Perfect for understanding complex computer science concepts.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-orange-300">Sorting</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-orange-300">Searching</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-orange-300">Graph Algorithms</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-orange-300">Data Structures</span>
              </div>
              <Button className="w-full bg-orange-700 hover:bg-orange-600 text-white" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
          
          {/* Practice Problems Card */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-lg hover:shadow-blue-900/20 transition-all">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 bg-opacity-50">
                  <Code className="h-4 w-4 text-blue-400" />
                </div>
                <CardTitle className="text-white">Practice Problems</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Build your skills with coding challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Improve your coding skills with a collection of problems ranging from beginner to advanced. Perfect for preparing for coding interviews or learning new concepts.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-blue-300">Beginner</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-blue-300">Intermediate</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-blue-300">Advanced</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-blue-300">Interview Prep</span>
              </div>
              <Button className="w-full bg-blue-700 hover:bg-blue-600 text-white" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
          
          {/* Code Search Card */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-lg hover:shadow-pink-900/20 transition-all">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-900 bg-opacity-50">
                  <Search className="h-4 w-4 text-pink-400" />
                </div>
                <CardTitle className="text-white">Code Search</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Find and reuse code snippets from various sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Search through a vast collection of code snippets, examples, and solutions. Perfect for finding reusable components or learning how others solved similar problems.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-pink-300">Functions</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-pink-300">Components</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-pink-300">Algorithms</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-pink-300">Examples</span>
              </div>
              <Button className="w-full bg-pink-700 hover:bg-pink-600 text-white" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 p-6 rounded-lg bg-gray-800 bg-opacity-50">
          <h2 className="text-xl font-semibold mb-4">Get the Most Out of Our Code Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2 text-cyan-400">For Beginners</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Start with the Code Playground to experiment</li>
                <li>Use AI tools to help understand code concepts</li>
                <li>Reference the syntax guides when stuck</li>
                <li>Try simple practice problems to build confidence</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-purple-400">For Intermediate Coders</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Optimize your code with AI suggestions</li>
                <li>Visualize algorithms to deepen understanding</li>
                <li>Challenge yourself with harder practice problems</li>
                <li>Find and modify code snippets to suit your needs</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-green-400">For Advanced Users</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Use AI to quickly prototype complex functions</li>
                <li>Contribute your own solutions to the community</li>
                <li>Prepare for coding interviews with advanced challenges</li>
                <li>Experiment with multiple languages and paradigms</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeTools;