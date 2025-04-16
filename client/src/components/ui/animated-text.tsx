import React, { useState, useEffect } from "react";
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
  className = "",
  animationType = "fade",
  duration = 0.5,
  delay = 0,
  tag = "p",
  highlightColor = "rgba(59, 130, 246, 0.3)",
  once = true,
}: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Split text into words
  const words = text.split(" ");
  
  // Split text into letters
  const letters = text.split("");

  // Standard fade in animation
  const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }
    }
  };

  // Slide in animation
  const slideVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }
    }
  };

  // Typewriter effect
  const typewriterVariants: Variants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "100%",
      opacity: 1,
      transition: {
        duration: text.length * 0.05,
        delay: delay,
        ease: "easeOut",
      },
    },
  };

  // Word by word animation
  const wordByWordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const wordByWordContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: 0.08,
      },
    },
  };

  // Letter by letter animation
  const letterByLetterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const letterByLetterContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: 0.02,
      },
    },
  };

  // Highlight animation
  const highlightVariants: Variants = {
    hidden: { color: "inherit", backgroundColor: "transparent" },
    visible: { 
      color: "inherit", 
      backgroundColor: highlightColor,
      transition: { 
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }
    }
  };

  // Component mapping based on selected tag
  const Component = tag as keyof JSX.IntrinsicElements;

  // Select the right animation type
  const renderAnimatedText = () => {
    switch (animationType) {
      case "typewriter":
        return (
          <motion.div
            className="inline-block overflow-hidden whitespace-nowrap"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={typewriterVariants}
          >
            {text}
          </motion.div>
        );

      case "word-by-word":
        return (
          <motion.div
            className="inline-flex flex-wrap"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={wordByWordContainerVariants}
          >
            {words.map((word, index) => (
              <motion.span
                key={index}
                className="mr-1"
                variants={wordByWordVariants}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        );

      case "letter-by-letter":
        return (
          <motion.div
            className="inline-flex flex-wrap"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={letterByLetterContainerVariants}
          >
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                variants={letterByLetterVariants}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.div>
        );

      case "slide":
        return (
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={slideVariants}
            className="inline-block"
            {...(once ? { viewport: { once: true } } : {})}
          >
            {text}
          </motion.div>
        );
      
      case "highlight":
        return (
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={highlightVariants}
            className="inline px-1"
            {...(once ? { viewport: { once: true } } : {})}
          >
            {text}
          </motion.div>
        );

      case "fade":
      default:
        return (
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeVariants}
            className="inline-block"
            {...(once ? { viewport: { once: true } } : {})}
          >
            {text}
          </motion.div>
        );
    }
  };

  return <Component className={cn(className)}>{renderAnimatedText()}</Component>;
}