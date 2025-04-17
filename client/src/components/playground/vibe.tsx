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
import { 
  Loader2, Sparkles, Code, Edit, Settings, Wand2, 
  HelpCircle, Star, Book, LightbulbIcon, Award, Rocket,
  Info, MessageCircle, Send
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getCodeGenerationWithAskCodi, getCodeExplanationWithAskCodi, getCodeCompletionWithAskCodi, getAvailableModels } from '@/services/askcodi-service';

// Helper tooltip component for friendly contextual guidance
const HelpTooltip = ({ message, children }: { message: string, children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div 
        className="inline-flex items-center cursor-help"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(!visible)}
      >
        {children}
      </div>
      
      {visible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-black/90 backdrop-blur-sm text-white text-xs rounded-md shadow-lg z-50">
          <div className="relative">
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black/90 rotate-45"></div>
            <p>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

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
  
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userAchievements, setUserAchievements] = useState<string[]>([]);
  
  // AI assistant messages
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<{message: string, type: 'tip' | 'encouragement' | 'help'}[]>([
    { message: "Welcome to V.I.B.E.! I'm your coding buddy. Need any help?", type: 'encouragement' },
  ]);

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

  // Check if user has completed an action to earn an achievement
  const checkForAchievements = (action: string) => {
    const newAchievements = [...userAchievements];
    
    switch(action) {
      case 'generate':
        if (!userAchievements.includes('first_generation')) {
          newAchievements.push('first_generation');
          toast({
            title: '🏆 Achievement Unlocked!',
            description: 'You created your first code generation!',
          });
        }
        break;
      case 'explain':
        if (!userAchievements.includes('first_explanation')) {
          newAchievements.push('first_explanation');
          toast({
            title: '🏆 Achievement Unlocked!',
            description: 'You got your first code explanation!',
          });
        }
        break;
      case 'complete':
        if (!userAchievements.includes('first_completion')) {
          newAchievements.push('first_completion');
          toast({
            title: '🏆 Achievement Unlocked!',
            description: 'You completed your first code snippet!',
          });
        }
        break;
    }
    
    setUserAchievements(newAchievements);
  };

  // Onboarding steps
  const onboardingSteps = [
    {
      title: "Welcome to V.I.B.E.",
      description: "This is your AI coding buddy! I'll help you learn coding in a fun, easy way. Let me show you around.",
      icon: <Rocket className="h-8 w-8 text-purple-500" />
    },
    {
      title: "Generate Code",
      description: "Tell me what you want to build in simple words. No need for technical language - just describe what you want!",
      icon: <Wand2 className="h-8 w-8 text-blue-500" />
    },
    {
      title: "Explain Code",
      description: "Found code online that's confusing? Paste it here and I'll explain what it does in simple terms.",
      icon: <Book className="h-8 w-8 text-orange-500" />
    },
    {
      title: "Complete Code",
      description: "Start typing some code and I'll help finish it! Great when you have an idea but aren't sure how to code it.",
      icon: <Code className="h-8 w-8 text-green-500" />
    },
    {
      title: "You're Ready!",
      description: "Let's start coding together! Remember, there are no wrong questions - I'm here to help you learn.",
      icon: <Star className="h-8 w-8 text-yellow-500" />
    }
  ];

  // Handle advancing the onboarding
  const advanceOnboarding = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      // Save to localStorage that user has seen onboarding
      localStorage.setItem('vibeOnboardingComplete', 'true');
    }
  };

  // Skip onboarding completely
  const skipOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('vibeOnboardingComplete', 'true');
  };

  // Check if user has completed onboarding before
  useEffect(() => {
    const onboardingComplete = localStorage.getItem('vibeOnboardingComplete');
    if (onboardingComplete === 'true') {
      setShowOnboarding(false);
    }
  }, []);

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
        checkForAchievements('generate');
      } else if (tab === 'explain') {
        response = await getCodeExplanationWithAskCodi({
          code,
          language,
          model: selectedModel
        });
        checkForAchievements('explain');
      } else if (tab === 'complete') {
        response = await getCodeCompletionWithAskCodi({
          code,
          language,
          model: selectedModel,
          temperature,
          maxTokens: 2048
        });
        checkForAchievements('complete');
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
      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              {onboardingSteps[onboardingStep].icon}
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                {onboardingSteps[onboardingStep].title}
              </h3>
              <p className="text-gray-300 text-sm">
                {onboardingSteps[onboardingStep].description}
              </p>
              
              {/* Progress Indicator */}
              <div className="flex space-x-1 my-2">
                {onboardingSteps.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full ${idx === onboardingStep ? 'w-6 bg-purple-500' : 'w-3 bg-gray-600'}`}
                  />
                ))}
              </div>
              
              <div className="flex gap-3 w-full mt-2">
                {onboardingStep > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setOnboardingStep(onboardingStep - 1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                <Button 
                  onClick={advanceOnboarding}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white flex-1"
                >
                  {onboardingStep === onboardingSteps.length - 1 ? "Get Started" : "Next"}
                </Button>
              </div>
              
              <button 
                onClick={skipOnboarding}
                className="text-xs text-gray-400 hover:text-gray-300 mt-2"
              >
                Skip Tour
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
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
                  Your AI coding buddy! Type simple instructions to create, explain, or finish code. Perfect for students learning to code with AI.
                </CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex items-center gap-2">
                  <Select value={selectedModel} onValueChange={handleModelChange}>
                    <SelectTrigger className="w-[200px]">
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
                  
                  <HelpTooltip message="AI models are like different brains that can help you code. Each one is good at different things!">
                    <div className="rounded-full bg-purple-500/10 p-1">
                      <HelpCircle className="h-4 w-4 text-purple-400" />
                    </div>
                  </HelpTooltip>
                </div>
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
                    <div className="flex items-center gap-2 mb-2">
                      <label className="block text-sm font-medium">What would you like to build? Tell me here:</label>
                      <HelpTooltip message="Just describe what you want to make in normal words - no need to know coding! I'll turn your ideas into real code.">
                        <div className="rounded-full bg-purple-500/10 p-1">
                          <HelpCircle className="h-3 w-3 text-purple-400" />
                        </div>
                      </HelpTooltip>
                    </div>
                    <Textarea
                      placeholder="Examples: 
• Make a button that changes color when clicked
• Create a simple game where I can move a character with arrow keys
• Help me display my favorite images in a photo gallery"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-32"
                    />
                    <div className="mt-2 text-xs text-blue-400 bg-blue-400/10 p-2 rounded-md">
                      <span className="font-semibold">💡 Tip:</span> The more details you add, the better your results will be! Try describing what your project should look like and what it should do.
                    </div>
                  </div>
                </TabsContent>

                {/* Explain Tab Content */}
                <TabsContent value="explain" className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <label className="block text-sm font-medium">Paste code you'd like me to explain:</label>
                        <HelpTooltip message="Choose the language your code is written in, so I can explain it correctly!">
                          <div className="rounded-full bg-purple-500/10 p-1">
                            <HelpCircle className="h-3 w-3 text-purple-400" />
                          </div>
                        </HelpTooltip>
                      </div>
                      <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Choose language" />
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
                      placeholder="Found some code online that's confusing? Paste it here and I'll explain what it does in simple terms!"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="min-h-32 font-mono"
                    />
                    <div className="mt-2 text-xs text-purple-400 bg-purple-400/10 p-2 rounded-md">
                      <span className="font-semibold">🔍 What happens:</span> I'll break down the code step-by-step and explain what each part does, without the complicated tech talk!
                    </div>
                  </div>
                </TabsContent>

                {/* Complete Tab Content */}
                <TabsContent value="complete" className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <label className="block text-sm font-medium">Start the code, I'll finish it:</label>
                        <HelpTooltip message="You start writing some code, and I'll help complete it! Great for when you have an idea but aren't sure how to finish it.">
                          <div className="rounded-full bg-purple-500/10 p-1">
                            <HelpCircle className="h-3 w-3 text-purple-400" />
                          </div>
                        </HelpTooltip>
                      </div>
                      <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Choose language" />
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
                      placeholder="Type the beginning of your code here - like 'function createGame() {' - and I'll finish it for you!"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="min-h-32 font-mono"
                    />
                    <div className="mt-2 text-xs text-green-400 bg-green-400/10 p-2 rounded-md">
                      <span className="font-semibold">✨ Cool trick:</span> Try typing a comment above your code that describes what you want it to do! Example: "// Create a button that shows an alert when clicked"
                    </div>
                  </div>
                </TabsContent>

                {/* Temperature Control */}
                {(tab === 'generate' || tab === 'complete') && (
                  <div className="space-y-2 p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Creativity Level: {temperature.toFixed(1)}
                        <HelpTooltip message="This controls how creative the AI will be. Low = follows instructions exactly. High = adds more creative ideas!">
                          <div className="rounded-full bg-purple-500/10 p-1">
                            <HelpCircle className="h-3 w-3 text-purple-400" />
                          </div>
                        </HelpTooltip>
                      </label>
                      <Badge variant="outline" className="text-xs font-normal">
                        {temperature < 0.4 ? 'Follows Instructions Exactly' : temperature > 0.7 ? 'Super Creative' : 'Balanced'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">Precise</span>
                      <Slider
                        value={[temperature]}
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={handleTemperatureChange}
                        className="w-full"
                      />
                      <span className="text-xs">Creative</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Slide left for code that follows your instructions exactly, or right for more creative ideas!
                    </p>
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
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs" 
                onClick={() => setShowOnboarding(true)}
              >
                <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                Show Tour
              </Button>
              
              <Badge variant="outline" className="flex items-center gap-1 cursor-pointer hover:bg-purple-500/10 transition-colors" title="Connect your work with other NURD tools!">
                <Book className="h-3 w-3" />
                Save to My Projects
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-1 cursor-pointer hover:bg-blue-500/10 transition-colors" title="Work with a friend on the same code">
                <Star className="h-3 w-3" />
                Create Study Group
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground hidden sm:block">
                <span className="font-semibold">💭 Remember:</span> There are no silly questions in coding!
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Powered by V.I.B.E. Technology
              </Badge>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* AI Assistant Chat Panel */}
      <div className={`fixed bottom-4 right-4 z-40 transition-all duration-300 ${showAssistant ? 'w-80' : 'w-auto'}`}>
        <div className="flex flex-col">
          {showAssistant && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-xl shadow-xl p-4 mb-2 max-h-96 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-white/90 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  V.I.B.E. Assistant
                </h4>
                <button 
                  onClick={() => setShowAssistant(false)}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  Close
                </button>
              </div>
              
              <div className="space-y-3">
                {assistantMessages.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`p-2 rounded-lg text-xs ${
                      msg.type === 'tip' 
                        ? 'bg-blue-500/10 text-blue-300' 
                        : msg.type === 'encouragement' 
                        ? 'bg-purple-500/10 text-purple-300'
                        : 'bg-green-500/10 text-green-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {msg.type === 'tip' && <LightbulbIcon className="h-3.5 w-3.5" />}
                        {msg.type === 'encouragement' && <Award className="h-3.5 w-3.5" />}
                        {msg.type === 'help' && <Book className="h-3.5 w-3.5" />}
                      </div>
                      <div>{msg.message}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex gap-2 mt-1">
                  <button 
                    className="text-xs bg-blue-500/10 text-blue-300 px-2 py-1 rounded hover:bg-blue-500/20 transition-colors"
                    onClick={() => {
                      setAssistantMessages([
                        ...assistantMessages,
                        { 
                          message: "Need a simple challenge? Try making a button that counts clicks when pressed!", 
                          type: 'tip' 
                        }
                      ]);
                    }}
                  >
                    Give me a challenge
                  </button>
                  <button 
                    className="text-xs bg-purple-500/10 text-purple-300 px-2 py-1 rounded hover:bg-purple-500/20 transition-colors"
                    onClick={() => {
                      setAssistantMessages([
                        ...assistantMessages,
                        { 
                          message: "You're doing great! Keep experimenting - making mistakes is how we learn coding!", 
                          type: 'encouragement' 
                        }
                      ]);
                    }}
                  >
                    I'm stuck
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          <Button 
            variant={showAssistant ? "default" : "outline"} 
            size="icon" 
            className={`rounded-full h-12 w-12 ${showAssistant ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' : 'bg-purple-500/10 border-purple-500/30'}`}
            onClick={() => setShowAssistant(!showAssistant)}
          >
            <MessageCircle className={`h-5 w-5 ${showAssistant ? 'text-white' : 'text-purple-400'}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}