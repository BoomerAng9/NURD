import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  CircleDot, 
  Palette, 
  User, 
  Brain, 
  Save, 
  RefreshCw,
  Download,
  Share2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from '@/components/ui/supabase-provider';

// Personality trait types
type PersonalityTrait = 'creative' | 'analytical' | 'social' | 'practical';
type AvatarStyle = 'modern' | 'artistic' | 'tech' | 'classic' | 'playful';
type ColorScheme = 'warm' | 'cool' | 'neutral' | 'vibrant' | 'earthy';

// Quiz question interface
interface QuizQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    trait: PersonalityTrait;
  }[];
}

// Avatar features based on personality
const personalityAvatarMap: Record<PersonalityTrait, {
  defaultStyle: AvatarStyle;
  defaultColors: ColorScheme;
  avatarTraits: string[];
}> = {
  creative: {
    defaultStyle: 'artistic',
    defaultColors: 'vibrant',
    avatarTraits: ['vibrant hair', 'artistic accessories', 'expressive features']
  },
  analytical: {
    defaultStyle: 'tech',
    defaultColors: 'cool',
    avatarTraits: ['glasses', 'structured style', 'minimal accessories']
  },
  social: {
    defaultStyle: 'modern',
    defaultColors: 'warm',
    avatarTraits: ['friendly expression', 'fashionable style', 'bright colors']
  },
  practical: {
    defaultStyle: 'classic',
    defaultColors: 'earthy',
    avatarTraits: ['simple style', 'natural colors', 'practical accessories']
  }
};

// Quiz questions
const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How do you prefer to spend your free time?',
    options: [
      { text: 'Creating art or music', trait: 'creative' },
      { text: 'Reading or learning new things', trait: 'analytical' },
      { text: 'Hanging out with friends', trait: 'social' },
      { text: 'Working on practical projects', trait: 'practical' }
    ]
  },
  {
    id: 'q2',
    question: "What's your approach to solving problems?",
    options: [
      { text: 'Think outside the box', trait: 'creative' },
      { text: 'Analyze all the variables', trait: 'analytical' },
      { text: 'Discuss with others to find solutions', trait: 'social' },
      { text: 'Focus on what works reliably', trait: 'practical' }
    ]
  },
  {
    id: 'q3',
    question: 'In a team project, which role do you naturally take?',
    options: [
      { text: 'The idea generator', trait: 'creative' },
      { text: 'The planner and organizer', trait: 'analytical' },
      { text: 'The communicator and motivator', trait: 'social' },
      { text: 'The implementer who gets things done', trait: 'practical' }
    ]
  },
  {
    id: 'q4',
    question: 'What would your dream workspace look like?',
    options: [
      { text: 'Colorful and inspiring with artistic elements', trait: 'creative' },
      { text: 'Organized with the latest technology', trait: 'analytical' },
      { text: 'A collaborative space where people can interact', trait: 'social' },
      { text: 'Functional and efficient with everything you need', trait: 'practical' }
    ]
  },
  {
    id: 'q5',
    question: 'Which statement describes you best?',
    options: [
      { text: "I'm always coming up with new ideas", trait: 'creative' },
      { text: 'I like understanding how things work', trait: 'analytical' },
      { text: 'I value my relationships with others', trait: 'social' },
      { text: 'I prefer tangible results over theories', trait: 'practical' }
    ]
  }
];

