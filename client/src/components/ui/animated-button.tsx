import React from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { buttonHover } from "../../animations/transitions";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  animateScale?: boolean;
  animateHover?: boolean;
  pulseEffect?: boolean;
  glowEffect?: boolean;
  glowColor?: string;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    className, 
    children, 
    animateScale = true,
    animateHover = true,
    pulseEffect = false,
    glowEffect = false,
    glowColor = "rgba(59, 130, 246, 0.7)",
    ...props 
  }, ref) => {
    
    // Animation settings
    const hoverAnimation = animateHover ? {
      scale: animateScale ? 1.05 : 1,
      y: animateScale ? -2 : 0,
      transition: { 
        duration: 0.2 
      },
    } : {};

    // Pulse animation for drawing attention
    const pulseVariants = {
      initial: { 
        boxShadow: "0 0 0 rgba(59, 130, 246, 0)" 
      },
      pulse: {
        boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.7)", "0 0 0 8px rgba(59, 130, 246, 0)"],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop" as const
        }
      }
    };

    // Glow effect animation
    const glowVariants = {
      initial: { 
        boxShadow: "0 0 0 rgba(59, 130, 246, 0)" 
      },
      glow: {
        boxShadow: `0 0 10px 2px ${glowColor}`,
      }
    };

    return (
      <motion.div
        whileHover={hoverAnimation}
        whileTap={{ scale: animateScale ? 0.98 : 1 }}
        initial={pulseEffect || glowEffect ? "initial" : undefined}
        animate={pulseEffect ? "pulse" : glowEffect ? "glow" : undefined}
        variants={pulseEffect ? pulseVariants : glowEffect ? glowVariants : undefined}
        className="inline-block"
      >
        <Button
          ref={ref}
          className={cn(className)}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };