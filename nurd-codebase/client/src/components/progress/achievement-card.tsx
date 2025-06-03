import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Award, Medal } from "lucide-react";

interface AchievementCardProps {
  achievement: {
    id: number;
    title: string;
    description: string;
    type: 'completion' | 'streak' | 'milestone' | 'special';
    image_url: string;
    xp_reward: number;
  };
  earnedAt: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, earnedAt }) => {
  // Get appropriate icon based on achievement type
  const getAchievementIcon = () => {
    switch (achievement.type) {
      case 'completion':
        return <Trophy className="h-6 w-6 text-amber-500" />;
      case 'streak':
        return <Zap className="h-6 w-6 text-blue-500" />;
      case 'milestone':
        return <Medal className="h-6 w-6 text-emerald-500" />;
      case 'special':
        return <Star className="h-6 w-6 text-purple-500" />;
      default:
        return <Award className="h-6 w-6 text-primary" />;
    }
  };

  // Get color class based on achievement type
  const getColorClass = () => {
    switch (achievement.type) {
      case 'completion':
        return 'bg-amber-50 border-amber-200';
      case 'streak':
        return 'bg-blue-50 border-blue-200';
      case 'milestone':
        return 'bg-emerald-50 border-emerald-200';
      case 'special':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-primary-50 border-primary-200';
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card className={`border-2 ${getColorClass()} overflow-hidden`}>
      <CardHeader className="p-4 pb-0 flex flex-col items-center text-center">
        <Avatar className="h-16 w-16 mb-2">
          <AvatarImage src={achievement.image_url} alt={achievement.title} />
          <AvatarFallback>
            {getAchievementIcon()}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-bold text-sm">{achievement.title}</h3>
      </CardHeader>
      <CardContent className="p-4 pt-2 text-center">
        <p className="text-xs text-muted-foreground">{achievement.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-center text-xs gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          {achievement.xp_reward} XP
        </Badge>
        <span className="text-muted-foreground">
          Earned on {formatDate(earnedAt)}
        </span>
      </CardFooter>
    </Card>
  );
};

export default AchievementCard;