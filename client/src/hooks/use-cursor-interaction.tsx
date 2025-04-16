import { useRef, useEffect } from 'react';

interface CursorInteractionOptions {
  hoverText?: string;     // Text to display when hovering
  hoverScale?: number;    // Scale amount on hover
  interactive?: boolean;  // If the element should trigger cursor effects
  particleColor?: string; // Custom particle color
  highlightClass?: string; // CSS class to add on hover
}

/**
 * Custom hook for cursor interaction effects
 * Use this hook to make elements interact with the custom magic cursor
 */
export function useCursorInteraction(options: CursorInteractionOptions = {}) {
  const {
    hoverText = '',
    hoverScale = 1.1, 
    interactive = true,
    highlightClass = 'hover:bg-primary/10'
  } = options;
  
  const elementRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    // Prevent usual cursor behavior
    if (interactive) {
      element.style.cursor = 'none';
      
      // Add cursor-pointer class to trigger cursor effects
      element.classList.add('cursor-pointer');
      
      // Set data attribute for hover text if provided
      if (hoverText) {
        element.setAttribute('data-cursor-text', hoverText);
      }
    }
    
    // Handle mouse enter for hover effects
    const handleMouseEnter = () => {
      if (!interactive) return;
      
      // Apply highlight class on hover
      if (highlightClass) {
        element.classList.add(...highlightClass.split(' '));
      }
      
      // Apply scale transform
      if (hoverScale !== 1) {
        element.style.transform = `scale(${hoverScale})`;
        element.style.transition = 'transform 0.3s ease-out';
      }
    };
    
    // Handle mouse leave to reset effects
    const handleMouseLeave = () => {
      if (!interactive) return;
      
      // Remove highlight class
      if (highlightClass) {
        element.classList.remove(...highlightClass.split(' '));
      }
      
      // Reset transform
      if (hoverScale !== 1) {
        element.style.transform = 'scale(1)';
      }
    };
    
    // Add event listeners
    if (interactive) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    }
    
    // Cleanup function
    return () => {
      if (interactive) {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        
        // Clean up attributes
        element.style.cursor = '';
        element.classList.remove('cursor-pointer');
        if (hoverText) {
          element.removeAttribute('data-cursor-text');
        }
      }
    };
  }, [hoverText, hoverScale, interactive, highlightClass]);
  
  return elementRef;
}

export default useCursorInteraction;