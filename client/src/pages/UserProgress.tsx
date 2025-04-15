import React, { useState, useEffect } from 'react';
import { PageTransition } from '@/components/animations/page-transition';
import { NurdProfileCard } from '@/components/progress/nurd-profile-card';
import { ProgressTracker } from '@/components/progress/progress-tracker';
import { AchievementCelebration } from '@/components/animations/achievement-celebration';
import { useQuery } from '@tanstack/react-query';
import { useWebSocket } from '@/hooks/use-websocket';
import { Loader2, Trophy, BarChart3, Award, ListChecks } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Achievement, User, Course, UserProgress } from '@shared/progress-schema';

export default function UserProgressPage() {
  const [showAchievement, setShowAchievement] = useState(false);
  const [latestAchievement, setLatestAchievement] = useState<Achievement | null>(null);
  const { sendMessage } = useWebSocket();
  
  // Mock user ID - in a real app this would come from authentication
  const userId = 1;
  
  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });
  
  // Fetch user progress
  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: [`/api/users/${userId}/progress`],
  });
  
  // Fetch courses
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['/api/courses'],
  });
  
  // Fetch achievements
  const { data: allAchievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['/api/achievements'],
  });
  
  // Fetch user achievements
  const { data: userAchievements, isLoading: isLoadingUserAchievements } = useQuery({
    queryKey: [`/api/users/${userId}/achievements`],
  });
  
  // Listen for WebSocket achievement events
  useEffect(() => {
    if (showAchievement) return;
    
    const handleWebSocketMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ACHIEVEMENT_EARNED' && data.data.userId === userId) {
          // Find the achievement in our list
          const achievement = allAchievements?.find(a => a.id === data.data.achievementId);
          if (achievement) {
            setLatestAchievement(achievement);
            setShowAchievement(true);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    window.addEventListener('message', handleWebSocketMessage);
    
    return () => {
      window.removeEventListener('message', handleWebSocketMessage);
    };
  }, [allAchievements, userId, showAchievement]);
  
  // Combine achievements with earned status
  const combinedAchievements = React.useMemo(() => {
    if (!allAchievements || !userAchievements) return [];
    
    return allAchievements.map(achievement => ({
      ...achievement,
      isEarned: userAchievements.some(ua => ua.achievement_id === achievement.id)
    }));
  }, [allAchievements, userAchievements]);
  
  // Update streak via API when user visits this page
  useEffect(() => {
    if (user) {
      fetch(`/api/users/${userId}/streak/update`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          // Could notify via WebSocket if streak milestone reached
          if (data.current % 5 === 0) {
            sendMessage({
              type: 'USER_ACTIVITY',
              data: {
                userId,
                activityType: 'streak_milestone',
                detail: `Reached a ${data.current} day streak!`,
                xpEarned: 50
              }
            });
          }
        })
        .catch(err => console.error('Error updating streak:', err));
    }
  }, [user, userId, sendMessage]);
  
  // Loading state
  const isLoading = isLoadingUser || isLoadingProgress || isLoadingCourses || 
                   isLoadingAchievements || isLoadingUserAchievements;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold">Loading your progress...</h3>
          <p className="text-slate-500 mt-2">Hang tight, your NURD journey awaits!</p>
        </div>
      </div>
    );
  }
  
  // If we have data problems, show error state
  if (!user || !progress || !courses || !combinedAchievements) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-900 border-slate-800">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Unable to load your progress</h3>
            <p className="text-slate-400 mt-2 mb-4">
              We're having trouble loading your progress data. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-white">My Progress</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Profile card */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <NurdProfileCard
              user={user as User}
              achievements={combinedAchievements.slice(0, 5)}
              onConnect={() => {
                // Handle connect action
              }}
              onDraft={() => {
                // Handle draft action
              }}
            />
          </div>
          
          {/* Right column - Progress tabs */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="progress" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-slate-800/50">
                <TabsTrigger value="progress" className="data-[state=active]:bg-slate-700">
                  <BarChart3 className="mr-2 h-4 w-4" /> Progress
                </TabsTrigger>
                <TabsTrigger value="achievements" className="data-[state=active]:bg-slate-700">
                  <Award className="mr-2 h-4 w-4" /> Achievements
                </TabsTrigger>
                <TabsTrigger value="courses" className="data-[state=active]:bg-slate-700">
                  <ListChecks className="mr-2 h-4 w-4" /> Courses
                </TabsTrigger>
                <TabsTrigger value="badges" className="data-[state=active]:bg-slate-700">
                  <Trophy className="mr-2 h-4 w-4" /> Badges
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="progress" className="mt-0">
                <ScrollArea className="h-[calc(100vh-240px)]">
                  <ProgressTracker
                    user={user as User}
                    progress={progress as UserProgress[]}
                    courses={courses as Course[]}
                    achievements={combinedAchievements as (Achievement & { isEarned: boolean })[]}
                  />
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="achievements" className="mt-0">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4 text-white">My Achievements</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {combinedAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center"
                      >
                        <div className="flex justify-center mb-3">
                          <div className={`w-16 h-16 rounded-full ${achievement.isEarned ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-slate-700'} flex items-center justify-center`}>
                            {achievement.image_url ? (
                              <img
                                src={achievement.image_url}
                                alt={achievement.title}
                                className="w-12 h-12 object-contain"
                              />
                            ) : (
                              <Award size={32} className={achievement.isEarned ? 'text-white' : 'text-slate-500'} />
                            )}
                          </div>
                        </div>
                        <h3 className="font-bold text-white">{achievement.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">{achievement.description}</p>
                        <div className={`mt-2 text-xs font-semibold ${achievement.isEarned ? 'text-green-400' : 'text-slate-500'}`}>
                          {achievement.isEarned ? 'UNLOCKED' : 'LOCKED'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="courses" className="mt-0">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4 text-white">My Courses</h2>
                  {/* Course details would go here */}
                </div>
              </TabsContent>
              
              <TabsContent value="badges" className="mt-0">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4 text-white">My Badges</h2>
                  {/* Badge collection would go here */}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Achievement celebration popup */}
        {showAchievement && latestAchievement && (
          <AchievementCelebration
            title={latestAchievement.title}
            description={latestAchievement.description}
            imageUrl={latestAchievement.image_url}
            xpEarned={latestAchievement.xp_reward || 0}
            isOpen={showAchievement}
            onClose={() => setShowAchievement(false)}
          />
        )}
      </div>
    </PageTransition>
  );
}