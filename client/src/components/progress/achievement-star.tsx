import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Star, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Achievement } from '@shared/progress-schema';

interface AchievementStarProps {
  achievement: Achievement;
  isEarned?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | 'left' | 'right';
}

export function AchievementStar({
  achievement,
  isEarned = false,
  onClick,
  size = 'md',
  showTooltip = true,
  position = 'top-right'
}: AchievementStarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const positionClasses = {
    'top-left': 'top-[-8px] left-[-8px]',
    'top-right': 'top-[-8px] right-[-8px]',
    'bottom-left': 'bottom-[-8px] left-[-8px]',
    'bottom-right': 'bottom-[-8px] right-[-8px]',
    'top': 'top-[-8px] left-1/2 transform -translate-x-1/2',
    'bottom': 'bottom-[-8px] left-1/2 transform -translate-x-1/2',
    'left': 'left-[-8px] top-1/2 transform -translate-y-1/2',
    'right': 'right-[-8px] top-1/2 transform -translate-y-1/2'
  };
  
  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24
  };
  
  const colorVariants = {
    'milestone': 'from-amber-400 to-amber-600',
    'completion': 'from-emerald-400 to-emerald-600',
    'streak': 'from-purple-400 to-purple-600',
    'special': 'from-blue-400 to-blue-600',
    'default': 'from-gray-400 to-gray-600'
  };
  
  const getColorClass = () => {
    if (!isEarned) return 'from-gray-500 to-gray-700';
    return colorVariants[achievement.type as keyof typeof colorVariants] || colorVariants.default;
  };
  
  const starElement = (
    <motion.div
      whileHover={{ scale: 1.2, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        sizeClasses[size],
        positionClasses[position],
        "absolute rounded-full flex items-center justify-center cursor-pointer z-10 shadow-lg",
        "bg-gradient-to-r",
        getColorClass(),
        !isEarned && "opacity-50"
      )}
      style={{
        clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
      }}
    >
      {isEarned && (
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.5, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop"
          }}
          style={{
            clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
        />
      )}
      {!isEarned && (
        <Lock 
          size={iconSizes[size]} 
          className="text-white/70" 
        />
      )}
    </motion.div>
  );
  
  if (!showTooltip) return starElement;
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          {starElement}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="bg-black/80 border-gray-700 text-white p-3 max-w-[200px]"
        >
          <div className="text-center">
            <div className={cn(
              "text-xs font-bold mb-1",
              isEarned ? "text-yellow-400" : "text-gray-400"
            )}>
              {achievement.type.toUpperCase()}
            </div>
            <h3 className="font-bold mb-1">{achievement.title}</h3>
            <p className="text-xs text-gray-300">{achievement.description}</p>
            {isEarned ? (
              <div className="mt-1 text-xs font-semibold text-emerald-400">UNLOCKED</div>
            ) : (
              <div className="mt-1 text-xs text-gray-400">
                {achievement.requirement}: {achievement.requirement_value}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}