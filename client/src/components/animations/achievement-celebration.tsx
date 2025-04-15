import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useSupabase } from '@/components/ui/supabase-provider';
import { useWebSocket } from '@/hooks/use-websocket';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star, Medal, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface Achievement {
  id: number;
  title: string;
  description: string;
  type: 'completion' | 'streak' | 'milestone' | 'special';
  icon_name?: string;
  xp_reward: number;
}

// Animation variants for different elements
const cardVariants = {
  hidden: { y: -100, opacity: 0, rotateY: -15, rotateX: 10 },
  visible: {
    y: 0,
    opacity: 1,
    rotateY: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.8
    }
  },
  exit: {
    y: -50,
    opacity: 0,
    rotateY: 15,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.6
    }
  }
};

const iconVariants = {
  hidden: { scale: 0.5, rotate: -15, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.3
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 0.6
    }
  }
};

const xpVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: [0.8, 1.2, 1],
    transition: {
      delay: 0.7,
      duration: 0.8,
      times: [0, 0.6, 1]
    }
  }
};

// Splatter effect component
const SplatterEffect = ({ startPosition }: { startPosition: { x: number, y: number } }) => {
  // Random color for splatter
  const splatterColors = [
    'rgba(255, 127, 80, 0.7)',
    'rgba(250, 218, 94, 0.7)',
    'rgba(138, 43, 226, 0.7)',
    'rgba(64, 224, 208, 0.7)',
    'rgba(50, 205, 50, 0.7)'
  ];
  
  const randomColor = splatterColors[Math.floor(Math.random() * splatterColors.length)];
  
  return (
    <motion.div
      initial={{ opacity: 1, scale: 0, x: startPosition.x, y: startPosition.y }}
      animate={{ opacity: 0, scale: 3 }}
      transition={{ duration: 0.6 }}
      className="absolute pointer-events-none"
      style={{
        background: `radial-gradient(circle, ${randomColor} 0%, transparent 70%)`,
        width: '60px',
        height: '60px',
        borderRadius: '50%'
      }}
    />
  );
};

