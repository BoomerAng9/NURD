import React, { ReactNode, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { useLocation } from "wouter";
import * as transitions from '../../animations/transitions';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  transitionType?: 'fade' | 'slide' | 'scale' | 'slideUp' | 'slideInLeft' | 'slideInRight';
  duration?: number;
  delay?: number;
}

// Default page transition variants
const defaultVariants: Variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { 
    opacity: 1, 
    x: 0, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut" 
    }
  },
  exit: { 
    opacity: 0, 
    x: 0, 
    y: 20,
    transition: { 
      duration: 0.3,
      ease: "easeIn" 
    }
  }
};

export function PageTransition({ 
  children, 
  className = "h-full flex-1", 
  transitionType = 'slideUp',
  duration,
  delay = 0 
}: PageTransitionProps) {
  const [location] = useLocation();
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Select the appropriate transition variant based on transitionType
  const getVariant = (): Variants => {
    switch (transitionType) {
      case 'fade':
        return transitions.fadeIn;
      case 'slideUp':
        return transitions.slideUpFade;
      case 'slideInLeft':
        return transitions.slideInLeft;
      case 'slideInRight':
        return transitions.slideInRight;
      case 'scale':
        return transitions.scaleUp;
      default:
        return defaultVariants;
    }
  };

  // Custom transition timing if specified
  const getTransition = () => {
    if (!duration) return {};
    
    return {
      transition: { 
        duration, 
        delay,
        ease: "easeOut"
      }
    };
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible" // Changed from "enter" to "visible" for consistency
      exit="exit"
      variants={getVariant()}
      {...getTransition()}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Maintained for backward compatibility
export function SlideTransition({ children, className = "h-full flex-1", duration = 0.4 }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={transitions.slideInRight}
      transition={{ 
        duration,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Maintained for backward compatibility
export function FadeTransition({ children, className = "h-full flex-1", duration = 0.4 }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={transitions.fadeIn}
      transition={{ 
        duration,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Maintained for backward compatibility
export function ScaleTransition({ children, className = "h-full flex-1", duration = 0.4 }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={transitions.scaleUp}
      transition={{ 
        duration,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}