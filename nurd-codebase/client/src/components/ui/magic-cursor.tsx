import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { DetailedHTMLProps, StyleHTMLAttributes } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface CursorState {
  active: boolean;
  hovered: boolean;
  clicked: boolean;
  hidden: boolean;
  text: string;
}

interface ParticleProps {
  x: number;
  y: number;
  index: number;
  color: string;
}

// Particle component for cursor trail
const Particle: React.FC<ParticleProps> = ({ x, y, index, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0.7, scale: 0.5 }}
      animate={{ 
        opacity: 0, 
        scale: 0, 
        x: x + Math.random() * 20 - 10,
        y: y + Math.random() * 20 - 10
      }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      style={{
        position: 'fixed',
        top: y,
        left: x,
        height: Math.max(4, 10 - index * 1),
        width: Math.max(4, 10 - index * 1),
        borderRadius: '50%',
        backgroundColor: color,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );
};

// Main magic cursor component
export const MagicCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // Use motion values for smoother animation with spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  
  // State for cursor appearance and behavior
  const [cursorState, setCursorState] = useState<CursorState>({
    active: false,
    hovered: false,
    clicked: false,
    hidden: false,
    text: '',
  });
  
  // Trail particles
  const [particles, setParticles] = useState<CursorPosition[]>([]);
  const [prevPosition, setPrevPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [showParticles, setShowParticles] = useState(false);
  
  // Colors for particle trail
  const cursorColors = [
    '#3DE053', // nurd green
    '#3EC6E0', // nurd blue
    '#6A2FF8', // nurd purple
    '#FF8A00', // nurd orange
  ];
  
  const getRandomColor = () => {
    return cursorColors[Math.floor(Math.random() * cursorColors.length)];
  };

  useEffect(() => {
    // Handle cursor movement
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      // Update framer motion values
      mouseX.set(clientX);
      mouseY.set(clientY);
      
      // Calculate distance moved for particle spawning
      const dx = Math.abs(clientX - prevPosition.x);
      const dy = Math.abs(clientY - prevPosition.y);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only spawn particles when moving fast enough
      if (distance > 10 && showParticles) {
        // Add new particle
        setParticles(prev => {
          const newParticles = [...prev, { x: clientX, y: clientY }];
          // Keep only last 10 particles
          return newParticles.slice(-10);
        });
      }
      
      setPrevPosition({ x: clientX, y: clientY });
    };
    
    // Handle cursor clicks
    const handleMouseDown = () => {
      setCursorState(prev => ({ ...prev, clicked: true }));
      // Clear particles on click for cleaner effects
      setParticles([]);
    };
    
    const handleMouseUp = () => {
      setCursorState(prev => ({ ...prev, clicked: false }));
    };
    
    // Hide cursor when it leaves the window
    const handleMouseLeave = () => {
      setCursorState(prev => ({ ...prev, hidden: true }));
    };
    
    const handleMouseEnter = () => {
      setCursorState(prev => ({ ...prev, hidden: false }));
    };
    
    // Check for interactive elements under cursor
    const handleElementDetection = () => {
      const hoveredElement = document.elementFromPoint(prevPosition.x, prevPosition.y);
      
      if (hoveredElement) {
        const isClickable = 
          hoveredElement.tagName === 'BUTTON' ||
          hoveredElement.tagName === 'A' ||
          hoveredElement.tagName === 'INPUT' ||
          hoveredElement.tagName === 'TEXTAREA' ||
          hoveredElement.tagName === 'SELECT' ||
          hoveredElement.classList.contains('cursor-pointer') ||
          hoveredElement.classList.contains('btn-nurd') ||
          (hoveredElement.parentElement && 
            (hoveredElement.parentElement.tagName === 'BUTTON' || 
            hoveredElement.parentElement.tagName === 'A' ||
            hoveredElement.parentElement.classList.contains('cursor-pointer') ||
            hoveredElement.parentElement.classList.contains('btn-nurd')));
        
        // Handle text attribute for cursor labels
        const cursorText = hoveredElement.getAttribute('data-cursor-text') || 
          (hoveredElement.parentElement && hoveredElement.parentElement.getAttribute('data-cursor-text')) || '';
          
        setCursorState(prev => ({
          ...prev,
          active: Boolean(isClickable),
          hovered: Boolean(isClickable),
          text: cursorText
        }));
        
        // Enable particle trail on interactive elements
        setShowParticles(Boolean(isClickable));
      } else {
        setCursorState(prev => ({
          ...prev,
          active: false,
          hovered: false,
          text: ''
        }));
        setShowParticles(false);
      }
    };
    
    // Set up event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Checking for elements on a timer to avoid performance issues from doing it on every mousemove
    const detectionInterval = setInterval(handleElementDetection, 100);
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      clearInterval(detectionInterval);
    };
  }, [mouseX, mouseY, prevPosition, showParticles]);
  
  // We don't want the cursor on mobile devices
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);
  
  if (isMobile) return null;
  
  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: -10,
          top: -10,
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            scale: cursorState.clicked ? 0.7 : cursorState.hovered ? 1.5 : 1,
            opacity: cursorState.hidden ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
        >
          <div 
            className={`w-5 h-5 rounded-full backdrop-blur-sm flex items-center justify-center ${
              cursorState.hovered ? 'bg-primary/80' : 'bg-white/80 border border-gray-300/30'
            }`}
          >
            {cursorState.hovered && (
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            )}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Cursor ring/outline */}
      <motion.div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: -24,
          top: -24,
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            scale: cursorState.clicked ? 0.6 : cursorState.hovered ? 1.2 : 1,
            opacity: cursorState.hidden ? 0 : cursorState.hovered ? 0.6 : 0.3,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div 
            className={`w-12 h-12 rounded-full border-2 ${
              cursorState.hovered ? 'border-primary' : 'border-gray-400'
            }`}
          ></div>
        </motion.div>
      </motion.div>
      
      {/* Cursor text (when data-cursor-text is present) */}
      {cursorState.text && (
        <motion.div
          ref={textRef}
          className="fixed pointer-events-none z-[9997] bg-black/80 text-white text-xs px-2 py-1 rounded"
          style={{
            x: cursorX, 
            y: cursorY,
            translateX: '-50%',
            translateY: '-40px',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {cursorState.text}
        </motion.div>
      )}
      
      {/* Cursor particles/trail */}
      {particles.map((particle, index) => (
        <Particle 
          key={`p-${index}-${particle.x}-${particle.y}`}
          x={particle.x}
          y={particle.y}
          index={index}
          color={getRandomColor()}
        />
      ))}
      
      {/* Global style to hide default cursor - standard style tag to avoid JSX style issues */}
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          cursor: none;
        }
        
        /* Keep default cursor for text selection */
        p, h1, h2, h3, h4, h5, h6, span, input, textarea {
          cursor: text;
        }
        
        /* Custom cursor effects for different elements */
        a, button, .btn-nurd, .cursor-pointer {
          cursor: none !important;
        }
      `}} />
    </>
  );
};

export default MagicCursor;