// Generate SVG avatar based on personality and customization
const generateAvatarSVG = (
  dominantTrait: PersonalityTrait,
  style: AvatarStyle,
  colorScheme: ColorScheme,
  customizations: {
    hairStyle: number;
    faceShape: number;
    accessory: number;
    expression: number;
  }
) => {
  // Base colors based on color scheme
  const colorPalettes = {
    warm: ['#FF9A76', '#FFEADB', '#F7C5A8', '#B23A48', '#FCB5AC'],
    cool: ['#89CFF0', '#A0E7E5', '#B4F8C8', '#4682B4', '#E0FFFF'],
    neutral: ['#E8E8E8', '#D3D3D3', '#C0C0C0', '#BFBFBF', '#A9A9A9'],
    vibrant: ['#FF8080', '#FFCF56', '#90EE90', '#9381FF', '#F8A1D1'],
    earthy: ['#A0522D', '#8B4513', '#6B8E23', '#BDB76B', '#F4A460']
  };

  const palette = colorPalettes[colorScheme];
  
  // Generate SVG code based on selections
  // This is a simplified version; in a real implementation, 
  // this would be much more complex and detailed
  const svgCode = `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect width="200" height="200" fill="${palette[0]}" opacity="0.2" />
    
    <!-- Face shape based on faceShape value -->
    ${faceShapes[customizations.faceShape % faceShapes.length](palette[2])}
    
    <!-- Hair style based on hairStyle value -->
    ${hairStyles[customizations.hairStyle % hairStyles.length](palette[3])}
    
    <!-- Expression based on expression value -->
    ${expressions[customizations.expression % expressions.length]()}
    
    <!-- Accessory based on accessory value and style -->
    ${accessories[customizations.accessory % accessories.length](palette[4], style)}
  </svg>
  `;
  
  return svgCode;
};

// Define different avatar components
const faceShapes = [
  (color: string) => `<circle cx="100" cy="100" r="60" fill="${color}" />`, // Round
  (color: string) => `<ellipse cx="100" cy="100" rx="55" ry="65" fill="${color}" />`, // Oval
  (color: string) => `<rect x="50" y="50" width="100" height="100" rx="20" fill="${color}" />`, // Square
  (color: string) => `<path d="M60,50 L140,50 L150,120 L50,120 Z" fill="${color}" />` // Diamond
];

const hairStyles = [
  (color: string) => `<path d="M40,70 Q100,30 160,70 L160,40 Q100,10 40,40 Z" fill="${color}" />`, // Wavy
  (color: string) => `<rect x="40" y="30" width="120" height="40" fill="${color}" />`, // Straight
  (color: string) => `<circle cx="100" cy="60" r="50" fill="${color}" />`, // Afro
  (color: string) => `<path d="M40,90 Q100,20 160,90" stroke="${color}" stroke-width="15" fill="none" />` // Bald with headband
];

const expressions = [
  () => `
    <!-- Happy -->
    <circle cx="75" cy="85" r="5" fill="black" />
    <circle cx="125" cy="85" r="5" fill="black" />
    <path d="M70,120 Q100,140 130,120" stroke="black" stroke-width="3" fill="none" />
  `,
  () => `
    <!-- Thoughtful -->
    <circle cx="75" cy="85" r="5" fill="black" />
    <circle cx="125" cy="85" r="5" fill="black" />
    <path d="M70,125 Q100,120 130,125" stroke="black" stroke-width="3" fill="none" />
  `,
  () => `
    <!-- Surprised -->
    <circle cx="75" cy="85" r="5" fill="black" />
    <circle cx="125" cy="85" r="5" fill="black" />
    <circle cx="100" cy="125" r="10" fill="none" stroke="black" stroke-width="3" />
  `,
  () => `
    <!-- Determined -->
    <circle cx="75" cy="85" r="5" fill="black" />
    <circle cx="125" cy="85" r="5" fill="black" />
    <path d="M70,125 L130,125" stroke="black" stroke-width="3" fill="none" />
  `
];

const accessories = [
  (color: string, style: AvatarStyle) => {
    // Different accessories based on style
    if (style === 'tech') {
      return `<rect x="60" y="80" width="80" height="15" rx="5" fill="${color}" />`; // Smart glasses
    } else if (style === 'artistic') {
      return `<path d="M60,60 Q100,40 140,60" stroke="${color}" stroke-width="5" fill="none" />`; // Artist headband
    } else if (style === 'playful') {
      return `<circle cx="100" cy="40" r="15" fill="${color}" />`; // Top hat
    } else {
      return `<path d="M70,70 L130,70 L120,90 L80,90 Z" fill="${color}" />`; // Generic accessory
    }
  }
];

