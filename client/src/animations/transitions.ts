import { Variants } from "framer-motion";

/**
 * Fade in animation
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

/**
 * Fade up animation - combines fade with upward movement
 */
export const slideUpFade: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

/**
 * Slide in from the left with fade
 */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

/**
 * Slide in from the right with fade
 */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

/**
 * Scale up with fade animation
 */
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

/**
 * Scale down with fade animation
 */
export const scaleDown: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

/**
 * Rotate and fade in animation
 */
export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -5 },
  visible: { 
    opacity: 1, 
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

/**
 * Perspective tilt animation with fade
 */
export const tiltIn: Variants = {
  hidden: { opacity: 0, rotateX: -10 },
  visible: { 
    opacity: 1, 
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

/**
 * Pop animation - quick scale bounce
 */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

/**
 * Animation for staggered children elements
 * Use this for parent containers
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

/**
 * Blurred fade in animation
 */
export const blurFadeIn: Variants = {
  hidden: { 
    opacity: 0, 
    filter: "blur(10px)" 
  },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

/**
 * Swing animation - pendulum-like movement
 */
export const swing: Variants = {
  hidden: { opacity: 0, rotate: -10 },
  visible: { 
    opacity: 1, 
    rotate: [0, 5, -5, 3, -3, 0],
    transition: {
      duration: 1,
      ease: "easeOut"
    }
  }
};

/**
 * Zoom and pan effect for images
 */
export const zoomPan: Variants = {
  hidden: { opacity: 0, scale: 1.2, x: -20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

/**
 * Flip animation (vertical)
 */
export const flipVertical: Variants = {
  hidden: { opacity: 0, rotateX: 90 },
  visible: { 
    opacity: 1, 
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

/**
 * Flip animation (horizontal)
 */
export const flipHorizontal: Variants = {
  hidden: { opacity: 0, rotateY: 90 },
  visible: { 
    opacity: 1, 
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

/**
 * Fade out animation for exit transitions
 */
export const fadeOut: Variants = {
  hidden: { opacity: 1 },
  visible: { 
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

/**
 * Bounce animation
 */
export const bounce: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: [0, -15, 0, -7, 0],
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};