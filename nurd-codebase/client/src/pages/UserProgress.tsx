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

// Mock data for development
const mockUser: User = {
  id: 1,
  first_name: "Alex",
  age: 12,
  grade_level: "7th Grade",
  user_type: "student",
  gender: "non-binary",
  path_choice: "coding",
  username: "techkid",
  password: "********",
  xp_points: 450,
  level: 7,
  created_at: new Date(),
  updated_at: new Date(),
  avatar_svg: null,
  avatar_data: { bio: "A young innovator with boundless energy, always seeking the next big idea.", streak: { current: 5, max: 12 } }
};

const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: "First Login",
    description: "Successfully logged into the NURD platform for the first time.",
    type: "milestone",
    image_url: "",
    xp_reward: 10,
    requirement: "login_count",
    requirement_value: 1,
    is_hidden: false,
    created_at: new Date()
  },
  {
    id: 2,
    title: "Code Explorer",
    description: "Completed your first coding module.",
    type: "completion",
    image_url: "",
    xp_reward: 50,
    requirement: "course_completed",
    requirement_value: 1,
    is_hidden: false,
    created_at: new Date()
  },
  {
    id: 3,
    title: "5-Day Streak",
    description: "Logged in for 5 consecutive days.",
    type: "streak",
    image_url: "",
    xp_reward: 100,
    requirement: "login_streak",
    requirement_value: 5,
    is_hidden: false,
    created_at: new Date()
  },
  {
    id: 4,
    title: "Teamwork Star",
    description: "Collaborated with 3 other students on a project.",
    type: "special",
    image_url: "",
    xp_reward: 150,
    requirement: "collaboration_count",
    requirement_value: 3,
    is_hidden: false,
    created_at: new Date()
  },
  {
    id: 5,
    title: "Presentation Ace",
    description: "Delivered your first project presentation.",
    type: "milestone",
    image_url: "",
    xp_reward: 200,
    requirement: "presentation_count",
    requirement_value: 1,
    is_hidden: false,
    created_at: new Date()
  }
];

const mockUserAchievements = [
  { id: 1, user_id: 1, achievement_id: 1, earned_at: new Date(), is_viewed: true },
  { id: 2, user_id: 1, achievement_id: 2, earned_at: new Date(), is_viewed: true },
  { id: 3, user_id: 1, achievement_id: 3, earned_at: new Date(), is_viewed: false }
];

const mockCourses: Course[] = [
  {
    id: 1,
    title: "Introduction to Coding",
    description: "Learn the basics of coding with fun interactive exercises.",
    image_url: "",
    category: "coding",
    level: "beginner",
    duration: "2 weeks",
    total_lessons: 10,
    total_xp: 500,
    tags: ["coding", "beginner", "fundamentals"],
    is_featured: true,
    is_published: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    title: "Digital Art Fundamentals",
    description: "Explore digital art creation using various tools and techniques.",
    image_url: "",
    category: "design",
    level: "beginner",
    duration: "3 weeks",
    total_lessons: 12,
    total_xp: 600,
    tags: ["design", "art", "creativity"],
    is_featured: true,
    is_published: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

const mockProgress: UserProgress[] = [
  {
    id: 1,
    user_id: 1,
    course_id: 1,
    progress_percentage: 80,
    completed_lessons: 8,
    start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    last_accessed: new Date(),
    completion_date: null,
    is_completed: false,
    earned_xp: 400
  },
  {
    id: 2,
    user_id: 1,
    course_id: 2,
    progress_percentage: 25,
    completed_lessons: 3,
    start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    last_accessed: new Date(),
    completion_date: null,
    is_completed: false,
    earned_xp: 150
  }
];

export default function UserProgressPage() {
  const [showAchievement, setShowAchievement] = useState(false);
  const [latestAchievement, setLatestAchievement] = useState<Achievement | null>(null);
  const { sendMessage } = useWebSocket();
  
  // Mock user ID - in a real app this would come from authentication
  const userId = 1;
  
  // For development, we'll use mock data instead of real API calls
  // In a production app, these would be real API calls
  
  // Use state to simulate API loading states
  const [loading, setLoading] = useState(true);
  
  // Simulated user data
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress[] | null>(null);
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [allAchievements, setAllAchievements] = useState<Achievement[] | null>(null);
  const [userAchievements, setUserAchievements] = useState<{ achievement_id: number }[] | null>(null);
  
  // Load mock data with simulated delay to test loading states
  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(mockUser);
      setProgress(mockProgress);
      setCourses(mockCourses);
      setAllAchievements(mockAchievements);
      setUserAchievements(mockUserAchievements);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
  
  // Update streak via API disabled for mock implementation
  // Let's just use the loading state we already declared
  
  if (loading) {
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