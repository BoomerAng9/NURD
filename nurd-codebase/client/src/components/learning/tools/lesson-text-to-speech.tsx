import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Pause, Play, SkipBack, SkipForward, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';

interface LessonTextToSpeechProps {
  content: string;
  title: string;
}

export function LessonTextToSpeech({ content, title }: LessonTextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isSpeechAvailable, setIsSpeechAvailable] = useState(false);
  
  // Break content into sections (paragraphs)
  const sections = content
    .split('\n')
    .filter(section => section.trim().length > 0)
    .map(section => section.trim());
  
  // References for speech synthesis
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const previousVolumeRef = useRef(volume);
  
  // Check if speech synthesis is available
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSpeechAvailable(true);
    } else {
      setIsSpeechAvailable(false);
    }
  }, []);

  // Initialize speech synthesis
  useEffect(() => {
    if (!isSpeechAvailable) return;
    
    const synth = window.speechSynthesis;
    
    // This helps ensure speech synthesis is ready
    synth.cancel();
    
    return () => {
      synth.cancel();
    };
  }, [isSpeechAvailable]);

  // Handle playing state changes
  useEffect(() => {
    if (!isSpeechAvailable) return;
    
    const synth = window.speechSynthesis;
    
    if (isPlaying && !isPaused) {
      // Create a new utterance if needed
      if (!utteranceRef.current) {
        const newUtterance = new SpeechSynthesisUtterance(sections[currentSection]);
        newUtterance.volume = isMuted ? 0 : volume;
        newUtterance.rate = 0.9; // Slightly slower than default
        
        // Get available voices
        const voices = synth.getVoices();
        // Try to find a higher quality voice
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Premium') || 
          voice.name.includes('Enhanced') || 
          voice.name.includes('Daniel') ||
          voice.name.includes('Google') || 
          voice.name.includes('Samantha')
        );
        
        if (preferredVoice) {
          newUtterance.voice = preferredVoice;
        }
        
        // Handle section end
        newUtterance.onend = () => {
          // Move to next section if available
          if (currentSection < sections.length - 1) {
            setCurrentSection(prev => prev + 1);
          } else {
            // End of content
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentSection(0);
            setProgress(0);
          }
        };
        
        // Handle progress updates
        newUtterance.onboundary = (event) => {
          if (event.name === 'word') {
            const totalWords = sections[currentSection].split(' ').length;
            const currentWordIndex = Math.min(
              Math.floor(event.charIndex / 5), 
              totalWords - 1
            );
            setProgress(
              (currentSection + currentWordIndex / totalWords) / 
              sections.length * 100
            );
          }
        };
        
        utteranceRef.current = newUtterance;
      }
      
      synth.speak(utteranceRef.current);
    } else if (isPaused) {
      synth.pause();
    } else {
      synth.cancel();
      utteranceRef.current = null;
    }
  }, [isPlaying, isPaused, currentSection, sections, isSpeechAvailable, volume, isMuted]);
  
  // Handle volume changes
  useEffect(() => {
    if (utteranceRef.current) {
      utteranceRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    if (!isSpeechAvailable) {
      toast({
        title: "Text-to-Speech Unavailable",
        description: "Your browser doesn't support speech synthesis",
        variant: "destructive",
      });
      return;
    }
    
    if (isPlaying) {
      if (isPaused) {
        setIsPaused(false);
        window.speechSynthesis.resume();
      } else {
        setIsPaused(true);
        window.speechSynthesis.pause();
      }
    } else {
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const stopReading = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSection(0);
    setProgress(0);
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
  };

  const skipForward = () => {
    if (currentSection < sections.length - 1) {
      window.speechSynthesis.cancel();
      setCurrentSection(prev => prev + 1);
      utteranceRef.current = null;
      if (isPlaying && !isPaused) {
        setTimeout(() => {
          // This timeout allows the speech synthesis to properly reset
          setIsPlaying(true);
          setIsPaused(false);
        }, 100);
      }
    }
  };

  const skipBackward = () => {
    if (currentSection > 0) {
      window.speechSynthesis.cancel();
      setCurrentSection(prev => prev - 1);
      utteranceRef.current = null;
      if (isPlaying && !isPaused) {
        setTimeout(() => {
          setIsPlaying(true);
          setIsPaused(false);
        }, 100);
      }
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolumeRef.current);
      setIsMuted(false);
    } else {
      previousVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    } else if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
  };

  if (!isSpeechAvailable) {
    return (
      <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
        Text-to-speech is not available in your browser.
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center">
          <Volume2 className="h-5 w-5 mr-2 text-primary" />
          Read Aloud
        </h3>
        <div className="text-xs text-muted-foreground">
          Section {currentSection + 1} of {sections.length}
        </div>
      </div>
      
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9" 
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <div className="w-24">
            <Slider 
              value={[volume]} 
              max={1} 
              step={0.01} 
              onValueChange={handleVolumeChange} 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={skipBackward}>
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={togglePlayPause} 
            variant="default" 
            size="icon" 
            className="h-10 w-10 rounded-full"
          >
            {isPlaying && !isPaused ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={skipForward}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="w-[88px]">
          {isPlaying && (
            <Button variant="outline" size="sm" onClick={stopReading}>
              Stop
            </Button>
          )}
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p className="font-medium">Now reading:</p>
        <p className="truncate">{sections[currentSection].substring(0, 60)}...</p>
      </div>
    </div>
  );
}