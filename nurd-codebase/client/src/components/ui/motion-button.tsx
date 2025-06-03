import React from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { buttonHover } from "../../animations/transitions";
import { cn } from "@/lib/utils";

interface MotionButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  hoverScale?: number;
  hoverColor?: string;
  pulseEffect?: boolean;
}

const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, hoverScale = 1.05, hoverColor, pulseEffect = false, children, ...props }, ref) => {
    const hoverAnimation = {
      scale: hoverScale,
      transition: { 
        duration: 0.2 
      },
      ...(hoverColor ? { backgroundColor: hoverColor } : {})
    };

    const pulseVariants = {
      initial: { 
        boxShadow: "0 0 0 rgba(59, 130, 246, 0)" 
      },
      pulse: {
        boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.7)", "0 0 0 10px rgba(59, 130, 246, 0)"],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop" as const
        }
      }
    };

    return (
      <motion.div
        whileHover={hoverAnimation}
        whileTap={{ scale: 0.98 }}
        initial={pulseEffect ? "initial" : undefined}
        animate={pulseEffect ? "pulse" : undefined}
        variants={pulseEffect ? pulseVariants : undefined}
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

MotionButton.displayName = "MotionButton";

export { MotionButton };