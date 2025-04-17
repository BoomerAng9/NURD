import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Link } from 'wouter';
import { Code, Wand2, Sparkles, BookOpen, Lightbulb, Github, Wrench, Flame } from 'lucide-react';

export default function AccessAI() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [code, setCode] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [tab, setTab] = useState('playground');

  const models = [
    { id: 'gpt-4o-mini', name: 'GPT-4o mini' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku' },
    { id: 'mistral-large', name: 'Mistral Large' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'meta-llama-3', name: 'Llama 3' }
  ];

  const examplePrompts = [
    {
      title: "Create a React Component",
      prompt: "Create a React component for a dashboard card that displays user statistics with a progress bar.",
      icon: <Code className="h-4 w-4" />
    },
    {
      title: "Generate a Database Schema",
      prompt: "Design a database schema for a social media app with users, posts, comments, and likes.",
      icon: <Github className="h-4 w-4" />
    },
    {
      title: "Build an Animation",
      prompt: "Write a CSS animation that makes an element fade in and slide up when it appears on screen.",
      icon: <Flame className="h-4 w-4" />
    },
    {
      title: "Create an API Route",
      prompt: "Write an Express.js API route that handles user authentication with JWT tokens.",
      icon: <Wrench className="h-4 w-4" />
    }
  ];

  // Resource links that were previously in the Resources tab
  const resourceLinks = [
    { name: "Summer Initiative", path: "/summer-initiative", icon: <Flame className="h-4 w-4" /> },
    { name: "Weekend Workshops", path: "/weekend-workshops", icon: <Wrench className="h-4 w-4" /> },
    { name: "School Programs", path: "/school-programs", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Online Learning", path: "/online-learning", icon: <Lightbulb className="h-4 w-4" /> },
    { name: "Parent Guide", path: "/parent-guide", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Student Resources", path: "/student-resources", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Scholarships", path: "/scholarships", icon: <Sparkles className="h-4 w-4" /> },
    { name: "FAQ", path: "/faq", icon: <Lightbulb className="h-4 w-4" /> }
  ];

  const affirmations = [
    "Transform ideas into reality with code.",
    "You have the power to build your digital dreams.",
    "Every line of code is a step toward your vision.",
    "Technology is your canvas, code is your brush.",
    "From imagination to implementation in minutes."
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const randomAffirmation = () => {
    return affirmations[Math.floor(Math.random() * affirmations.length)];
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-3">
            Vibe Code Your World, Build What You Imagine
          </h1>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Welcome to the Access AI Playground
          </motion.p>
          <motion.div 
            className="mt-4 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Badge className="px-4 py-2 text-sm bg-primary/10 border border-primary/30">
              {randomAffirmation()}
            </Badge>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants}>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="playground" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Playground
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Resources
              </TabsTrigger>
            </TabsList>

            {/* AI Playground Tab */}
            <TabsContent value="playground" className="space-y-6">
              <Card className="glass-card border border-purple-400/30 shadow-xl">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                        <div className="flex items-center gap-2">
                          <Wand2 className="h-6 w-6 text-purple-500" />
                          AI Coding Environment
                        </div>
                      </CardTitle>
                      <CardDescription className="max-w-md">
                        Use the power of AI to generate code, complete projects, and expand your capabilities.
                      </CardDescription>
                    </div>
                    <div>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {models.map(model => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      What would you like to build today?
                    </label>
                    <Textarea
                      placeholder="Describe what you want to create, or select one of the example prompts below..."
                      className="min-h-32"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Code className="h-4 w-4" />
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
                      onValueChange={(value) => setTemperature(value[0])}
                      className="w-full"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Code
                    </Button>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-md font-medium mb-3">Example Prompts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {examplePrompts.map((example, index) => (
                        <motion.div 
                          key={index}
                          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-auto py-3 px-4 border-primary/20"
                            onClick={() => setCode(example.prompt)}
                          >
                            <div className="mr-2">{example.icon}</div>
                            <div className="text-left">
                              <div className="font-medium">{example.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                                {example.prompt}
                              </div>
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-purple-400/30 pt-4">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold">Pro tip:</span> Be specific about the language, features, and style of code you want to generate.
                  </div>
                  <div className="flex space-x-2">
                    <Link href="/code-playground">
                      <Button variant="outline" size="sm">
                        Code Playground
                      </Button>
                    </Link>
                    <Link href="/askcodi-ide">
                      <Button size="sm">
                        Advanced IDE
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <Card className="glass-card border border-blue-400/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-6 w-6 text-blue-500" />
                      NURD Resources
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Explore our comprehensive collection of learning resources, programs, and opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resourceLinks.map((resource, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link href={resource.path}>
                          <a className="block">
                            <Card className="glass-card h-full hover:shadow-md transition-shadow duration-300 border-primary/20 cursor-pointer">
                              <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                  <div className="rounded-full bg-primary/10 p-3">
                                    {resource.icon}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{resource.name}</h3>
                                    <p className="text-xs text-muted-foreground">
                                      Click to explore
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </a>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}