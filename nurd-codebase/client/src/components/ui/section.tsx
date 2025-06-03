import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Section component for consistent page sectioning
 */
export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section 
      className={cn("py-8 md:py-12", className)}
      {...props}
    >
      {children}
    </section>
  );
}