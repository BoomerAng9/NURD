import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Code, 
  FileCode, 
  Sparkles, 
  Wand2,
  Cpu,
  BookOpen,
  BrainCircuit,
  Zap,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { CodeEditor } from '@/components/playground/code-editor';
import { cn } from '@/lib/utils';
import { useColorScheme } from '@/providers/color-scheme-provider';

// Import NURD and ACHIEVEMOR images
import nurdLogo from '@assets/nurd-logo-laptop.png';
import achievemorLogo from '@assets/achievemor-neon-logo.png';

// Inspirational quotes
const inspirationalQuotes = [
  "Unleash your potential through code.",
  "Build tomorrow's solutions today.",
  "Every line of code is a step toward mastery.",
  "Your imagination is the only limit.",
  "Turn your ideas into reality with AI assistance.",
  "Learn, create, innovate, repeat.",
  "Dream in logic, build with passion.",
  "Code your vision into existence.",
  "The future belongs to those who code it.",
  "Embrace the power of creative coding."
];

// Example prompts for the coding interface
const examplePrompts = [
  "Create a simple HTML page with a responsive nav bar",
  "Write a function to calculate the Fibonacci sequence in JavaScript",
  "Build a React component for a card display with hover effects",
  "Create a Python function to analyze text sentiment",
  "Design a SQL query to find the top 5 customers by order value"
];

// AI resource cards
const aiResources = [
  {
    title: "Code Playground",
    description: "Interactive coding environment with real-time execution",
    icon: <Terminal className="h-8 w-8 text-blue-500" />,
    path: "/code-playground",
    color: "from-blue-600 to-cyan-400"
  },
  {
    title: "AI Code Tools",
    description: "Generate, explain, and optimize code using AI",
    icon: <BrainCircuit className="h-8 w-8 text-purple-500" />,
    path: "/ai-code-tools",
    color: "from-purple-600 to-pink-400"
  },
  {
    title: "AskCodi IDE",
    description: "Advanced AI coding assistant powered by multiple models",
    icon: <Wand2 className="h-8 w-8 text-teal-500" />,
    path: "/askcodi-ide",
    color: "from-teal-500 to-green-400"
  },
  {
    title: "Skills Exchange",
    description: "Connect with other developers to learn and share skills",
    icon: <BookOpen className="h-8 w-8 text-orange-500" />,
    path: "/skill-marketplace",
    color: "from-orange-500 to-amber-300"
  }
];

