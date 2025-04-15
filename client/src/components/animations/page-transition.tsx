import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

interface PageTransitionProps {
  children: React.ReactNode;
  mode?: 'fade' | 'slide' | 'scale' | 'glass-shuffle';
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slide: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
    transition: { duration: 0.4, ease: 'easeInOut' }
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { duration: 0.3 }
  },
  'glass-shuffle': {
    initial: { opacity: 0, rotateY: -15, scale: 0.95, y: 10 },
    animate: { opacity: 1, rotateY: 0, scale: 1, y: 0 },
    exit: { opacity: 0, rotateY: 15, scale: 0.95, y: -10 },
    transition: { 
      duration: 0.5, 
      ease: [0.19, 1, 0.22, 1] 
    }
  }
};

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  mode = 'glass-shuffle'
}) => {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={variants[mode].initial}
        animate={variants[mode].animate}
        exit={variants[mode].exit}
        transition={variants[mode].transition}
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          width: '100%'
        }}
        className="page-container"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};