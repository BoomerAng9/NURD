import { Variants } from "framer-motion";

// Fade in animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

// Slide in from bottom with fade
export const slideUpFade: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

// Slide in from right with fade
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    x: 40,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

// Slide in from left with fade
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    x: -40,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

// Scale up with fade
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

// Staggered children animation configuration
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Card animation for lists
export const cardAnimation: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: "easeOut" 
    }
  }
};

// Button hover animation
export const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

// Section entrance animation with subtle scaling
export const sectionEntrance: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.7, 
      ease: "easeOut" 
    }
  }
};

// Modal animation
export const modalAnimation: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: "easeOut" 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: { 
      duration: 0.2, 
      ease: "easeIn" 
    }
  }
};