import React from 'react';
import { cn } from '@/lib/utils';
import { Achievement } from '@shared/progress-schema';
import { motion } from 'framer-motion';
import { Trophy, Lock, Award } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AchievementBadgeProps {
  achievement: Achievement;
  isEarned?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function AchievementBadge({
  achievement,
  isEarned = false,
  onClick,
  size = 'md',
  showTooltip = true
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };
  
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 48
  };
  
  const badge = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        sizeClasses[size],
        "relative rounded-full flex items-center justify-center cursor-pointer",
        isEarned 
          ? "bg-gradient-to-br from-amber-300 to-amber-600" 
          : "bg-gradient-to-br from-slate-500/50 to-slate-700/50",
        !isEarned && "grayscale opacity-50",
        onClick && "cursor-pointer"
      )}
    >
      {achievement.image_url ? (
        <img 
          src={achievement.image_url} 
          alt={achievement.title}
          className="w-[80%] h-[80%] object-contain rounded-full"
        />
      ) : (
        isEarned ? (
          <Trophy className="text-white" size={iconSizes[size]} />
        ) : (
          <Lock className="text-white" size={iconSizes[size]} />
        )
      )}
      
      {/* Border animation for earned badges */}
      {isEarned && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-yellow-300"
          initial={{ opacity: 0.5 }}
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}
      
      {/* Small badge icon on bottom right */}
      <div className={cn(
        "absolute -bottom-1 -right-1 rounded-full p-1",
        size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10',
        isEarned ? "bg-emerald-500" : "bg-slate-700"
      )}>
        {isEarned ? (
          <Award size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} className="text-white" />
        ) : (
          <Lock size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} className="text-white" />
        )}
      </div>
    </motion.div>
  );
  
  if (!showTooltip) return badge;
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent side="top" className="p-4 max-w-[240px]">
          <div className="text-center">
            <h3 className="font-bold mb-1">{achievement.title}</h3>
            <p className="text-sm">{achievement.description}</p>
            {isEarned && (
              <span className="inline-block mt-2 text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                Earned
              </span>
            )}
            {!isEarned && !achievement.is_hidden && (
              <p className="text-xs mt-2 text-slate-400">
                {achievement.requirement}: {achievement.requirement_value}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}