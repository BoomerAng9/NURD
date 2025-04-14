import React from "react";
import { Award, Trophy, Star, BookOpen, Zap, Clock, Target, Heart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Achievement {
  id: number;
  title: string;
  description: string;
  type: string;
  image_url: string | null;
  requirement: string;
  is_hidden?: boolean;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  earned?: boolean;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
  onClick?: () => void;
}

const getIconByType = (type: string) => {
  switch (type.toLowerCase()) {
    case "completion":
      return <Trophy />;
    case "streak":
      return <Zap />;
    case "milestone":
      return <Target />;
    case "special":
      return <Star />;
    default:
      return <Award />;
  }
};

const getIconByRequirement = (requirement: string) => {
  switch (requirement.toLowerCase()) {
    case "courses_completed":
      return <BookOpen />;
    case "consecutive_days":
      return <Clock />;
    case "community_contribution":
      return <Heart />;
    default:
      return null;
  }
};

export default function AchievementBadge({
  achievement,
  earned = false,
  size = "md",
  showTooltip = true,
  className = "",
  onClick
}: AchievementBadgeProps) {
  // Determine size values
  const dimensions = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-24 w-24"
  };

  const iconSize = {
    sm: "h-5 w-5",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  // Get appropriate icon
  const typeIcon = getIconByType(achievement.type);
  const requirementIcon = getIconByRequirement(achievement.requirement);

  // Badge content
  const badgeContent = (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-full transition-all duration-300",
        earned 
          ? "bg-gradient-to-r from-amber-300 to-yellow-500 text-black shadow-md" 
          : "bg-gray-200 text-gray-400 bg-opacity-50",
        dimensions[size],
        onClick ? "cursor-pointer hover:scale-105" : "",
        className
      )}
      onClick={onClick}
    >
      {achievement.image_url ? (
        <img 
          src={achievement.image_url} 
          alt={achievement.title} 
          className={cn("object-contain", dimensions[size])} 
        />
      ) : (
        <div className="flex items-center justify-center">
          <div className={cn(iconSize[size], earned ? "text-amber-800" : "text-gray-400")}>
            {typeIcon}
          </div>
          {requirementIcon && size !== "sm" && (
            <div className="absolute bottom-1 right-1 bg-white bg-opacity-80 rounded-full p-1">
              <div className="h-4 w-4">{requirementIcon}</div>
            </div>
          )}
        </div>
      )}
      
      {/* For locked/unearned achievements, show a lock overlay */}
      {!earned && !achievement.is_hidden && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
          <div className={cn("border-2 border-dashed border-white rounded-full", dimensions[size], "opacity-50")}></div>
        </div>
      )}
      
      {/* For hidden achievements, show a question mark */}
      {!earned && achievement.is_hidden && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <span className={cn("font-bold text-white", textSize[size])}>?</span>
        </div>
      )}
    </div>
  );

  // If tooltip is disabled, return badge only
  if (!showTooltip) {
    return badgeContent;
  }

  // Render with tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 max-w-xs">
            <p className="font-bold">{achievement.title}</p>
            <p className="text-sm">{achievement.description}</p>
            {!earned && !achievement.is_hidden && (
              <p className="text-xs italic">Not yet earned</p>
            )}
            {!earned && achievement.is_hidden && (
              <p className="text-xs italic">Hidden achievement</p>
            )}
            {earned && (
              <p className="text-xs font-medium text-green-600">Earned</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}