const AvatarGenerator: React.FC = () => {
  const { toast } = useToast();
  const { user, supabase } = useSupabase();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<Record<string, PersonalityTrait>>({});
  const [dominantTrait, setDominantTrait] = useState<PersonalityTrait>('creative');
  const [activeTab, setActiveTab] = useState('quiz');
  
  // Avatar customization state
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>('modern');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('warm');
  const [customizations, setCustomizations] = useState({
    hairStyle: 0,
    faceShape: 0,
    accessory: 0,
    expression: 0
  });
  
  // Avatar SVG state
  const [avatarSVG, setAvatarSVG] = useState('');
  
  // Update avatar SVG when customizations change
  useEffect(() => {
    if (quizComplete || Object.keys(answers).length > 0) {
      const svg = generateAvatarSVG(
        dominantTrait,
        avatarStyle,
        colorScheme,
        customizations
      );
      setAvatarSVG(svg);
    }
  }, [dominantTrait, avatarStyle, colorScheme, customizations, quizComplete]);
  
  // Handle quiz answer selection
  const handleAnswerSelect = (questionId: string, trait: PersonalityTrait) => {
    const newAnswers = { ...answers, [questionId]: trait };
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed, calculate dominant trait
      const traitCount: Record<PersonalityTrait, number> = {
        creative: 0,
        analytical: 0,
        social: 0,
        practical: 0
      };
      
      // Count occurrences of each trait
      Object.values(newAnswers).forEach(trait => {
        traitCount[trait]++;
      });
      
      // Find dominant trait
      let maxCount = 0;
      let dominantPersonalityTrait: PersonalityTrait = 'creative';
      
      Object.entries(traitCount).forEach(([trait, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantPersonalityTrait = trait as PersonalityTrait;
        }
      });
      
      setDominantTrait(dominantPersonalityTrait);
      
      // Set default avatar properties based on personality
      const traitDefaults = personalityAvatarMap[dominantPersonalityTrait];
      setAvatarStyle(traitDefaults.defaultStyle);
      setColorScheme(traitDefaults.defaultColors);
      
      // Mark quiz as complete
      setQuizComplete(true);
      setActiveTab('customize');
      
      toast({
        title: "Personality Quiz Complete!",
        description: `Your dominant trait is: ${capitalizeFirstLetter(dominantPersonalityTrait)}`,
      });
    }
  };
  
  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizComplete(false);
    setActiveTab('quiz');
  };
  
  // Handle customization changes
  const handleCustomizationChange = (
    property: keyof typeof customizations,
    value: number
  ) => {
    setCustomizations({
      ...customizations,
      [property]: value
    });
  };
  
  // Save avatar to profile
  const saveAvatar = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save your avatar.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setActiveTab('saving');
      
      // In a real implementation, you'd save the SVG to storage
      // and update the user's profile with the avatar URL
      const avatarData = {
        svg: avatarSVG,
        trait: dominantTrait,
        style: avatarStyle,
        colorScheme: colorScheme,
        customizations: customizations
      };
      
      // Save to Supabase (in a real implementation)
      const { error } = await supabase
        .from('profiles')
        .update({ 
          avatar_svg: avatarSVG,
          avatar_data: avatarData 
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Avatar Saved!",
        description: "Your custom avatar has been saved to your profile."
      });
      
      setActiveTab('customize');
    } catch (error) {
      console.error('Error saving avatar:', error);
      toast({
        title: "Error Saving Avatar",
        description: "There was a problem saving your avatar. Please try again.",
        variant: "destructive"
      });
      setActiveTab('customize');
    }
  };
  
  // Download avatar as SVG
  const downloadAvatar = () => {
    const blob = new Blob([avatarSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nurd-avatar-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Avatar Downloaded",
      description: "Your avatar has been downloaded as an SVG file."
    });
  };
  
  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  // Current question
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden border-2 border-indigo-100">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2" />
        
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Personality-Based Avatar Creator
          </CardTitle>
          <CardDescription className="text-center">
            Take the quiz to generate a unique avatar that reflects your personality!
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quiz" disabled={activeTab === 'saving'}>
              <Brain className="w-4 h-4 mr-2" />
              Personality Quiz
            </TabsTrigger>
            <TabsTrigger value="customize" disabled={!quizComplete || activeTab === 'saving'}>
              <Palette className="w-4 h-4 mr-2" />
              Customize Avatar
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!quizComplete || activeTab === 'saving'}>
              <User className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="quiz" className="p-6">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <div className="mb-6">
                  <h3 className="font-medium text-lg mb-1">
                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <h2 className="text-xl font-medium mb-6">{currentQuestion.question}</h2>
                
                <RadioGroup 
                  className="space-y-4"
                  value={answers[currentQuestion.id]}
                  onValueChange={(value) => 
                    handleAnswerSelect(currentQuestion.id, value as PersonalityTrait)
                  }
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.trait} 
                        id={`option-${index}`}
                      />
                      <Label 
                        htmlFor={`option-${index}`}
                        className="flex-grow cursor-pointer py-2"
                      >
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  
                  {currentQuestionIndex < quizQuestions.length - 1 ? (
                    <Button
                      onClick={() => {
                        if (answers[currentQuestion.id]) {
                          setCurrentQuestionIndex(currentQuestionIndex + 1);
                        } else {
                          toast({
                            title: "Selection Required",
                            description: "Please select an answer to continue.",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (answers[currentQuestion.id]) {
                          handleAnswerSelect(
                            currentQuestion.id, 
                            answers[currentQuestion.id] as PersonalityTrait
                          );
                        } else {
                          toast({
                            title: "Selection Required",
                            description: "Please select an answer to complete the quiz.",
                            variant: "destructive"
                          });
                        }
                      }}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Complete Quiz
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="customize" className="space-y-6 p-6">
            {quizComplete && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Your Personality Profile</h3>
                    <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                      <p className="font-medium text-indigo-900">
                        Dominant Trait: {capitalizeFirstLetter(dominantTrait)}
                      </p>
                      <p className="text-sm text-indigo-800 mt-1">
                        {dominantTrait === 'creative' && "You have a vibrant imagination and think outside the box!"}
                        {dominantTrait === 'analytical' && "You're logical and detail-oriented with a structured approach."}
                        {dominantTrait === 'social' && "You're outgoing and value connections with others."}
                        {dominantTrait === 'practical' && "You're pragmatic and focus on tangible, real-world results."}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Your avatar has been pre-customized based on your personality traits:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {personalityAvatarMap[dominantTrait].avatarTraits.map((trait, index) => (
                          <li key={index}>{trait}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Avatar Style</h3>
                    <RadioGroup 
                      className="grid grid-cols-2 gap-4 mb-6"
                      value={avatarStyle}
                      onValueChange={(value) => setAvatarStyle(value as AvatarStyle)}
                    >
                      {(['modern', 'artistic', 'tech', 'classic', 'playful'] as AvatarStyle[]).map((style) => (
                        <div key={style} className="flex items-center space-x-2">
                          <RadioGroupItem value={style} id={`style-${style}`} />
                          <Label htmlFor={`style-${style}`}>{capitalizeFirstLetter(style)}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Color Scheme</h3>
                    <RadioGroup 
                      className="grid grid-cols-2 gap-4 mb-6"
                      value={colorScheme}
                      onValueChange={(value) => setColorScheme(value as ColorScheme)}
                    >
                      {(['warm', 'cool', 'neutral', 'vibrant', 'earthy'] as ColorScheme[]).map((scheme) => (
                        <div key={scheme} className="flex items-center space-x-2">
                          <RadioGroupItem value={scheme} id={`color-${scheme}`} />
                          <Label htmlFor={`color-${scheme}`}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full mr-2 ${
                                scheme === 'warm' ? 'bg-orange-400' :
                                scheme === 'cool' ? 'bg-blue-400' :
                                scheme === 'neutral' ? 'bg-gray-400' :
                                scheme === 'vibrant' ? 'bg-purple-400' :
                                'bg-amber-700'
                              }`}></div>
                              {capitalizeFirstLetter(scheme)}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Features</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <Label className="mb-2 block">Hair Style</Label>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full h-8 w-8 p-0"
                            onClick={() => handleCustomizationChange('hairStyle', (customizations.hairStyle - 1 + hairStyles.length) % hairStyles.length)}
                          >
                            -
                          </Button>
                          <div className="flex-grow mx-2">
                            <Slider 
                              value={[customizations.hairStyle]} 
                              min={0} 
                              max={hairStyles.length - 1} 
                              step={1}
                              onValueChange={(values) => handleCustomizationChange('hairStyle', values[0])}
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full h-8 w-8 p-0"
                            onClick={() => handleCustomizationChange('hairStyle', (customizations.hairStyle + 1) % hairStyles.length)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Face Shape</Label>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full h-8 w-8 p-0"
                            onClick={() => handleCustomizationChange('faceShape', (customizations.faceShape - 1 + faceShapes.length) % faceShapes.length)}
                          >
                            -
                          </Button>
                          <div className="flex-grow mx-2">
                            <Slider 
                              value={[customizations.faceShape]} 
                              min={0} 
                              max={faceShapes.length - 1} 
                              step={1}
                              onValueChange={(values) => handleCustomizationChange('faceShape', values[0])}
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full h-8 w-8 p-0"
                            onClick={() => handleCustomizationChange('faceShape', (customizations.faceShape + 1) % faceShapes.length)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Accessories</Label>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full h-8 w-8 p-0"
                            onClick={() => handleCustomizationChange('accessory', (customizations.accessory - 1 + accessories.length) % accessories.length)}
                          >
                            -
                          </Button>
                          <div className="flex-grow mx-2">
                            <Slider 
                              value={[customizations.accessory]} 
                              min={0} 
                              max={accessories.length - 1} 
                              step={1}
                              onValueChange={(values) => handleCustomizationChange('accessory', values[0])}
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full h-8 w-8 p-0"
                            onClick={() => handleCustomizationChange('accessory', (customizations.accessory + 1) % accessories.length)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Expression</Label>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full h-8 w-8 p-0"
                            onClick={() => handleCustomizationChange('expression', (customizations.expression - 1 + expressions.length) % expressions.length)}
                          >
                            -
                          </Button>
                          <div className="flex-grow mx-2">
                            <Slider 
                              value={[customizations.expression]} 
                              min={0} 
                              max={expressions.length - 1} 
                              step={1}
                              onValueChange={(values) => handleCustomizationChange('expression', values[0])}
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full h-8 w-8 p-0"
                            onClick={() => handleCustomizationChange('expression', (customizations.expression + 1) % expressions.length)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 flex flex-col items-center">
                    <h3 className="text-lg font-medium mb-4">Avatar Preview</h3>
                    <div className="w-64 h-64 bg-indigo-50 rounded-lg flex items-center justify-center p-4">
                      {avatarSVG ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: avatarSVG }} 
                          className="w-full h-full"
                        />
                      ) : (
                        <CircleDot className="w-16 h-16 text-gray-300" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button onClick={saveAvatar} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save to Profile
                    </Button>
                    
                    <Button variant="outline" onClick={downloadAvatar} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Avatar
                    </Button>
                    
                    <Button variant="outline" onClick={resetQuiz} className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retake Quiz
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="preview" className="p-6">
            {quizComplete && (
              <div className="flex flex-col items-center space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-medium mb-2">Your Unique NURD Avatar</h3>
                  <p className="text-gray-600 max-w-lg mx-auto">
                    Based on your {dominantTrait} personality, we've created this 
                    unique avatar that represents your personal style and traits.
                  </p>
                </div>
                
                <div className="w-80 h-80 bg-indigo-50 rounded-lg flex items-center justify-center p-4">
                  {avatarSVG ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: avatarSVG }} 
                      className="w-full h-full"
                    />
                  ) : (
                    <CircleDot className="w-16 h-16 text-gray-300" />
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center max-w-2xl">
                  <Button onClick={saveAvatar}>
                    <Save className="w-4 h-4 mr-2" />
                    Save to Profile
                  </Button>
                  
                  <Button variant="outline" onClick={downloadAvatar}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Avatar
                  </Button>
                  
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Avatar
                  </Button>
                  
                  <Button variant="link" onClick={() => setActiveTab('customize')}>
                    Continue Customizing
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saving" className="p-6">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mb-6" />
              <h3 className="text-lg font-medium mb-2">Saving Your Avatar</h3>
              <p className="text-gray-600">
                Please wait while we save your avatar to your profile...
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="bg-gray-50 border-t p-6">
          <div className="w-full text-center text-sm text-gray-600">
            Your avatar is uniquely yours and reflects your personality traits. 
            Use it throughout the NURD platform to represent yourself!
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AvatarGenerator;