import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'solid';
  intensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  hoverEffect?: 'lift' | 'tilt' | 'both' | 'none';
  splatterOnClick?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  intensity = 'medium',
  interactive = true,
  hoverEffect = 'both',
  splatterOnClick = true,
  className,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [splatterEffects, setSplatterEffects] = useState<{id: number, position: {x: number, y: number}}[]>([]);
  const splatterCounter = useRef(0);

  // Apply the 3D tilt effect on mouse move
  useEffect(() => {
    const card = cardRef.current;
    if (!card || isMobile || !interactive || hoverEffect === 'none') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (hoverEffect === 'lift') return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation based on cursor position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 7; // Max 7 degrees
      const rotateX = ((centerY - y) / centerY) * 7; // Max 7 degrees
      
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
      if (!splatterOnClick) return;
      
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
    
    if (interactive) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('click', handleClick);
    }
    
    return () => {
      if (interactive) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
        card.removeEventListener('click', handleClick);
      }
    };
  }, [isMobile, interactive, hoverEffect, splatterOnClick, splatterEffects.length]);

  // Get background and border styles based on variant
  const getBackgroundStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20';
      case 'solid':
        return 'bg-background/90 border border-muted';
      default:
        return 'bg-background/40 border border-background/10';
    }
  };

  // Get backdrop blur intensity
  const getBlurIntensity = () => {
    switch (intensity) {
      case 'low':
        return 'backdrop-blur-sm';
      case 'high':
        return 'backdrop-blur-xl';
      default:
        return 'backdrop-blur-md';
    }
  };

  // Get hover effect styles
  const getHoverEffects = () => {
    if (!interactive) return '';
    
    switch (hoverEffect) {
      case 'lift':
        return 'hover:-translate-y-1 hover:shadow-xl';
      case 'tilt':
        return '';  // Tilt is handled via JavaScript
      case 'both':
        return 'hover:-translate-y-1 hover:shadow-xl';
      default:
        return '';
    }
  };

  // Splatter effect component
  const SplatterEffect = ({ startPosition }: { startPosition: { x: number, y: number } }) => {
    // Random color for splatter
    const splatterColors = [
      'rgba(255, 127, 80, 0.5)',
      'rgba(250, 218, 94, 0.5)',
      'rgba(138, 43, 226, 0.5)',
      'rgba(64, 224, 208, 0.5)',
      'rgba(50, 205, 50, 0.5)'
    ];
    
    const randomColor = splatterColors[Math.floor(Math.random() * splatterColors.length)];
    
    return (
      <motion.div
        initial={{ opacity: 1, scale: 0, x: startPosition.x, y: startPosition.y }}
        animate={{ opacity: 0, scale: 2.5 }}
        transition={{ duration: 0.7 }}
        className="absolute pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle, ${randomColor} 0%, transparent 70%)`,
          width: '50px',
          height: '50px',
          borderRadius: '50%'
        }}
      />
    );
  };

  return (
    <div 
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-xl shadow-md',
        getBackgroundStyles(),
        getBlurIntensity(),
        getHoverEffects(),
        'transition-all duration-300 ease-out',
        interactive ? 'cursor-pointer' : '',
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
      {...props}
    >
      {/* Inner content container */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shine effect overlay */}
      <div className="shine-effect absolute inset-0 w-full h-full pointer-events-none" />
      
      {/* Splatter effects */}
      {splatterEffects.map(splatter => (
        <SplatterEffect 
          key={splatter.id} 
          startPosition={splatter.position} 
        />
      ))}
    </div>
  );
};