export default function AccessAI() {
  const [code, setCode] = useState(`// Welcome to the NURD AI coding environment!
// Type your code here or start with a prompt below.
// Try simple programs like:

function greet(name) {
  return \`Hello, \${name}! Welcome to NURD's coding space.\`;
}

console.log(greet("Future Developer"));
`);
  const [randomQuote, setRandomQuote] = useState(inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]);
  const { colorScheme } = useColorScheme();
  
  const handlePromptClick = (prompt: string) => {
    // In a real implementation, we would call the AI API with this prompt
    alert(`You selected: "${prompt}"\n\nIn the full implementation, this would generate code based on your prompt using our AI service.`);
  };
  
  const cycleQuote = () => {
    const newQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
    setRandomQuote(newQuote);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/70 to-background">
      {/* Hero Section */}
      <section className="relative pt-16 pb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-600">
              Access AI
            </h1>
            
            <motion.p 
              className="mt-4 text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              onClick={cycleQuote}
            >
              Vibe Code your world, Build what you imagine
            </motion.p>
            
            <motion.p 
              className="mt-2 text-lg text-foreground/80 max-w-2xl mx-auto cursor-pointer italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              onClick={cycleQuote}
            >
              "{randomQuote}"
            </motion.p>
          </motion.div>
        </div>
      </section>
      
      {/* AI Coding Interface */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Side - Resources */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Cpu className="h-5 w-5 mr-2 text-primary" />
                  AI Resources
                </h2>
                
                <div className="space-y-3">
                  {aiResources.map((resource, index) => (
                    <motion.div
                      key={resource.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                    >
                      <Link href={resource.path}>
                        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border border-border/50 hover:border-primary/30 bg-card/80 backdrop-blur-sm">
                          <CardHeader className="py-4 px-4">
                            <CardTitle className="text-base flex items-center">
                              {resource.icon}
                              <span className="ml-2">{resource.title}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <CardDescription>
                              {resource.description}
                            </CardDescription>
                          </CardContent>
                          <CardFooter className="pt-0 pb-3 px-4">
                            <div className={`h-1 w-full rounded-full bg-gradient-to-r ${resource.color} opacity-70`}></div>
                          </CardFooter>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <Card className="border border-border/50 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="py-4 px-4">
                      <CardTitle className="text-base flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                        Confidence Boosters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <Lightbulb className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                          <span>Mistakes are stepping stones to mastery</span>
                        </li>
                        <li className="flex items-start">
                          <Rocket className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                          <span>Your creativity is your superpower</span>
                        </li>
                        <li className="flex items-start">
                          <Sparkles className="h-4 w-4 mr-2 text-purple-500 mt-0.5" />
                          <span>Every expert was once a beginner</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
            
            {/* Middle - Code Editor */}
            <motion.div 
              className="lg:col-span-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="rounded-lg overflow-hidden border border-border/50 shadow-lg bg-card/90 backdrop-blur-sm">
                <div className="bg-muted/80 p-3 border-b border-border/30 flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">NURD Coding Environment</h3>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">Save</Button>
                    <Button variant="ghost" size="sm">Run</Button>
                    <Button variant="outline" size="sm">
                      <Sparkles className="h-4 w-4 mr-1" />
                      AI Assist
                    </Button>
                  </div>
                </div>
                
                <div className="h-[400px] border-b border-border/30">
                  <CodeEditor 
                    code={code} 
                    setCode={setCode} 
                    language="javascript"
                  />
                </div>
                
                <div className="p-3 bg-muted/30">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Wand2 className="h-4 w-4 mr-1 text-primary" />
                    Try these example prompts:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((prompt, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm" 
                        className="text-xs bg-background/50 border-primary/20 hover:bg-primary/10"
                        onClick={() => handlePromptClick(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Powered by multiple AI models including GPT-3.5, Claude, Mistral, Gemini, and Meta LLMs
              </div>
            </motion.div>
            
            {/* Right Side - Branding */}
            <motion.div 
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="space-y-6">
                <div className={cn(
                  "rounded-lg border border-border/50 p-6 text-center bg-card/70 backdrop-blur-sm", 
                  colorScheme === 'NURD Blue' ? "bg-gradient-to-br from-blue-500/10 to-cyan-500/5" : 
                  colorScheme === 'Ocean Waves' ? "bg-gradient-to-br from-teal-500/10 to-blue-500/5" :
                  colorScheme === 'Forest Canopy' ? "bg-gradient-to-br from-green-500/10 to-emerald-500/5" :
                  colorScheme === 'Sunset Glow' ? "bg-gradient-to-br from-orange-500/10 to-red-500/5" :
                  "bg-gradient-to-br from-purple-500/10 to-indigo-500/5"
                )}>
                  <img 
                    src={nurdLogo} 
                    alt="NURD Logo" 
                    className="h-24 mx-auto mb-3"
                  />
                  <h3 className="text-lg font-semibold">NURD Initiative</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Naturally Unstoppable Resourceful Dreamers
                  </p>
                  <div className="mt-4">
                    <Button variant="default" size="sm" className="w-full">
                      Learn More
                    </Button>
                  </div>
                </div>
                
                <div className={cn(
                  "rounded-lg border border-border/50 p-6 text-center bg-card/70 backdrop-blur-sm",
                  colorScheme === 'NURD Blue' ? "bg-gradient-to-br from-blue-500/10 to-purple-500/5" : 
                  colorScheme === 'Ocean Waves' ? "bg-gradient-to-br from-blue-500/10 to-teal-500/5" :
                  colorScheme === 'Forest Canopy' ? "bg-gradient-to-br from-emerald-500/10 to-green-500/5" :
                  colorScheme === 'Sunset Glow' ? "bg-gradient-to-br from-red-500/10 to-amber-500/5" :
                  "bg-gradient-to-br from-indigo-500/10 to-purple-500/5"
                )}>
                  <img 
                    src={achievemorLogo} 
                    alt="ACHIEVEMOR Logo" 
                    className="h-24 mx-auto mb-3"
                  />
                  <h3 className="text-lg font-semibold">ACHIEVEMOR</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Empowering the next generation of creators
                  </p>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      Join ACHIEVERS
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}