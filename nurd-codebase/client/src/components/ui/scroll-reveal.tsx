import React, { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import * as transitions from "../../animations/transitions";

type AnimationType = 
  | "fadeIn" 
  | "slideUp" 
  | "slideInRight" 
  | "slideInLeft" 
  | "scaleUp" 
  | "custom";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  customVariants?: Variants;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  amount?: "some" | "all" | number;
}

export function ScrollReveal({
  children,
  animation = "fadeIn",
  customVariants,
  className = "",
  delay = 0,
  duration,
  threshold = 0.1,
  once = true,
  amount = 0.2,
}: ScrollRevealProps) {
  // Select the appropriate animation variant
  const getVariant = (): Variants => {
    if (customVariants) return customVariants;
    
    switch (animation) {
      case "fadeIn":
        return transitions.fadeIn;
      case "slideUp":
        return transitions.slideUpFade;
      case "slideInRight":
        return transitions.slideInRight;
      case "slideInLeft":
        return transitions.slideInLeft;
      case "scaleUp":
        return transitions.scaleUp;
      default:
        return transitions.fadeIn;
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
      whileInView="visible"
      viewport={{ 
        once: once, 
        amount: amount
      }}
      variants={getVariant()}
      {...getTransition()}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}