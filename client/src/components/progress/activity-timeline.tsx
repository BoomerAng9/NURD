import React from "react";
import { Trophy, Book, Star, Award, CheckCircle, Clock, CalendarDays, Zap } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ActivityTimelineProps {
  activities: Activity[];
  className?: string;
  limit?: number;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

interface Activity {
  id: number;
  activity_type: string;
  activity_detail: string;
  xp_earned: number;
  created_at: string;
  related_id?: number;
  related_type?: string;
  user_id?: number;
}

// Helper to get appropriate icon based on activity type
const getActivityIcon = (type: string) => {
  const iconClass = "h-5 w-5";
  
  switch (type) {
    case 'course_completion':
      return <Trophy className={cn(iconClass, "text-yellow-500")} />;
    case 'lesson_completion':
      return <CheckCircle className={cn(iconClass, "text-green-500")} />;
    case 'achievement_earned':
      return <Award className={cn(iconClass, "text-purple-500")} />;
    case 'login':
      return <Clock className={cn(iconClass, "text-blue-500")} />;
    case 'streak_update':
      return <Zap className={cn(iconClass, "text-orange-500")} />;
    case 'course_started':
      return <Book className={cn(iconClass, "text-indigo-500")} />;
    case 'daily_login':
      return <CalendarDays className={cn(iconClass, "text-teal-500")} />;
    default:
      return <Star className={cn(iconClass, "text-blue-500")} />;
  }
};

// Helper to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const dayInMs = 86400000; // 24 hours in milliseconds
  
  // If less than 24 hours ago, show relative time
  if (diff < dayInMs) {
    const hourDiff = Math.floor(diff / 3600000);
    if (hourDiff < 1) {
      const minuteDiff = Math.floor(diff / 60000);
      return minuteDiff < 1 ? 'Just now' : `${minuteDiff} minute${minuteDiff !== 1 ? 's' : ''} ago`;
    }
    return `${hourDiff} hour${hourDiff !== 1 ? 's' : ''} ago`;
  }
  
  // If within the past week, show day of week
  if (diff < dayInMs * 7) {
    return date.toLocaleDateString(undefined, { weekday: 'long', hour: 'numeric', minute: 'numeric' });
  }
  
  // Otherwise, show full date
  return date.toLocaleDateString(undefined, { 
    month: 'short',
    day: 'numeric',
    year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined,
    hour: 'numeric',
    minute: 'numeric'
  });
};

// Helper to format activity title
const formatActivityTitle = (activity: Activity) => {
  // If activity detail is provided, use that
  if (activity.activity_detail) return activity.activity_detail;
  
  // Otherwise, create a readable title from the activity type
  return activity.activity_type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function ActivityTimeline({
  activities,
  className = "",
  limit = 10,
  showLoadMore = false,
  onLoadMore,
  isLoadingMore = false,
}: ActivityTimelineProps) {
  // If no activities, show empty state
  if (!activities || activities.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Track your learning journey</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No activity yet</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            Your learning activities will appear here as you progress through courses, complete lessons, and earn achievements.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group activities by date
  const groupedActivities = activities.slice(0, limit).reduce<Record<string, Activity[]>>((acc, activity) => {
    const date = new Date(activity.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {});

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>Track your learning journey</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {/* Timeline line */}
        <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-muted"></div>
        
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(([date, dateActivities], groupIndex) => (
            <div key={date} className="relative">
              {/* Date header */}
              <div className="flex items-center mb-4">
                <div className="bg-background z-10 rounded-full border shadow-sm p-1">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </div>
                <h4 className="text-sm font-medium ml-3">
                  {new Date(date).toLocaleDateString(undefined, { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
              </div>
              
              {/* Activities for this date */}
              <div className="space-y-4 ml-2 pl-6">
                {dateActivities.map((activity) => (
                  <div key={activity.id} className="relative flex gap-4">
                    {/* Activity dot and line */}
                    <div className="absolute -left-6 mt-1.5">
                      <div className="h-5 w-5 rounded-full border-2 border-background bg-background flex items-center justify-center">
                        {getActivityIcon(activity.activity_type)}
                      </div>
                    </div>
                    
                    {/* Activity card */}
                    <div className="flex-1 bg-card shadow-sm rounded-md border p-3">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium">
                          {formatActivityTitle(activity)}
                        </h5>
                        {activity.xp_earned > 0 && (
                          <Badge variant="secondary" className="ml-2 shrink-0">
                            +{activity.xp_earned} XP
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.created_at)}
                        </span>
                        
                        {activity.related_type && (
                          <Badge variant="outline" className="text-xs">
                            {activity.related_type}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      {showLoadMore && activities.length >= limit && (
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Loading..." : "Load more activities"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}