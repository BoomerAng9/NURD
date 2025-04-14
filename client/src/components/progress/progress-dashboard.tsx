import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ProgressBar from "@/components/progress/progress-bar";
import { getQueryFn } from "@/lib/queryClient";
import { 
  BarChart, 
  PieChart, 
  Sparkles, 
  Award, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  CalendarDays,
  Zap,
  Target,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressDashboardProps {
  userId: number;
  className?: string;
}

export default function ProgressDashboard({ 
  userId,
  className = ""
}: ProgressDashboardProps) {
  // Fetch user data (including progress stats)
  const { 
    data: userData, 
    isLoading: isLoadingUser 
  } = useQuery({
    queryKey: ["/api/user", userId],
    queryFn: getQueryFn(),
  });

  // Fetch user progress data
  const { 
    data: progressData, 
    isLoading: isLoadingProgress 
  } = useQuery({
    queryKey: ["/api/progress", userId],
    queryFn: getQueryFn(),
  });

  // Fetch achievements data
  const { 
    data: achievementsData, 
    isLoading: isLoadingAchievements 
  } = useQuery({
    queryKey: ["/api/achievements", userId],
    queryFn: getQueryFn(),
  });

  // Fetch recent activities
  const { 
    data: activitiesData, 
    isLoading: isLoadingActivities 
  } = useQuery({
    queryKey: ["/api/activities", userId],
    queryFn: getQueryFn(),
  });

  // Get loading state
  const isLoading = isLoadingUser || isLoadingProgress || isLoadingAchievements || isLoadingActivities;

  // Calculate progress stats
  const stats = React.useMemo(() => {
    if (isLoading) {
      return {
        totalXP: 0,
        level: 1,
        levelProgress: 0,
        completedCourses: 0,
        completedLessons: 0,
        achievements: 0,
        streak: 0,
        maxStreak: 0
      };
    }

    return {
      totalXP: userData?.xp_points || 0,
      level: userData?.level || 1,
      levelProgress: ((userData?.xp_points || 0) % 100) / 100,
      completedCourses: progressData?.completed_courses || 0,
      completedLessons: progressData?.completed_lessons || 0,
      achievements: achievementsData?.earned_count || 0,
      streak: userData?.streak?.current || 0,
      maxStreak: userData?.streak?.max || 0
    };
  }, [isLoading, userData, progressData, achievementsData]);

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Track your NURD journey progress</CardDescription>
          </div>
          <Tabs defaultValue="overview" className="w-full md:w-auto mt-4 md:mt-0">
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                <BarChart className="h-3.5 w-3.5 mr-1.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="achievements" className="text-xs sm:text-sm">
                <Award className="h-3.5 w-3.5 mr-1.5" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="courses" className="text-xs sm:text-sm">
                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                Courses
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <TabsContent value="overview" className="mt-0 p-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* XP Points with Level Card */}
            <div className="col-span-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 relative overflow-hidden">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-full mt-4" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-1">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold text-lg">Total XP</h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{stats.totalXP}</span>
                    <Badge variant="outline" className="font-semibold">
                      Level {stats.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {100 - ((stats.totalXP % 100))} XP until Level {stats.level + 1}
                  </p>
                  
                  {/* Level Progress Bar */}
                  <ProgressBar 
                    value={stats.totalXP % 100}
                    max={100}
                    size="lg"
                    colorVariant="gradient"
                    showPercentage={false}
                  />
                  
                  {/* Decorative elements */}
                  <div className="absolute -right-12 -bottom-8 opacity-10">
                    <Sparkles className="h-40 w-40 text-purple-900" />
                  </div>
                </>
              )}
            </div>
            
            {/* Activity Streak Card */}
            <div className="col-span-1 bg-amber-50 rounded-lg p-4 flex flex-col h-full">
              {isLoading ? (
                <div className="space-y-3 h-full">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-12 w-16 mx-auto" />
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-5 w-5 text-amber-500" />
                    <h3 className="font-semibold">Current Streak</h3>
                  </div>
                  <div className="text-center flex-grow flex flex-col justify-center">
                    <div className="text-4xl font-bold text-amber-500">{stats.streak}</div>
                    <p className="text-xs text-muted-foreground">days in a row</p>
                  </div>
                  <div className="text-center text-xs text-muted-foreground mt-2">
                    Best: {stats.maxStreak} days
                  </div>
                </>
              )}
            </div>
            
            {/* Achievements Card */}
            <div className="col-span-1 bg-green-50 rounded-lg p-4 flex flex-col h-full">
              {isLoading ? (
                <div className="space-y-3 h-full">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-12 w-16 mx-auto" />
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Achievements</h3>
                  </div>
                  <div className="text-center flex-grow flex flex-col justify-center">
                    <div className="text-4xl font-bold text-green-500">{stats.achievements}</div>
                    <p className="text-xs text-muted-foreground">unlocked</p>
                  </div>
                  <div className="text-center text-xs text-muted-foreground mt-2">
                    {24 - stats.achievements} more to discover
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Course and Lesson Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 rounded-lg p-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-32" />
                  <div className="flex justify-between mt-2">
                    <Skeleton className="h-10 w-16" />
                    <Skeleton className="h-10 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">Course Progress</h3>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-2xl font-bold">{stats.completedCourses}</span>
                      <span className="text-sm text-muted-foreground ml-1">completed</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground mr-1">in progress</span>
                      <span className="text-2xl font-bold">2</span>
                    </div>
                  </div>
                  <ProgressBar 
                    value={stats.completedCourses}
                    max={6}
                    size="md"
                    colorVariant="info"
                    showValues
                    label="Total Courses"
                  />
                </>
              )}
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-32" />
                  <div className="flex justify-between mt-2">
                    <Skeleton className="h-10 w-16" />
                    <Skeleton className="h-10 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-indigo-500" />
                    <h3 className="font-semibold">Lesson Progress</h3>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-2xl font-bold">{stats.completedLessons}</span>
                      <span className="text-sm text-muted-foreground ml-1">completed</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground mr-1">remaining</span>
                      <span className="text-2xl font-bold">{30 - stats.completedLessons}</span>
                    </div>
                  </div>
                  <ProgressBar 
                    value={stats.completedLessons}
                    max={30}
                    size="md"
                    colorVariant="default"
                    showValues
                    label="Total Lessons"
                  />
                </>
              )}
            </div>
          </div>
          
          {/* Timeline or Skills */}
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="bg-muted/30 rounded-lg p-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-slate-500" />
                    <h3 className="font-semibold">Skills Development</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Coding Fundamentals</span>
                        <span className="text-xs font-medium">65%</span>
                      </div>
                      <ProgressBar 
                        value={65}
                        max={100}
                        size="sm"
                        colorVariant="gradient"
                        showPercentage={false}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Design Thinking</span>
                        <span className="text-xs font-medium">40%</span>
                      </div>
                      <ProgressBar 
                        value={40}
                        max={100}
                        size="sm"
                        colorVariant="info"
                        showPercentage={false}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Problem Solving</span>
                        <span className="text-xs font-medium">75%</span>
                      </div>
                      <ProgressBar 
                        value={75}
                        max={100}
                        size="sm"
                        colorVariant="success"
                        showPercentage={false}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Project Management</span>
                        <span className="text-xs font-medium">35%</span>
                      </div>
                      <ProgressBar 
                        value={35}
                        max={100}
                        size="sm"
                        showPercentage={false}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-0 p-0">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {Array(12).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-full mx-auto" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Recently Earned</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {/* Achievement placeholders until real data is available */}
                  {achievementsData?.earned?.length > 0 ? (
                    achievementsData.earned.slice(0, 6).map((achievement) => (
                      <div key={achievement.id} className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 mb-2 flex items-center justify-center text-amber-800">
                          <Award className="h-8 w-8" />
                        </div>
                        <span className="text-xs font-medium">{achievement.title}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-6 text-center">
                      <p className="text-muted-foreground">Complete challenges to earn achievements!</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Locked Achievements</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {/* Locked achievement placeholders */}
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-200 mb-2 flex items-center justify-center text-gray-400 relative">
                        <Award className="h-8 w-8" />
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-300"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">???</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="courses" className="mt-0 p-0">
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {progressData?.courses?.length > 0 ? (
                progressData.courses.map((course) => (
                  <div key={course.id} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.description}</p>
                      </div>
                      <Badge variant={course.completed ? "success" : "outline"}>
                        {course.completed ? "Completed" : `${course.progress}%`}
                      </Badge>
                    </div>
                    <ProgressBar 
                      value={course.progress} 
                      max={100}
                      colorVariant={course.completed ? "success" : "default"}
                    />
                    <div className="text-xs text-muted-foreground mt-2">
                      {course.completed_lessons} of {course.total_lessons} lessons completed
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-lg mb-1">No courses started yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Explore our learning modules to begin your NURD journey!
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </CardContent>
    </Card>
  );
}