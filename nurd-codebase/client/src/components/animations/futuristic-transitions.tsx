import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components for animated transitions and UI elements

interface FuturisticContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// A container with a futuristic glowing border effect
export const FuturisticContainer: React.FC<FuturisticContainerProps> = ({ 
  children, 
  className = '',
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative rounded-lg overflow-hidden ${className}`}
    >
      {/* Animated glowing border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-30 animate-pulse"></div>
      
      {/* Inner shadow container for 3D effect */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden p-4 z-10 shadow-lg">
        {children}
      </div>
      
      {/* Corner accents for sci-fi look */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-400"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-400"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-400"></div>
    </motion.div>
  );
};

interface FadeInProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
  distance?: number;
}

// Component for fade-in animations with directional movement
export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.5, 
  className = '',
  distance = 50
}) => {
  const getInitialPosition = () => {
    switch(direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return { y: distance };
    }
  };
  
  const initialPosition = getInitialPosition();
  
  return (
    <motion.div
      initial={{ opacity: 0, ...initialPosition }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  scale?: number;
}

// Component for scale-in animations
export const ScaleIn: React.FC<ScaleInProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className = '',
  scale = 0.8
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface CyberButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

// Futuristic button with glow effects and animations
export const CyberButton: React.FC<CyberButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  size = 'md',
  disabled = false
}) => {
  // Define variant styles
  const getVariantStyles = () => {
    switch(variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-blue-400';
      case 'secondary':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-purple-400';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 border-red-400';
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-green-400';
      default:
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-blue-400';
    }
  };
  
  // Define size styles
  const getSizeStyles = () => {
    switch(size) {
      case 'sm': return 'py-1 px-3 text-sm';
      case 'md': return 'py-2 px-4 text-base';
      case 'lg': return 'py-3 px-6 text-lg';
      default: return 'py-2 px-4 text-base';
    }
  };
  
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative rounded-md font-medium text-white border shadow-lg transition-all ${variantStyles} ${sizeStyles} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Button text with glow effect */}
      <span className="relative z-10 flex items-center justify-center drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]">
        {children}
      </span>
      
      {/* Accent corner designs */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r"></div>
    </motion.button>
  );
};

interface GlowingTextProps {
  text: string;
  className?: string;
  glowColor?: string;
  textColor?: string;
}

// Text with animated glowing effect
export const GlowingText: React.FC<GlowingTextProps> = ({ 
  text, 
  className = '',
  glowColor = 'blue',
  textColor = 'white'
}) => {
  const getGlowColor = () => {
    switch(glowColor) {
      case 'blue': return 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.7)]';
      case 'purple': return 'text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.7)]';
      case 'cyan': return 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]';
      case 'green': return 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.7)]';
      case 'orange': return 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.7)]';
      default: return 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.7)]';
    }
  };
  
  const getTextColor = () => {
    switch(textColor) {
      case 'white': return 'text-white';
      case 'blue': return 'text-blue-100';
      case 'purple': return 'text-purple-100';
      case 'green': return 'text-green-100';
      default: return 'text-white';
    }
  };
  
  const glowStyle = getGlowColor();
  const textStyle = getTextColor();
  
  return (
    <span className={`font-bold ${glowStyle} ${textStyle} ${className} transition-all duration-300`}>
      {text}
    </span>
  );
};

interface AnimatedRouteProps {
  children: ReactNode;
  location: string;
}

// Wrapper for page transitions when changing routes
export const AnimatedRoute: React.FC<AnimatedRouteProps> = ({ children, location }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

interface DataStreamEffectProps {
  active?: boolean;
  speed?: 'slow' | 'medium' | 'fast';
  density?: 'low' | 'medium' | 'high';
  color?: string;
  className?: string;
}

// Visual effect to create a "data stream" background animation
export const DataStreamEffect: React.FC<DataStreamEffectProps> = ({ 
  active = true, 
  speed = 'medium',
  density = 'medium',
  color = 'blue',
  className = ''
}) => {
  const [streams, setStreams] = useState<{x: number, length: number, speed: number, delay: number}[]>([]);
  
  // Get speed settings
  const getSpeedValue = () => {
    switch(speed) {
      case 'slow': return { min: 2, max: 5 };
      case 'medium': return { min: 1, max: 3 };
      case 'fast': return { min: 0.5, max: 1.5 };
      default: return { min: 1, max: 3 };
    }
  };
  
  // Get density value
  const getDensityCount = () => {
    switch(density) {
      case 'low': return 15;
      case 'medium': return 25;
      case 'high': return 40;
      default: return 25;
    }
  };
  
  // Get color style
  const getColorStyle = () => {
    switch(color) {
      case 'blue': return 'bg-blue-500';
      case 'purple': return 'bg-purple-500';
      case 'cyan': return 'bg-cyan-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };
  
  const speedSettings = getSpeedValue();
  const streamCount = getDensityCount();
  const colorStyle = getColorStyle();
  
  // Initialize data streams
  useEffect(() => {
    if (active) {
      const newStreams = Array.from({ length: streamCount }, () => ({
        x: Math.random() * 100, // Random horizontal position (%)
        length: 5 + Math.random() * 15, // Random length
        speed: speedSettings.min + Math.random() * (speedSettings.max - speedSettings.min),
        delay: Math.random() * 2 // Random start delay
      }));
      
      setStreams(newStreams);
    } else {
      setStreams([]);
    }
  }, [active, speed, density]);
  
  if (!active) return null;
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {streams.map((stream, index) => (
        <motion.div
          key={index}
          className={`absolute w-px opacity-70 ${colorStyle}`}
          style={{
            left: `${stream.x}%`,
            height: `${stream.length}%`,
          }}
          initial={{ y: -stream.length - 10 }}
          animate={{ y: '100%' }}
          transition={{
            duration: stream.speed,
            repeat: Infinity,
            delay: stream.delay,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};

interface HologramEffectProps {
  children: ReactNode;
  active?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

// Visual effect to create a hologram-like appearance for content
export const HologramEffect: React.FC<HologramEffectProps> = ({ 
  children, 
  active = true,
  intensity = 'medium',
  className = ''
}) => {
  // Get intensity value for the effect
  const getIntensityStyle = () => {
    switch(intensity) {
      case 'low': return 'opacity-20 blur-[0.3px]';
      case 'medium': return 'opacity-30 blur-[0.5px]';
      case 'high': return 'opacity-40 blur-[0.7px]';
      default: return 'opacity-30 blur-[0.5px]';
    }
  };
  
  const intensityStyle = getIntensityStyle();
  
  return (
    <div className={`relative ${className}`}>
      {/* Original content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Hologram effect layers */}
      {active && (
        <>
          <div className={`absolute inset-0 z-0 bg-cyan-500 ${intensityStyle} animate-pulse`}>
            {children}
          </div>
          
          {/* Scanlines effect */}
          <div className="absolute inset-0 z-20 pointer-events-none bg-repeat-y bg-[length:100%_4px] mix-blend-overlay opacity-10" 
            style={{ backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)' }}>
          </div>
          
          {/* Flickering effect */}
          <motion.div 
            className="absolute inset-0 z-20 pointer-events-none bg-cyan-400 mix-blend-overlay"
            animate={{ opacity: [0, 0.03, 0, 0.02, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
          />
        </>
      )}
    </div>
  );
};

export const FlickeringText: React.FC<{ text: string, className?: string }> = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState(text);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const startFlicker = () => {
      interval = setInterval(() => {
        // 1 in 10 chance to replace a character
        if (Math.random() < 0.1) {
          const index = Math.floor(Math.random() * text.length);
          const randomChar = String.fromCharCode(33 + Math.floor(Math.random() * 94)); // ASCII visible chars
          
          const newText = displayText.substring(0, index) + randomChar + displayText.substring(index + 1);
          setDisplayText(newText);
          
          // Reset back to original after a brief delay
          setTimeout(() => {
            setDisplayText(text);
          }, 100);
        }
      }, 200);
    };
    
    startFlicker();
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [text]);
  
  return (
    <span className={`font-mono ${className}`}>{displayText}</span>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

// Futuristic loading spinner
export const FuturisticSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  color = 'blue',
  className = ''
}) => {
  // Get size value
  const getSizeStyle = () => {
    switch(size) {
      case 'sm': return 'w-8 h-8';
      case 'md': return 'w-12 h-12';
      case 'lg': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };
  
  // Get color style
  const getColorStyle = () => {
    switch(color) {
      case 'blue': return 'border-blue-500';
      case 'purple': return 'border-purple-500';
      case 'cyan': return 'border-cyan-500';
      case 'green': return 'border-green-500';
      default: return 'border-blue-500';
    }
  };
  
  const sizeStyle = getSizeStyle();
  const colorStyle = getColorStyle();
  
  return (
    <div className={`relative ${sizeStyle} ${className}`}>
      {/* Outer ring */}
      <motion.div 
        className={`absolute inset-0 rounded-full border-2 ${colorStyle} opacity-30`}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Middle ring */}
      <motion.div 
        className={`absolute inset-[4px] rounded-full border-2 ${colorStyle} opacity-50`}
        animate={{ rotate: -180 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner ring */}
      <motion.div 
        className={`absolute inset-[8px] rounded-full border-2 ${colorStyle} opacity-70`}
        animate={{ rotate: 270 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Center dot */}
      <motion.div 
        className={`absolute inset-0 m-auto w-2 h-2 rounded-full bg-${color}-500`}
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
};