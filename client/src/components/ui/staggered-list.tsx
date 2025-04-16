import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { useStaggeredAnimation } from "@/hooks/use-staggered-animation";

interface StaggeredListProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  itemClassName?: string;
}

export function StaggeredList({
  children,
  className = "",
  staggerDelay = 0.1,
  initialDelay = 0.1,
  itemClassName = "",
}: StaggeredListProps) {
  const { containerProps, itemProps } = useStaggeredAnimation(
    React.Children.count(children),
    {
      staggerDelay,
      initialDelay,
    }
  );

  return (
    <motion.div className={className} {...containerProps}>
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} className={itemClassName} {...itemProps}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Grid version of staggered list
interface StaggeredGridProps extends StaggeredListProps {
  columns?: number;
  gap?: number;
}

export function StaggeredGrid({
  children,
  className = "",
  staggerDelay = 0.05,
  initialDelay = 0.1,
  itemClassName = "",
  columns = 3,
  gap = 6,
}: StaggeredGridProps) {
  const { containerProps, itemProps } = useStaggeredAnimation(
    React.Children.count(children),
    {
      staggerDelay,
      initialDelay,
    }
  );

  return (
    <motion.div 
      className={`grid grid-cols-1 md:grid-cols-${columns} gap-${gap} ${className}`} 
      {...containerProps}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} className={itemClassName} {...itemProps}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}