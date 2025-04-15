import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AchievementCelebrationProps {
  title: string;
  description: string;
  imageUrl?: string;
  xpEarned: number;
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementCelebration({
  title, 
  description, 
  imageUrl, 
  xpEarned,
  isOpen,
  onClose
}: AchievementCelebrationProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    
    if (isOpen) {
      // Trigger confetti when achievement appears
      const duration = 3 * 1000;
      const end = Date.now() + duration;
      
      const confettiColors = ['#f44336', '#2196f3', '#ffeb3b', '#4caf50', '#9c27b0'];
      
      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: confettiColors
        });
        
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: confettiColors
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [isOpen]);
  
  // Handle the animation end
  const handleAnimationComplete = () => {
    if (!isVisible) {
      onClose();
    }
  };
  
  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
            className={cn(
              "relative w-[320px] md:w-[400px] p-6 rounded-2xl shadow-xl",
              "bg-gradient-to-br from-slate-800/90 to-slate-950/95",
              "backdrop-blur-xl border border-slate-700/50",
              "flex flex-col items-center text-center"
            )}
          >
            <Button 
              variant="ghost" 
              className="absolute right-2 top-2 h-8 w-8 p-0 rounded-full" 
              onClick={() => setIsVisible(false)}
            >
              <X size={16} className="text-slate-400" />
            </Button>
            
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-2"
            >
              <div className="w-24 h-24 mx-auto mb-4 relative flex items-center justify-center">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={title} 
                    className="w-full h-full object-contain rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Award size={48} className="text-white" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-full border-4 border-yellow-400 opacity-70 animate-pulse" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-2 text-white">{title}</h2>
              <p className="text-slate-300 mb-4">{description}</p>
              <div className="text-yellow-400 font-bold text-lg">
                +{xpEarned} XP
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-6"
            >
              <Button 
                onClick={() => setIsVisible(false)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              >
                Keep Going!
              </Button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}