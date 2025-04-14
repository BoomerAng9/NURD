import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  showPercentage?: boolean;
  showValues?: boolean;
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  colorVariant?: "default" | "success" | "warning" | "info" | "gradient";
}

export default function ProgressBar({
  value,
  max,
  showPercentage = true,
  showValues = false,
  className = "",
  label,
  size = "md",
  colorVariant = "default"
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  // Height variations based on size
  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4"
  };
  
  // Label text size variations
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  // Color variations
  const progressClasses = {
    default: "",
    success: "bg-green-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
    gradient: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
  };

  return (
    <div className={cn("space-y-1", className)}>
      {/* Label and percentage/values */}
      {(label || showPercentage || showValues) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className={cn("font-medium text-foreground", textSizes[size])}>{label}</span>
          )}
          <div className="flex items-center gap-2">
            {showValues && (
              <span className={cn("text-muted-foreground", textSizes[size])}>
                {value} / {max}
              </span>
            )}
            {showPercentage && (
              <span className={cn("font-medium", textSizes[size], percentage === 100 ? "text-green-600" : "text-muted-foreground")}>
                {percentage}%
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Progress bar */}
      <div className="relative">
        <Progress 
          value={percentage} 
          className={cn(heights[size], "w-full")} 
        />
        {/* Overlay with custom color if specified */}
        {colorVariant !== 'default' && (
          <div 
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-300", 
              progressClasses[colorVariant]
            )}
            style={{ width: `${percentage}%` }}
          ></div>
        )}
      </div>
      
      {/* Milestone markers could be added here */}
    </div>
  );
}