export const AchievementCelebration: React.FC = () => {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [splatterEffects, setSplatterEffects] = useState<{id: number, position: {x: number, y: number}}[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const splatterCounter = useRef(0);
  const { user } = useSupabase();
  const { notifications } = useWebSocket();
  const isMobile = useIsMobile();

  // Watch for achievement notifications from WebSocket
  useEffect(() => {
    if (!notifications || notifications.length === 0) return;

    // Find achievement notifications
    const achievementNotification = notifications.find(n => n.type === 'ACHIEVEMENT_EARNED');
    
    if (achievementNotification && user) {
      // Fetch achievement details
      fetch(`/api/achievements/${achievementNotification.data.achievementId}`)
        .then(res => res.json())
        .then(achievement => {
          setCurrentAchievement(achievement);
          setShowCelebration(true);
          
          // Trigger confetti
          triggerConfetti();
          
          // Also show toast notification
          toast({
            title: "Achievement Unlocked!",
            description: achievement.title,
            variant: "default",
          });
        })
        .catch(err => console.error('Error fetching achievement details:', err));
    }
  }, [notifications, user]);

  // Listen for custom achievement events from showcase
  useEffect(() => {
    const handleAchievementEvent = (event: CustomEvent) => {
      const achievementData = event.detail.achievement;
      if (achievementData) {
        setCurrentAchievement(achievementData);
        setShowCelebration(true);
        triggerConfetti();
      }
    };

    // Add event listener with type assertion
    window.addEventListener('achievement-earned', 
      handleAchievementEvent as EventListener);
    
    return () => {
      window.removeEventListener('achievement-earned', 
        handleAchievementEvent as EventListener);
    };
  }, []);

  // Close celebration after delay
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 7000); // Show for 7 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  // Add mouse move listener for interactive effects
  useEffect(() => {
    const card = cardRef.current;
    if (!card || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation based on cursor position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 10; // Max 10 degrees
      const rotateX = ((centerY - y) / centerY) * 10; // Max 10 degrees
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      
      // Add subtle shine effect
      const shine = card.querySelector('.shine-effect') as HTMLElement;
      if (shine) {
        const percentage = {
          x: (x / rect.width) * 100,
          y: (y / rect.height) * 100
        };
        shine.style.background = `radial-gradient(circle at ${percentage.x}% ${percentage.y}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%)`;
      }
    };
    
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      const shine = card.querySelector('.shine-effect') as HTMLElement;
      if (shine) {
        shine.style.background = 'none';
      }
    };
    
    // Click handler for splatter effect
    const handleClick = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Add a new splatter effect
      setSplatterEffects(prev => [
        ...prev, 
        { id: splatterCounter.current++, position: { x, y } }
      ]);
      
      // Remove the oldest splatter effect if there are too many
      if (splatterEffects.length > 5) {
        setTimeout(() => {
          setSplatterEffects(prev => prev.slice(1));
        }, 100);
      }
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('click', handleClick);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('click', handleClick);
    };
  }, [showCelebration, isMobile, splatterEffects.length]);

  // Trigger confetti animation
  const triggerConfetti = () => {
    if (typeof window !== 'undefined') {
      const duration = 4 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0, 0.2) }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0, 0.2) }
        });
      }, 250);
    }
  };

  // Get icon based on achievement type
  const getAchievementIcon = () => {
    if (!currentAchievement) return <Trophy className="h-12 w-12 text-yellow-500" />;
    
    switch (currentAchievement.type) {
      case 'completion':
        return <Medal className="h-12 w-12 text-green-500" />;
      case 'streak':
        return <Zap className="h-12 w-12 text-blue-500" />;
      case 'milestone':
        return <Trophy className="h-12 w-12 text-yellow-500" />;
      case 'special':
        return <Star className="h-12 w-12 text-purple-500" />;
      default:
        return <Award className="h-12 w-12 text-yellow-500" />;
    }
  };

  // Determine the gradient based on achievement type
  const getGradientClass = () => {
    if (!currentAchievement) return "from-indigo-600 via-purple-600 to-pink-600";
    
    switch (currentAchievement.type) {
      case 'completion':
        return "from-emerald-500 via-teal-500 to-green-500";
      case 'streak':
        return "from-sky-500 via-blue-500 to-indigo-500";
      case 'milestone':
        return "from-amber-500 via-yellow-500 to-orange-500";
      case 'special':
        return "from-violet-500 via-purple-500 to-fuchsia-500";
      default:
        return "from-indigo-600 via-purple-600 to-pink-600";
    }
  };

  return (
    <AnimatePresence>
      {showCelebration && currentAchievement && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-10 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90vw] max-w-md"
        >
          <div 
            ref={cardRef}
            className={`
              relative overflow-hidden bg-gradient-to-r ${getGradientClass()} 
              p-[2px] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] 
              transition-transform duration-300 ease-out
              hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)]
              cursor-pointer w-full
            `}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="relative bg-background/80 backdrop-filter backdrop-blur-lg p-4 sm:p-6 rounded-lg flex flex-col items-center overflow-hidden transition-all duration-300 ease-out">
              {/* Shine effect overlay */}
              <div className="shine-effect absolute inset-0 w-full h-full pointer-events-none" />
              
              {/* Splatter effects */}
              {splatterEffects.map(splatter => (
                <SplatterEffect 
                  key={splatter.id} 
                  startPosition={splatter.position} 
                />
              ))}
              
              <Badge 
                variant="outline" 
                className="mb-2 bg-primary/10 shadow-inner backdrop-blur-sm z-10"
              >
                Achievement Unlocked!
              </Badge>
              
              <motion.div
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                className="my-3 p-3 bg-background/30 backdrop-blur-sm rounded-full shadow-lg z-10"
              >
                {getAchievementIcon()}
              </motion.div>
              
              <motion.h3
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-lg sm:text-xl font-bold text-center mb-1 sm:mb-2 text-white drop-shadow-md z-10"
              >
                {currentAchievement.title}
              </motion.h3>
              
              <motion.p
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-gray-100 text-sm sm:text-base text-center mb-3 sm:mb-4 max-w-xs z-10"
              >
                {currentAchievement.description}
              </motion.p>
              
              <motion.div
                variants={xpVariants}
                initial="hidden"
                animate="visible"
                className="text-amber-300 font-bold text-xl px-4 py-1 bg-black/20 rounded-full backdrop-blur-sm z-10"
              >
                +{currentAchievement.xp_reward} XP
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};