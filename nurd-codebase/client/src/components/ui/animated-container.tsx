import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import * as animations from "../../animations/transitions";

type AnimationType = 
  | "fadeIn" 
  | "slideUpFade" 
  | "slideInRight" 
  | "slideInLeft" 
  | "scaleUp" 
  | "staggerContainer" 
  | "cardAnimation" 
  | "sectionEntrance" 
  | "modalAnimation";

interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: AnimationType;
  customVariants?: Variants;
  className?: string;
  delay?: number;
  duration?: number;
  isVisible?: boolean;
  id?: string;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = "fadeIn",
  customVariants,
  className = "",
  delay = 0,
  duration,
  isVisible = true,
  id,
}) => {
  // Select the animation variant based on the animation prop
  const getVariant = () => {
    if (customVariants) return customVariants;
    
    switch (animation) {
      case "fadeIn":
        return animations.fadeIn;
      case "slideUpFade":
        return animations.slideUpFade;
      case "slideInRight":
        return animations.slideInRight;
      case "slideInLeft":
        return animations.slideInLeft;
      case "scaleUp":
        return animations.scaleUp;
      case "staggerContainer":
        return animations.staggerContainer;
      case "cardAnimation":
        return animations.cardAnimation;
      case "sectionEntrance":
        return animations.sectionEntrance;
      case "modalAnimation":
        return animations.modalAnimation;
      default:
        return animations.fadeIn;
    }
  };

  // Apply custom transition timing if provided
  const getTransition = () => {
    if (!duration) return {};
    
    return {
      transition: {
        duration: duration,
        delay: delay,
      }
    };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id={id}
          className={className}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={getVariant()}
          {...getTransition()}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedContainer;