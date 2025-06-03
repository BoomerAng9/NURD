import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { User, Achievement } from '@shared/progress-schema';
import { Button } from '@/components/ui/button';
import { AchievementStar } from './achievement-star';

interface NurdProfileCardProps {
  user: User;
  achievements?: (Achievement & { isEarned: boolean })[];
  onConnect?: () => void;
  onDraft?: () => void;
  className?: string;
}

export function NurdProfileCard({
  user,
  achievements = [],
  onConnect,
  onDraft,
  className
}: NurdProfileCardProps) {
  // Only show up to 5 achievements on the card
  const displayedAchievements = achievements.slice(0, 5);
  
  // Positions for up to 5 stars
  const starPositions = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'top'
  ] as const;
  
  // Get class from user type
  const getClassTitle = () => {
    const classMap: Record<string, string> = {
      'student': 'JUNIOR TECHIE',
      'developer': 'CODE MAGE',
      'designer': 'DESIGN ARTIST',
      'parent': 'GUIDANCE SAGE',
      'admin': 'ADMIN ORACLE'
    };
    
    return classMap[user.user_type.toLowerCase()] || 'JUNIOR TECHIE';
  };
  
  // Core trait based on XP
  const getCoreTrait = () => {
    const xp = user.xp_points || 0;
    
    if (xp > 1000) return 'MASTERY';
    if (xp > 500) return 'VITALITY';
    if (xp > 250) return 'WISDOM';
    if (xp > 100) return 'CURIOSITY';
    return 'POTENTIAL';
  };
  
  // Vibe ability based on path choice
  const getVibeAbility = () => {
    const pathMap: Record<string, string> = {
      'coding': 'DIGITAL CREATION',
      'design': 'VISUAL HARMONY',
      'leadership': 'TEAM SYNERGY',
      'innovation': 'IDEA GENESIS',
      'business': 'STRATEGY FLOW'
    };
    
    return pathMap[user.path_choice?.toLowerCase() || ''] || 'KINETIC FITNESS';
  };
  
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "relative w-[300px] md:w-[320px] rounded-xl overflow-hidden",
        "bg-gradient-to-b from-gray-900 to-black",
        "border-2 border-cyan-500/70",
        "shadow-lg shadow-cyan-500/20",
        className
      )}
    >
      {/* Achievement stars */}
      {displayedAchievements.map((achievement, index) => (
        <AchievementStar
          key={achievement.id}
          achievement={achievement}
          isEarned={achievement.isEarned}
          position={starPositions[index % starPositions.length]}
          showTooltip
        />
      ))}
      
      {/* Character name plate */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-gradient-to-r from-orange-800 to-orange-900 px-4 py-1 rounded-md border border-orange-600">
          <span className="text-orange-500 font-bold tracking-wider">
            {user.first_name?.toUpperCase() || 'NAME'}
          </span>
        </div>
      </div>
      
      {/* Profile image area */}
      <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-orange-900/50 to-cyan-900/30">
        {user.avatar_svg ? (
          <div 
            className="w-full h-full flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: user.avatar_svg }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* Fallback default avatar */}
            <div className="w-3/4 h-3/4 bg-gradient-to-br from-orange-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
              <span className="text-6xl font-bold text-cyan-500/50">
                {user.first_name?.[0]?.toUpperCase() || 'N'}
              </span>
            </div>
          </div>
        )}
        
        {/* Glow effect at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-orange-500/30 to-transparent" />
      </div>
      
      {/* Card info */}
      <div className="bg-black px-4 pt-2 pb-4">
        {/* Level and class row */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-orange-700 font-bold">CLASS</div>
            <div className="text-yellow-400 font-bold tracking-wider">{getClassTitle()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-orange-700 font-bold">LEVEL</div>
            <div className="text-orange-500 font-bold text-xl tracking-wider">{user.level || 1}</div>
          </div>
        </div>
        
        {/* Core trait and vibe ability */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <div className="text-xs text-cyan-500 font-bold">CORE TRAIT</div>
            <div className="text-yellow-500 font-bold tracking-wider">{getCoreTrait()}</div>
          </div>
          <div>
            <div className="text-xs text-cyan-500 font-bold">VIBE ABILITY</div>
            <div className="text-yellow-500 font-bold tracking-wider">{getVibeAbility()}</div>
          </div>
        </div>
        
        {/* Sync status and bio */}
        <div className="mt-2">
          <div className="flex justify-between items-center">
            <div className="text-xs text-cyan-500 font-bold">NURD SYNC STATUS</div>
            <div className="text-yellow-400 font-bold">ACTIVE</div>
          </div>
          <p className="text-white/80 text-sm mt-1">
            {user.avatar_data?.bio || 
             "A young innovator with boundless energy, always seeking the next big idea."}
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button
            onClick={onConnect}
            className="bg-cyan-900 hover:bg-cyan-800 text-cyan-400 border border-cyan-700"
          >
            TAP TO CONNECT
          </Button>
          <Button
            onClick={onDraft}
            className="bg-orange-900 hover:bg-orange-800 text-orange-400 border border-orange-700"
          >
            SWIPE TO DRAFT
          </Button>
        </div>
      </div>
    </motion.div>
  );
}