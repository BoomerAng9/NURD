import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, Volume2, VolumeX, Headphones, Sparkles, CornerDownLeft, AlertTriangle, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getNarration, CodeNarrationRequest } from '@/services/accessibility-service';
import { useAuth } from '@/hooks/use-auth';

interface CodeNarratorProps {
  code: string;
  language: string;
  className?: string;
  onClose?: () => void;
}

interface SubscriptionTier {
  name: string;
  features: string[];
  recommended?: boolean;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Standard',
    features: [
      'Audio narration',
      'Detailed explanations',
      'Higher token limits'
    ]
  },
  {
    name: 'Premium',
    features: [
      'Advanced teaching narration',
      'All voice styles',
      'Unlimited tokens',
      'Priority processing'
    ],
    recommended: true
  }
];

const CodeNarrator: React.FC<CodeNarratorProps> = ({ 
  code, 
  language, 
  className = '', 
  onClose 
}) => {
  const { user, isLoading } = useAuth();
  const [narration, setNarration] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [narrationLevel, setNarrationLevel] = useState<'basic' | 'detailed' | 'teaching'>('basic');
  const [voiceStyle, setVoiceStyle] = useState<'default' | 'clear' | 'slow'>('default');
  const [includeAudio, setIncludeAudio] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState<{used: number, remaining: number} | null>(null);
  const [needsUpgrade, setNeedsUpgrade] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Determine user's subscription tier
  const userTier = user?.subscriptionTier || 'free';
  const isAuthenticated = !!user;
  
  // Set appropriate defaults based on user tier
  useEffect(() => {
    // Teaching narration only for premium tier
    if (userTier !== 'premium' && narrationLevel === 'teaching') {
      setNarrationLevel('detailed');
    }
    
    // Audio only for paid tiers
    if (userTier === 'free' && includeAudio) {
      setIncludeAudio(false);
    }
  }, [userTier, narrationLevel, includeAudio]);

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle audio playback
  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        toast({
          title: 'Audio Playback Error',
          description: 'There was a problem playing the audio narration.',
          variant: 'destructive'
        });
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  // Set up audio event listeners
  const setupAudioElement = (audioUrl: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      audioRef.current.addEventListener('error', () => {
        setIsPlaying(false);
        toast({
          title: 'Audio Playback Error',
          description: 'There was a problem playing the audio narration.',
          variant: 'destructive'
        });
      });
    } else {
      audioRef.current.src = audioUrl;
    }
  };

  // Generate narration using the accessibility API
  const generateNarration = async () => {
    if (!code.trim()) {
      toast({
        title: 'No Code to Narrate',
        description: 'Please enter some code first.',
        variant: 'destructive'
      });
      return;
    }

    // Reset error and upgrade states
    setError(null);
    setNeedsUpgrade(false);
    
    try {
      setIsGenerating(true);
      setNarration('');
      
      // Stop any playing audio
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }

      // Prepare request payload
      const params: CodeNarrationRequest = {
        code,
        language,
        narrationLevel,
        includeAudio,
        voiceStyle: includeAudio ? voiceStyle : undefined
      };

      // Call the API
      const response = await getNarration(params);
      
      // Update narration text
      setNarration(response.narration);
      
      // Track token usage if provided
      if (response.tokensUsed && response.remainingTokens !== undefined) {
        setTokenUsage({
          used: response.tokensUsed,
          remaining: response.remainingTokens
        });
      }
      
      // Set up audio if available
      if (response.audioUrl && includeAudio) {
        setupAudioElement(response.audioUrl);
      }

      toast({
        title: 'Narration Generated',
        description: 'Code narration has been created successfully.',
        variant: 'default'
      });
    } catch (error: any) {
      console.error('Error generating narration:', error);
      
      // Handle specific subscription-related errors
      if (error.response && error.response.status === 403) {
        try {
          const errorData = await error.response.json();
          
          if (errorData.requiresAuthentication) {
            setError('You need to sign up to use this feature with your current token count.');
            setNeedsUpgrade(true);
          } else if (errorData.currentTier && errorData.requiredTier) {
            setError(`This feature requires the ${errorData.requiredTier} tier. You're currently on the ${errorData.currentTier} tier.`);
            setNeedsUpgrade(true);
          } else if (errorData.requiresUpgrade) {
            setError('You\'ve reached your token limit. Please upgrade your subscription tier for more tokens.');
            setNeedsUpgrade(true);
          } else {
            setError(errorData.error || 'Access denied. Please check your subscription tier.');
          }
          
          // Update token usage if provided
          if (errorData.estimatedTokens !== undefined && errorData.remainingTokens !== undefined) {
            setTokenUsage({
              used: errorData.estimatedTokens,
              remaining: errorData.remainingTokens
            });
          }
        } catch (parseError) {
          setError('Unable to access this feature with your current subscription tier.');
        }
      } else {
        toast({
          title: 'Narration Error',
          description: error.message || 'Failed to generate code narration',
          variant: 'destructive'
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className={`border border-purple-400/30 shadow-lg ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Headphones className="h-5 w-5 text-cyan-500" />
          Code Narrator
        </CardTitle>
        <CardDescription>
          Makes code accessible with clear narration and audio explanations
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Narration Level</label>
            <Select 
              value={narrationLevel}
              onValueChange={(value: 'basic' | 'detailed' | 'teaching') => setNarrationLevel(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic (Overview)</SelectItem>
                <SelectItem value="detailed">Detailed (Step-by-step)</SelectItem>
                <SelectItem value="teaching">Teaching (Educational)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Voice Style</label>
            <Select 
              value={voiceStyle}
              onValueChange={(value: 'default' | 'clear' | 'slow') => setVoiceStyle(value)}
              disabled={!includeAudio}
            >
              <SelectTrigger className={!includeAudio ? 'opacity-50' : ''}>
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="clear">Clear</SelectItem>
                <SelectItem value="slow">Slow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="include-audio"
            checked={includeAudio}
            onChange={() => setIncludeAudio(!includeAudio)}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor="include-audio" className="text-sm">
            Include audio narration
          </label>
        </div>
        
        <Button 
          onClick={generateNarration}
          disabled={isGenerating || !code}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Narration...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Code Narration
            </>
          )}
        </Button>
        
        {narration && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Narration:</h3>
              {includeAudio && audioRef.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAudio}
                  className="h-8 gap-1 border-cyan-500/30 hover:bg-cyan-500/10"
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="h-4 w-4" />
                      Pause Audio
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4" />
                      Play Audio
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <div className="bg-muted p-4 rounded-md text-sm max-h-[300px] overflow-y-auto whitespace-pre-wrap">
              {narration}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-1 flex justify-end">
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-xs"
          >
            Close
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CodeNarrator;