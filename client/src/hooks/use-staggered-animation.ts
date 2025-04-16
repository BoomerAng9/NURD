import { useEffect, useState } from "react";
import { Variants } from "framer-motion";
import { cardAnimation, staggerContainer } from "../animations/transitions";

interface StaggeredAnimationOptions {
  staggerDelay?: number;
  initialDelay?: number;
  childrenVariants?: Variants;
  containerVariants?: Variants;
}

/**
 * Hook that provides staggered animation properties for a list of items
 * 
 * @param itemCount Number of items in the list
 * @param options Animation configuration options
 * @returns Animation properties for container and child items
 */
export const useStaggeredAnimation = (
  itemCount: number,
  options: StaggeredAnimationOptions = {}
) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    staggerDelay = 0.1,
    initialDelay = 0.1,
    childrenVariants = cardAnimation,
    containerVariants = staggerContainer,
  } = options;

  // Custom container variant with dynamic stagger timing
  const customContainerVariant: Variants = {
    hidden: containerVariants.hidden || { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  useEffect(() => {
    // Trigger animation after a short delay
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    containerProps: {
      initial: "hidden",
      animate: isAnimating ? "visible" : "hidden",
      variants: customContainerVariant,
    },
    itemProps: {
      variants: childrenVariants,
    },
    isAnimating,
  };
};

export default useStaggeredAnimation;