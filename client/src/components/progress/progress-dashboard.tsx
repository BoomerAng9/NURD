import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy, Star, Calendar, ArrowUpRight, CheckCircle, Award } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn, queryClient } from "../../lib/queryClient";

interface ProgressDashboardProps {
  userId: number;
}

interface UserProgressData {
  xpPoints: number;
  level: number;
  streak: { current: number; max: number } | null;
  coursesInProgress: number;
  coursesCompleted: number;
  achievements: Achievement[];
  recentActivities: Activity[];
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  type: string;
  image_url: string;
  earned_at: string;
  is_viewed: boolean;
}

interface Activity {
  id: number;
  activity_type: string;
  activity_detail: string;
  xp_earned: number;
  created_at: string;
  related_id?: number;
  related_type?: string;
}

interface CourseProgress {
  id: number;
  course_id: number;
  title: string;
  progress_percentage: number;
  completed_lessons: number;
  total_lessons: number;
  last_accessed: string;
  is_completed: boolean;
}

export default function ProgressDashboard({ userId }: ProgressDashboardProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user progress data
  const { 
    data: user, 
    isLoading: isLoadingUser,
    error: userError
  } = useQuery({
    queryKey: ["/api/user", userId],
    queryFn: getQueryFn(),
  });

  // Fetch user progress on courses
  const { 
    data: coursesProgress, 
    isLoading: isLoadingProgress,
    error: progressError
  } = useQuery({
    queryKey: ["/api/users", userId, "progress"],
    queryFn: getQueryFn(),
  });

  // Fetch user achievements
  const { 
    data: achievements, 
    isLoading: isLoadingAchievements,
    error: achievementsError
  } = useQuery({
    queryKey: ["/api/users", userId, "achievements"],
    queryFn: getQueryFn(),
  });

  // Fetch user streak
  const { 
    data: streak, 
    isLoading: isLoadingStreak,
    error: streakError
  } = useQuery({
    queryKey: ["/api/users", userId, "streak"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Fetch user activities
  const { 
    data: activities, 
    isLoading: isLoadingActivities,
    error: activitiesError
  } = useQuery({
    queryKey: ["/api/users", userId, "activities"],
    queryFn: getQueryFn(),
  });

  // Update user streak
  useEffect(() => {
    const updateStreak = async () => {
      try {
        // Only update the streak once per day
        const lastUpdate = localStorage.getItem(`streak_updated_${userId}`);
        const today = new Date().toDateString();
        
        if (lastUpdate !== today) {
          const response = await fetch(`/api/users/${userId}/streak/update`, {
            method: 'POST',
          });
          
          if (response.ok) {
            localStorage.setItem(`streak_updated_${userId}`, today);
            queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "streak"] });
          }
        }
      } catch (error) {
        console.error("Error updating streak:", error);
      }
    };
    
    updateStreak();
  }, [userId]);

  const isLoading = isLoadingUser || isLoadingProgress || isLoadingAchievements || isLoadingStreak || isLoadingActivities;
  const error = userError || progressError || achievementsError || streakError || activitiesError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading progress data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        <h3 className="font-bold">Error loading progress data</h3>
        <p>{error instanceof Error ? error.message : "An unknown error occurred"}</p>
      </div>
    );
  }

  const completedCourses = Array.isArray(coursesProgress) 
    ? coursesProgress.filter(course => course.is_completed).length 
    : 0;

  const inProgressCourses = Array.isArray(coursesProgress) 
    ? coursesProgress.filter(course => !course.is_completed).length 
    : 0;

  const markAchievementViewed = async (achievementId: number) => {
    // This would typically make an API call to mark the achievement as viewed
    // For now, we'll just show a toast notification
    toast({
      title: "Achievement viewed",
      description: "This achievement has been marked as viewed.",
    });
  };

  const xpToNextLevel = user?.level ? user.level * 100 : 100;
  const xpProgress = user?.xp_points ? (user.xp_points % xpToNextLevel) / xpToNextLevel * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* XP and Level Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-500" />
              Experience Points
            </CardTitle>
            <CardDescription>Track your learning progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Level {user?.level || 1}</span>
              <span className="text-sm font-medium">{user?.xp_points || 0} XP</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {Math.round(xpToNextLevel - (user?.xp_points || 0) % xpToNextLevel)} XP to Level {(user?.level || 1) + 1}
            </p>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Activity Streak
            </CardTitle>
            <CardDescription>Keep learning every day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-20">
              <div className="text-center">
                <p className="text-3xl font-bold">{streak?.current || 0}</p>
                <p className="text-sm text-muted-foreground">days in a row</p>
              </div>
              <div className="border-r border-gray-200 h-12 mx-6"></div>
              <div className="text-center">
                <p className="text-3xl font-bold">{streak?.max || 0}</p>
                <p className="text-sm text-muted-foreground">longest streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Course Completion
            </CardTitle>
            <CardDescription>Your learning progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-20">
              <div className="text-center">
                <p className="text-3xl font-bold">{completedCourses}</p>
                <p className="text-sm text-muted-foreground">completed</p>
              </div>
              <div className="border-r border-gray-200 h-12 mx-6"></div>
              <div className="text-center">
                <p className="text-3xl font-bold">{inProgressCourses}</p>
                <p className="text-sm text-muted-foreground">in progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="history">Activity History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Your progress on active courses</CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(coursesProgress) && coursesProgress.length > 0 ? (
                <div className="space-y-4">
                  {coursesProgress
                    .filter(course => !course.is_completed)
                    .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime())
                    .slice(0, 5)
                    .map((course) => (
                      <div key={course.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{course.title}</h4>
                          <span className="text-sm text-muted-foreground">
                            {course.completed_lessons} / {course.total_lessons} lessons
                          </span>
                        </div>
                        <Progress value={course.progress_percentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Last activity: {new Date(course.last_accessed).toLocaleDateString()}
                          </span>
                          <span>{course.progress_percentage}% complete</span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  You haven't started any courses yet. Explore our courses to begin your learning journey!
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View all courses
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Your latest learning milestones</CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(achievements) && achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {achievements
                    .sort((a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime())
                    .slice(0, 3)
                    .map((achievement) => (
                      <TooltipProvider key={achievement.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={`relative p-4 border rounded-lg flex flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-muted transition-all hover:shadow-md cursor-pointer ${
                                !achievement.is_viewed ? "ring-2 ring-primary ring-offset-2" : ""
                              }`}
                              onClick={() => markAchievementViewed(achievement.id)}
                            >
                              {!achievement.is_viewed && (
                                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                  !
                                </div>
                              )}
                              {achievement.image_url ? (
                                <img 
                                  src={achievement.image_url} 
                                  alt={achievement.title} 
                                  className="h-16 w-16 object-contain mb-2" 
                                />
                              ) : (
                                <Award className="h-16 w-16 text-primary mb-2" />
                              )}
                              <h4 className="font-medium text-center">{achievement.title}</h4>
                              <p className="text-xs text-muted-foreground text-center mt-1">
                                Earned {new Date(achievement.earned_at).toLocaleDateString()}
                              </p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{achievement.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  You haven't earned any achievements yet. Complete courses and lessons to earn achievements!
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("achievements")}>
                View all achievements
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>All badges and milestones you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(achievements) && achievements.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {achievements
                    .sort((a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime())
                    .map((achievement) => (
                      <TooltipProvider key={achievement.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={`relative p-4 border rounded-lg flex flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-muted transition-all hover:shadow-md cursor-pointer ${
                                !achievement.is_viewed ? "ring-2 ring-primary ring-offset-2" : ""
                              }`}
                              onClick={() => markAchievementViewed(achievement.id)}
                            >
                              {!achievement.is_viewed && (
                                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                  !
                                </div>
                              )}
                              {achievement.image_url ? (
                                <img 
                                  src={achievement.image_url} 
                                  alt={achievement.title} 
                                  className="h-16 w-16 object-contain mb-2" 
                                />
                              ) : (
                                <Award className="h-16 w-16 text-primary mb-2" />
                              )}
                              <h4 className="font-medium text-center">{achievement.title}</h4>
                              <p className="text-xs text-center mt-1">{achievement.description}</p>
                              <Badge variant="outline" className="mt-2">
                                {achievement.type}
                              </Badge>
                              <p className="text-xs text-muted-foreground text-center mt-1">
                                Earned {new Date(achievement.earned_at).toLocaleDateString()}
                              </p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{achievement.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  You haven't earned any achievements yet. Complete courses and lessons to earn achievements!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(activities) && activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
                      <div className="bg-muted rounded-full p-2">
                        {activity.activity_type === 'course_completion' && (
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        )}
                        {activity.activity_type === 'lesson_completion' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {activity.activity_type === 'achievement_earned' && (
                          <Award className="h-5 w-5 text-purple-500" />
                        )}
                        {!['course_completion', 'lesson_completion', 'achievement_earned'].includes(activity.activity_type) && (
                          <Star className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">
                            {activity.activity_detail || activity.activity_type.replace('_', ' ')}
                          </h4>
                          {activity.xp_earned > 0 && (
                            <Badge variant="secondary">+{activity.xp_earned} XP</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No activity recorded yet. Start learning to see your activity here!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}