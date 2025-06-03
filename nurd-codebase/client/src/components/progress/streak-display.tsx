import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Calendar, Trophy, Clock } from 'lucide-react';

interface StreakDisplayProps {
  streak?: {
    current: number;
    max: number;
    lastActivity: string;
  };
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak }) => {
  if (!streak) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" /> Learning Streak
          </CardTitle>
          <CardDescription>
            Your consecutive days of learning activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6 text-center text-muted-foreground">
            Start your streak by completing lessons or activities!
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Generate day boxes for the streak visualization
  const renderStreakBoxes = () => {
    const totalBoxes = 7; // Show 7 days
    const boxes = [];
    
    for (let i = 0; i < totalBoxes; i++) {
      const isActive = i < streak.current; // Active if part of current streak
      boxes.push(
        <div 
          key={i} 
          className={`h-10 w-10 rounded-md flex items-center justify-center 
            ${isActive 
              ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white' 
              : 'bg-muted'
            }`}
        >
          {isActive && <Flame className="h-6 w-6" />}
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-between">
        {boxes}
      </div>
    );
  };
  
  // Format date from ISO string
  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if date is today
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    }
    
    // Check if date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Otherwise return formatted date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" /> Learning Streak
        </CardTitle>
        <CardDescription>
          Your consecutive days of learning activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          {renderStreakBoxes()}
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <Flame className="h-5 w-5 text-orange-500 mb-1" />
            <div className="text-2xl font-bold">{streak.current}</div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
          </div>
          
          <div className="flex flex-col items-center">
            <Trophy className="h-5 w-5 text-amber-500 mb-1" />
            <div className="text-2xl font-bold">{streak.max}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
          
          <div className="flex flex-col items-center">
            <Clock className="h-5 w-5 text-blue-500 mb-1" />
            <div className="text-sm font-medium">{formatLastActivity(streak.lastActivity)}</div>
            <div className="text-xs text-muted-foreground">Last Activity</div>
          </div>
        </div>
        
        {streak.current > 0 && (
          <div className="mt-4 text-center text-sm">
            {streak.current === 1 ? (
              <p>You've started your streak! Come back tomorrow to keep it going.</p>
            ) : streak.current >= 7 ? (
              <p className="text-green-600 font-medium">Amazing! You've been consistent for a week or more!</p>
            ) : (
              <p>Keep going! Complete an activity tomorrow to continue your streak.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakDisplay;