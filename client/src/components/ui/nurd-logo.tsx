import React from 'react';

type NurdLogoProps = {
  variant?: 'default' | 'large' | 'small';
  color?: 'green' | 'blue' | 'purple' | 'white';
  showTagline?: boolean;
  className?: string;
};

const NurdLogo: React.FC<NurdLogoProps> = ({ 
  variant = 'default',
  color = 'green',
  showTagline = false,
  className = ''
}) => {
  // Color mapping
  const colorMap = {
    green: 'text-[#22C55E]',
    blue: 'text-[#3B82F6]',
    purple: 'text-[#8B5CF6]',
    white: 'text-white',
  };

  // Size mapping
  const sizeMap = {
    small: 'text-xl',
    default: 'text-2xl',
    large: 'text-4xl',
  };

  // Drip color mapping
  const dripColorMap = {
    green: 'bg-[#F97316]', // Orange drip for green logo
    blue: 'bg-[#F97316]',  // Orange drip for blue logo
    purple: 'bg-[#22C55E]', // Green drip for purple logo
    white: 'bg-[#F97316]',  // Orange drip for white logo
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <span className={`font-accent font-bold tracking-tight ${colorMap[color]} ${sizeMap[variant]}`}>
          NURD
        </span>
        <span className="w-2 h-2 bg-[#22C55E] rounded-full ml-1 mt-0 inline-block animate-pulse-slow"></span>
        
        {showTagline && (
          <div className="text-sm text-gray-400 mt-1 font-normal">
            Naturally Unstoppable Resourceful Dreamers
          </div>
        )}
      </div>
      <div className="absolute -bottom-3 left-0 w-full">
        <div className={`h-1.5 ${dripColorMap[color]} rounded-full w-full animate-drip`}></div>
      </div>
    </div>
  );
};

export default NurdLogo;
