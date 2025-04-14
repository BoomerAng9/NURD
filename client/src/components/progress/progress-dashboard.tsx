import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Trophy, Star, BookOpen, Lightbulb, Clock, Zap, BarChart3 } from "lucide-react";
import AchievementCard from './achievement-card';
import ActivityFeed from './activity-feed';
import CourseProgressList from './course-progress-list';
import StreakDisplay from './streak-display';
import { getQueryFn } from '@/lib/queryClient';

interface ProgressDashboardProps {
  userId: number;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user progress
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: [`/api/users/${userId}/progress`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!userId,
  });

  // Fetch user achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: [`/api/users/${userId}/achievements`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!userId,
  });

  // Fetch user streak
  const { data: streak, isLoading: streakLoading } = useQuery({
    queryKey: [`/api/users/${userId}/streak`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!userId,
  });

  // Fetch user activities
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: [`/api/users/${userId}/activities`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!userId,
  });

  const calculateOverallProgress = () => {
    if (!progressData || progressData.length === 0) return 0;
    
    const totalProgress = progressData.reduce((acc, curr) => acc + curr.progress_percentage, 0);
    return Math.round(totalProgress / progressData.length);
  };

  const calculateCompletedCourses = () => {
    if (!progressData) return 0;
    return progressData.filter(p => p.is_completed).length;
  };

  const calculateTotalXP = () => {
    if (!progressData) return 0;
    return progressData.reduce((acc, curr) => acc + (curr.earned_xp || 0), 0);
  };

  const isLoading = progressLoading || achievementsLoading || streakLoading || activitiesLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 lg:w-[400px] mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateOverallProgress()}%</div>
                <Progress value={calculateOverallProgress()} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Your overall NURD program progress
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">XP Points</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateTotalXP()}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total experience points earned
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculateCompletedCourses()}/{progressData?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Courses you've finished
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{streak?.current || 0} days</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {streak?.current === 0 
                    ? "Start your streak today!" 
                    : "Keep it going!"
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 mt-4 md:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Progress</CardTitle>
                <CardDescription>
                  Your latest course achievements and completions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CourseProgressList 
                  courses={progressData?.slice(0, 5) || []} 
                  minimal={true} 
                />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Latest Achievements</CardTitle>
                <CardDescription>
                  Badges and achievements you've earned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {achievements?.slice(0, 6).map((achievement) => (
                    <div key={achievement.id} className="flex flex-col items-center justify-center p-2">
                      <Avatar className="h-12 w-12 border-2 border-primary">
                        <AvatarImage src={achievement.achievement.image_url} alt={achievement.achievement.title} />
                        <AvatarFallback>
                          <Trophy className="h-6 w-6 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-xs text-center mt-1 font-medium truncate w-full">
                        {achievement.achievement.title}
                      </p>
                    </div>
                  ))}
                  {(!achievements || achievements.length === 0) && (
                    <div className="col-span-3 py-8 text-center text-muted-foreground">
                      No achievements yet. Keep learning to earn badges!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            <StreakDisplay streak={streak} />
          </div>
          
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityFeed activities={activities?.slice(0, 5) || []} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>
                Track your progress across all NURD program courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseProgressList 
                courses={progressData || []} 
                minimal={false} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>
                Badges and awards you've earned through your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {achievements?.map((achievement) => (
                  <AchievementCard 
                    key={achievement.id}
                    achievement={achievement.achievement}
                    earnedAt={achievement.earned_at}
                  />
                ))}
                {(!achievements || achievements.length === 0) && (
                  <div className="col-span-full py-12 text-center text-muted-foreground">
                    No achievements yet. Keep learning to earn badges!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>
                Your complete learning activity history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={activities || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressDashboard;