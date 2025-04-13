import React from 'react';

type DripEffectProps = {
  color?: 'green' | 'blue' | 'purple' | 'orange';
  count?: number;
  className?: string;
};

const DripEffect: React.FC<DripEffectProps> = ({ 
  color = 'green',
  count = 6,
  className = ''
}) => {
  // Color mapping
  const colorMap = {
    green: '#22C55E',
    blue: '#3B82F6',
    purple: '#8B5CF6',
    orange: '#F97316',
  };

  // Generate random position, size and delay for each drip
  const generateDrips = () => {
    const drips = [];
    for (let i = 0; i < count; i++) {
      const leftPosition = Math.floor(Math.random() * 100);
      const width = Math.floor(Math.random() * 5) + 8; // 8-12px
      const height = Math.floor(Math.random() * 7) + 12; // 12-18px
      const delay = Math.random() * 1.5; // 0-1.5s delay
      
      drips.push({
        left: `${leftPosition}%`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: colorMap[color],
        animationDelay: `${delay}s`,
      });
    }
    return drips;
  };

  const drips = generateDrips();

  return (
    <div className={`absolute bottom-0 left-0 right-0 h-8 overflow-hidden ${className}`}>
      {drips.map((dripStyle, index) => (
        <div 
          key={index}
          className="absolute bottom-0 drip"
          style={dripStyle}
        />
      ))}
    </div>
  );
};

export default DripEffect;
