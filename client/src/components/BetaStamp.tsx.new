import React from 'react';

/**
 * A simple, reliable beta stamp component that doesn't use complex animations
 * This ensures it always renders properly
 */
export interface BetaStampProps {
  className?: string;
}

export function BetaStamp({ className }: BetaStampProps) {
  return (
    <div className={`${className || 'fixed bottom-20 md:bottom-4 right-4 z-50'} h-20 w-20 md:h-24 md:w-24 cursor-pointer animate-pulse`}>
      <div className="relative w-full h-full">
        {/* Vector-based stamp circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-90 shadow-lg border-2 border-white/20"></div>
        
        {/* Text content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold tracking-wide rotate-[-12deg]">
          <span className="text-lg md:text-xl">BETA</span>
          <span className="text-[10px] md:text-xs mt-1">VERSION</span>
        </div>
        
        {/* Border embellishment */}
        <div className="absolute inset-2 border-2 border-dashed border-white/50 rounded-full"></div>
      </div>
    </div>
  );
}