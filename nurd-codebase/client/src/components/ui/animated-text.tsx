import React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  animationType?: "fade" | "typewriter" | "slide" | "word-by-word" | "letter-by-letter" | "highlight";
  duration?: number;
  delay?: number;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  highlightColor?: string;
  once?: boolean;
}

export function AnimatedText({
  text,
  className,
  animationType = "fade",
  duration = 0.5,
  delay = 0,
  tag = "p",
  highlightColor = "rgba(14, 165, 233, 0.2)",
  once = true,
}: AnimatedTextProps) {
  // Animation variants for different effects
  const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: "easeOut"
      }
    }
  };

  const slideVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: "easeOut"
      }
    }
  };

  const typewriterVariants: Variants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: text.length * 0.05, // adjust speed based on text length
        delay,
        ease: "easeInOut"
      }
    }
  };

  const highlightVariants: Variants = {
    hidden: { 
      backgroundSize: "0% 100%",
      backgroundPosition: "0% 100%",
      backgroundRepeat: "no-repeat"
    },
    visible: { 
      backgroundSize: "100% 100%",
      transition: {
        duration: 0.8,
        delay,
        ease: "easeInOut"
      }
    }
  };

  // Handle word-by-word and letter-by-letter animations
  if (animationType === "word-by-word" || animationType === "letter-by-letter") {
    const items = animationType === "word-by-word" 
      ? text.split(" ").map(word => word + " ")
      : text.split("");

    const container = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: {
          staggerChildren: 0.04,
          delayChildren: delay,
        },
      }),
    };

    const child = {
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          type: "spring",
          damping: 15,
          stiffness: 200,
        },
      },
    };

    // Create the component based on the tag
    const Component = motion[tag as keyof typeof motion];

    return (
      <Component
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once }}
        className={cn(className)}
      >
        {items.map((item, index) => (
          <motion.span
            key={index}
            variants={child}
            style={{ display: "inline-block" }}
          >
            {item}
          </motion.span>
        ))}
      </Component>
    );
  }

  // Handle typewriter animation
  if (animationType === "typewriter") {
    const Component = motion[tag as keyof typeof motion];
    
    return (
      <div className={cn("relative overflow-hidden inline-block", className)}>
        <Component
          variants={typewriterVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once }}
          className="whitespace-nowrap overflow-hidden inline-block"
        >
          {text}
        </Component>
      </div>
    );
  }

  // Handle highlight animation
  if (animationType === "highlight") {
    const Component = motion[tag as keyof typeof motion];
    
    return (
      <Component
        variants={highlightVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once }}
        className={cn(className)}
        style={{
          backgroundImage: `linear-gradient(${highlightColor}, ${highlightColor})`,
          display: "inline"
        }}
      >
        {text}
      </Component>
    );
  }

  // Handle fade and slide animations
  const variants = animationType === "slide" ? slideVariants : fadeVariants;
  const Component = motion[tag as keyof typeof motion];

  return (
    <Component
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      className={cn(className)}
    >
      {text}
    </Component>
  );
}