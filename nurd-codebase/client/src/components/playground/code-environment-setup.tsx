import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  ChevronsRight, 
  PanelLeft, 
  Terminal, 
  FolderGit, 
  Database, 
  Server, 
  Boxes, 
  PackageOpen, 
  Layers, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface Environment {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  packages: string[];
  dependencies: string[];
  configuration: string;
  setupTime: string;
}

// Predefined environments
const environments: Environment[] = [
  {
    id: 'web-dev',
    name: 'Web Development',
    icon: <Layers className="h-8 w-8 text-sky-500" />,
    description: 'HTML, CSS, JavaScript with Node.js and popular frontend frameworks',
    packages: ['node', 'npm', 'vite', 'react', 'tailwindcss'],
    dependencies: ['git', 'curl', 'wget'],
    configuration: `{
  "name": "web-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}`,
    setupTime: '2-3 minutes'
  },
  {
    id: 'data-science',
    name: 'Data Science',
    icon: <Database className="h-8 w-8 text-purple-500" />,
    description: 'Python with key data science libraries for analysis and visualization',
    packages: ['python3', 'pip', 'numpy', 'pandas', 'matplotlib', 'scikit-learn', 'jupyter'],
    dependencies: ['git', 'curl', 'wget'],
    configuration: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split

# Data Science Environment Ready
print("Data Science Environment Setup Complete!")`,
    setupTime: '3-4 minutes'
  },
  {
    id: 'game-dev',
    name: 'Game Development',
    icon: <Boxes className="h-8 w-8 text-green-500" />,
    description: 'Unity or Godot engine with C# support',
    packages: ['dotnet-sdk', 'mono-complete', 'godot', 'git-lfs'],
    dependencies: ['git', 'curl', 'wget'],
    configuration: `using System;
using System.Collections.Generic;

namespace GameProject
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Game Development Environment Ready!");
        }
    }
}`,
    setupTime: '4-5 minutes'
  },
  {
    id: 'backend-dev',
    name: 'Backend Development',
    icon: <Server className="h-8 w-8 text-orange-500" />,
    description: 'Node.js or Python with database integrations and API tools',
    packages: ['node', 'npm', 'express', 'mongodb', 'postgresql', 'redis'],
    dependencies: ['git', 'curl', 'wget'],
    configuration: `const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Backend Development Environment Ready!');
});

app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
});`,
    setupTime: '2-3 minutes'
  },
  {
    id: 'mobile-dev',
    name: 'Mobile Development',
    icon: <PackageOpen className="h-8 w-8 text-blue-500" />,
    description: 'React Native for cross-platform mobile app development',
    packages: ['node', 'npm', 'react-native', 'expo-cli'],
    dependencies: ['git', 'curl', 'wget', 'android-tools-adb'],
    configuration: `import React from 'react';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Mobile Development Environment Ready!</Text>
    </View>
  );
}`,
    setupTime: '3-4 minutes'
  }
];

export function CodeEnvironmentSetup() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('environments');
  
  const handleSelectEnvironment = (env: Environment) => {
    setSelectedEnvironment(env);
    setActiveTab('details');
  };
  
  const handleStartInstallation = () => {
    if (!selectedEnvironment) return;
    
    setIsInstalling(true);
    setInstallProgress(0);
    setCurrentStage('Preparing installation');
    setIsComplete(false);
    
    // Simulate installation process
    const stages = [
      'Preparing installation',
      'Setting up base environment',
      'Installing dependencies',
      'Installing packages',
      'Configuring environment',
      'Running final checks'
    ];
    
    let currentStageIndex = 0;
    
    const interval = setInterval(() => {
      if (currentStageIndex < stages.length) {
        setCurrentStage(stages[currentStageIndex]);
        currentStageIndex++;
      }
      
      setInstallProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setInstallProgress(100);
          setTimeout(() => {
            setIsComplete(true);
            toast({
              title: "Installation Complete",
              description: `${selectedEnvironment.name} environment has been set up successfully!`,
              variant: "default",
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 800);
  };
  
  const handleClose = () => {
    setIsOpen(false);
    // Reset states after dialog is closed
    setTimeout(() => {
      setIsInstalling(false);
      setInstallProgress(0);
      setIsComplete(false);
      setSelectedEnvironment(null);
      setActiveTab('environments');
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Code className="h-4 w-4" />
          Setup Code Environment
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>One-Click Code Environment Setup</DialogTitle>
          <DialogDescription>
            Choose a pre-configured environment or customize your own to get started quickly.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="environments" disabled={isInstalling}>
              <PanelLeft className="h-4 w-4 mr-2" />
              Choose Environment
            </TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedEnvironment || isInstalling}>
              <Terminal className="h-4 w-4 mr-2" />
              Environment Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="environments" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {environments.map((env) => (
                <div 
                  key={env.id}
                  className={`cursor-pointer border rounded-lg p-4 hover:border-primary/70 hover:bg-primary/5 transition-colors ${
                    selectedEnvironment?.id === env.id ? 'border-primary bg-primary/10' : ''
                  }`}
                  onClick={() => handleSelectEnvironment(env)}
                >
                  <div className="flex items-center gap-3">
                    {env.icon}
                    <div>
                      <h3 className="font-medium">{env.name}</h3>
                      <p className="text-sm text-muted-foreground">{env.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Select an environment to see details and begin setup
              </p>
              
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => setActiveTab('details')}
                  disabled={!selectedEnvironment}
                >
                  <ChevronsRight className="h-4 w-4 mr-2" />
                  Continue
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="py-4">
            {selectedEnvironment && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {selectedEnvironment.icon}
                  <div>
                    <h3 className="text-lg font-medium">{selectedEnvironment.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Estimated setup time: {selectedEnvironment.setupTime}
                    </p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                {isInstalling ? (
                  <div>
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>{currentStage}</span>
                        <span>{Math.round(installProgress)}%</span>
                      </div>
                      <Progress value={installProgress} className="h-2" />
                    </div>
                    
                    {isComplete ? (
                      <motion.div 
                        className="text-center py-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Installation Complete!</h3>
                        <p className="text-muted-foreground mb-6">
                          Your {selectedEnvironment.name} environment is now ready to use.
                        </p>
                        
                        <Button size="lg" onClick={handleClose}>
                          Get Started
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="text-muted-foreground text-sm space-y-2 mb-6">
                        <p className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Setting up your coding environment...
                        </p>
                        <p>This may take a few minutes. Please don't close this window.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="font-medium mb-2">Included Packages</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedEnvironment.packages.map((pkg, index) => (
                            <div 
                              key={index} 
                              className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-md"
                            >
                              {pkg}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">System Dependencies</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedEnvironment.dependencies.map((dep, index) => (
                            <div 
                              key={index} 
                              className="px-2 py-1 bg-muted text-muted-foreground text-sm rounded-md"
                            >
                              {dep}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Configuration Preview</h4>
                        <pre className="p-3 bg-slate-950 text-slate-50 rounded-md overflow-x-auto text-sm">
                          {selectedEnvironment.configuration}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab('environments')}>
                        Back
                      </Button>
                      <Button onClick={handleStartInstallation}>
                        <FolderGit className="h-4 w-4 mr-2" />
                        Install Environment
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}