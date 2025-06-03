import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { slideUpFade } from "../../animations/transitions";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => {
  const [location] = useLocation();
  
  // Scroll to top when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <motion.div
      className={`w-full ${className}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideUpFade}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;