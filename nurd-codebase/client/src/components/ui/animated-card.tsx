import React from "react";
import { motion } from "framer-motion";
import { Card } from "./card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  hoverEffect?: "lift" | "scale" | "glow" | "border" | "none";
  clickEffect?: boolean;
  delay?: number;
  animateEntrance?: boolean;
  glowColor?: string;
  className?: string;
  children: React.ReactNode;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    className, 
    children, 
    hoverEffect = "lift", 
    clickEffect = true,
    delay = 0,
    animateEntrance = true,
    glowColor = "rgba(59, 130, 246, 0.3)",
    ...props 
  }, ref) => {
    
    // Initial animation when card appears
    const entranceAnimation = {
      hidden: { 
        opacity: 0, 
        y: 20 
      },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.4,
          delay: delay,
          ease: "easeOut"
        }
      }
    };

    // Different hover effects
    const getHoverAnimation = () => {
      switch (hoverEffect) {
        case "lift":
          return { y: -8, transition: { duration: 0.2 } };
        case "scale":
          return { scale: 1.02, transition: { duration: 0.2 } };
        case "glow":
          return { 
            boxShadow: `0 0 20px 2px ${glowColor}`,
            transition: { duration: 0.2 }
          };
        case "border":
          return { 
            boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
            transition: { duration: 0.2 }
          };
        case "none":
          return {};
        default:
          return { y: -8, transition: { duration: 0.2 } };
      }
    };

    return (
      <motion.div
        ref={ref}
        initial={animateEntrance ? "hidden" : undefined}
        animate={animateEntrance ? "visible" : undefined}
        variants={animateEntrance ? entranceAnimation : undefined}
        whileHover={getHoverAnimation()}
        whileTap={clickEffect ? { scale: 0.98 } : undefined}
        className={cn(className)}
        {...props}
      >
        <Card className="h-full w-full border transition-colors">
          {children}
        </Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

export { AnimatedCard };