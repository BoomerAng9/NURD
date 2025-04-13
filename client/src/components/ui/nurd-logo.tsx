import React from 'react';
import greenLogo from '@assets/2C98236B-53D8-48A4-9DB3-E47C7540F061.png';
import blueLogo from '@assets/D99F2978-B63A-4C6D-965A-FF2112479490.png';
import camoLogo from '@assets/7A376D52-0A97-45E2-AA29-8DE667BD2CD3.png';

type NurdLogoProps = {
  variant?: 'default' | 'large' | 'small';
  color?: 'green' | 'blue' | 'camo' | 'white';
  showTagline?: boolean;
  className?: string;
};

const NurdLogo: React.FC<NurdLogoProps> = ({ 
  variant = 'default',
  color = 'green',
  showTagline = false,
  className = ''
}) => {
  // Logo mapping
  const logoMap = {
    green: greenLogo,
    blue: blueLogo,
    camo: camoLogo,
    white: greenLogo, // Default to green for white (could create a white version)
  };

  // Size mapping
  const sizeMap = {
    small: 'h-6 md:h-8',
    default: 'h-8 md:h-10',
    large: 'h-12 md:h-16',
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <img 
          src={logoMap[color]} 
          alt="NURD Logo" 
          className={`${sizeMap[variant]} w-auto object-contain`}
        />
        
        {showTagline && (
          <div className="text-sm text-gray-400 mt-2 font-normal">
            Naturally Unstoppable Resourceful Dreamers
          </div>
        )}
      </div>
    </div>
  );
};

export default NurdLogo;
