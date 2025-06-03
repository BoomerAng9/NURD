import React from 'react';
import { 
  BookOpen, 
  Award, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Zap, 
  Trophy, 
  BookMarked, 
  Star 
} from 'lucide-react';

interface Activity {
  id: number;
  user_id: number;
  activity_type: string;
  activity_detail: string;
  xp_earned: number;
  created_at: string;
  related_id?: number;
  related_type?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  
  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if date is today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}`;
    }
    
    // Check if date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}`;
    }
    
    // Otherwise return formatted date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: 'numeric'
    });
  };
  
  // Get icon based on activity type
  const getActivityIcon = (activity: Activity) => {
    switch (activity.activity_type) {
      case 'course_start':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'course_progress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'course_completion':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'lesson_completion':
        return <BookMarked className="h-4 w-4 text-indigo-500" />;
      case 'achievement_earned':
        return <Trophy className="h-4 w-4 text-purple-500" />;
      case 'streak_update':
        return <Calendar className="h-4 w-4 text-red-500" />;
      case 'xp_earned':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      default:
        return <Star className="h-4 w-4 text-primary" />;
    }
  };
  
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <Clock className="h-8 w-8 mb-2 opacity-70" />
        <p>No activity recorded yet. Start learning to see your activity here!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4">
          <div className="min-w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            {getActivityIcon(activity)}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.activity_detail}
              {activity.xp_earned > 0 && (
                <span className="ml-2 inline-flex items-center text-xs font-medium text-green-600">
                  <Zap className="h-3 w-3 mr-1" />
                  +{activity.xp_earned} XP
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(activity.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;