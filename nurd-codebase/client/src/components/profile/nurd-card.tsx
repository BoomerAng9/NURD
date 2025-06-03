import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User } from '@shared/schema';
import type { HTMLAttributes } from 'react';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Zap, RadioTower, Users } from 'lucide-react';

interface NurdCardProps {
  user: User | undefined;  // Explicit union type instead of optional
  bridges?: number;
  houses?: number;
  level?: number;
  className?: string;
  techs?: string[];
  coreTraits?: string[];
  vibeAbilities?: string[];
  syncStatus?: 'ACTIVE' | 'OFFLINE' | 'TRAINING';
  description?: string;
  onConnect?: () => void;
  onDraft?: () => void;
}

export function NurdCard({
  user,
  bridges = 0,
  houses = 0,
  level = 1,
  className = '',
  techs = ['TECH SAGE'],
  coreTraits = ['VITALITY'],
  vibeAbilities = ['KINETIC FITNESS'],
  syncStatus = 'ACTIVE',
  description = 'A young innovator with boundless energy, always seeking the next big idea.',
  onConnect,
  onDraft
}: NurdCardProps) {
  const name = user?.first_name || 'NAME';
  const maxBridges = 4; // Number of bridges needed to make a house
  const filledHouses = Math.floor(bridges / maxBridges);
  const remainingBridges = bridges % maxBridges;
  
  // Get gradient colors based on level
  const getGradientColors = () => {
    if (level <= 3) return 'from-blue-500 to-cyan-400'; // Beginner
    if (level <= 6) return 'from-green-500 to-emerald-400'; // Intermediate
    if (level <= 9) return 'from-purple-500 to-violet-400'; // Advanced
    return 'from-amber-500 to-orange-400'; // Expert
  };
  
  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      {/* Futuristic card with glowing border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-30 animate-pulse"></div>
      <div className="relative bg-black rounded-xl overflow-hidden border-2 border-cyan-400 p-0.5">
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          {/* Header with name */}
          <div className="relative">
            <div className="bg-gradient-to-r from-orange-700 to-amber-600 p-2 flex justify-between items-center">
              <h3 className="text-orange-100 font-bold text-xl px-2">{name}</h3>
              
              {/* Level indicator */}
              <div className="flex items-center gap-2">
                <span className="text-orange-100 text-sm">LEVEL</span>
                <span className="text-yellow-300 font-bold text-xl">{level}</span>
              </div>
            </div>
            
            {/* Avatar Section - In a real app, you'd display the actual avatar here */}
            <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              {user?.avatar_svg ? (
                <div dangerouslySetInnerHTML={{ __html: user.avatar_svg }} />
              ) : (
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
                  <span className="text-6xl text-white font-bold">{name.charAt(0)}</span>
                </div>
              )}
              
              {/* Glow effects */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-orange-500/20 to-transparent"></div>
            </div>
          </div>
          
          {/* Class & Traits Section */}
          <div className="p-2 bg-black">
            <div className="grid grid-cols-2 gap-1 mb-2">
              <div className="flex flex-col">
                <span className="text-cyan-400 text-xs uppercase">CLASS</span>
                <span className="text-yellow-300 font-bold text-lg">{techs[0]}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-cyan-400 text-xs uppercase">CORE TRAIT</span>
                <span className="text-yellow-300 font-bold text-lg">{coreTraits[0]}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1 mb-2">
              <div className="flex flex-col">
                <span className="text-cyan-400 text-xs uppercase">VIBE ABILITY</span>
                <span className="text-yellow-300 font-bold text-lg">{vibeAbilities[0]}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-cyan-400 text-xs uppercase">NURD SYNC STATUS</span>
                <span className={`font-bold text-lg ${
                  syncStatus === 'ACTIVE' ? 'text-green-400' : 
                  syncStatus === 'TRAINING' ? 'text-blue-400' : 'text-gray-400'
                }`}>{syncStatus}</span>
              </div>
            </div>
            
            {/* Bridge Building Progress */}
            <div className="mt-2 mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-cyan-400 text-xs">BRIDGE PROGRESS</span>
                <span className="text-cyan-400 text-xs">{bridges}/{maxBridges * (houses + 1)}</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${getGradientColors()}`}
                  style={{ width: `${(remainingBridges / maxBridges) * 100}%` }}
                ></div>
              </div>
              
              {/* Houses Built */}
              {filledHouses > 0 && (
                <div className="mt-2">
                  <span className="text-cyan-400 text-xs">HOUSES BUILT: {filledHouses}</span>
                  <div className="flex mt-1 gap-1">
                    {Array.from({ length: filledHouses }).map((_, i) => (
                      <div key={i} className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-600 rounded-sm flex items-center justify-center">
                        <span className="text-xs text-white">⌂</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Description */}
            <p className="text-gray-200 text-sm my-2">{description}</p>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button 
                onClick={onConnect}
                className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-400 py-2 px-4 rounded-md transition-colors"
              >
                TAP TO CONNECT
              </button>
              
              <button 
                onClick={onDraft}
                className="bg-orange-950 hover:bg-orange-900 border border-orange-400 text-orange-400 py-2 px-4 rounded-md transition-colors"
              >
                SWIPE TO DRAFT
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Glowing corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
    </div>
  );
}