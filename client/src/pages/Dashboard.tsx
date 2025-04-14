import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import WelcomeBanner from '@/components/dashboard/welcome-banner';
import ProfileCard from '@/components/dashboard/profile-card';
import ActivityCard from '@/components/dashboard/activity-card';
import AnimatedMenu from '@/components/ui/animated-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useSupabase } from '@/components/ui/supabase-provider';
import { User } from '@shared/schema';

// Mock activities until we have a proper API endpoint
const activities = [
  {
    id: 1,
    title: 'AI-Powered Game Development',
    category: 'Project',
    progress: 25,
    startDate: '2023-06-12',
    endDate: '2023-07-10',
    description: 'Learn to create your own game using AI tools to speed up development',
    imageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Web Design Fundamentals',
    category: 'Workshop',
    progress: 40,
    startDate: '2023-06-15',
    endDate: '2023-06-30',
    description: 'Master the basics of creating beautiful and functional web designs',
    imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Creative Coding Challenge',
    category: 'Challenge',
    progress: 0,
    startDate: '2023-07-01',
    endDate: '2023-07-07',
    description: 'Put your skills to the test with our weekly creative coding challenge',
    imageUrl: 'https://images.unsplash.com/photo-1550645612-83f5d594b671?auto=format&fit=crop&w=600&q=80'
  }
];

const Dashboard: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, supabase } = useSupabase();
  const [username, setUsername] = useState<string | null>(null);

  // Find a stored username in localStorage if user isn't logged in properly
  useEffect(() => {
    const storedUsername = localStorage.getItem('nurd_username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Fetch user data from API
  const { data: userData, isLoading, error } = useQuery<User>({
    queryKey: ['/api/user/' + (username || 'undefined')],
    enabled: !!username
  });

  // Redirect to registration if no user found
  useEffect(() => {
    if (error) {
      toast({
        title: "Authentication Error",
        description: "Please log in to access your dashboard",
        variant: "destructive"
      });
      
      // Give the toast time to display before redirecting
      const timer = setTimeout(() => {
        setLocation('/register');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [error, setLocation, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Animated Side Menu */}
      <AnimatedMenu className="hidden md:block" />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <WelcomeBanner 
            name={userData?.first_name || 'NURD'} 
            isLoading={isLoading} 
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-1">
              {isLoading ? (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <Skeleton className="h-6 w-1/3 mb-4" />
                  <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-4 w-2/3 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto mb-6" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ) : (
                <ProfileCard user={userData} />
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Tabs defaultValue="activities" className="w-full">
                  <div className="px-6 pt-6">
                    <h2 className="font-heading font-bold text-2xl text-gray-900 mb-4">My NURD Journey</h2>
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="activities">Activities</TabsTrigger>
                      <TabsTrigger value="projects">Projects</TabsTrigger>
                      <TabsTrigger value="achievements">Achievements</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="activities" className="p-6 pt-2">
                    <div className="space-y-6">
                      {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                          <div key={i} className="border rounded-lg p-4">
                            <Skeleton className="h-5 w-1/3 mb-2" />
                            <Skeleton className="h-4 w-full mb-3" />
                            <Skeleton className="h-4 w-3/4" />
                            <div className="mt-3">
                              <Skeleton className="h-2 w-full" />
                            </div>
                          </div>
                        ))
                      ) : (
                        activities.map(activity => (
                          <ActivityCard key={activity.id} activity={activity} />
                        ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="projects" className="p-6">
                    <div className="text-center py-10">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">Start Your First Project</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Your NURD journey begins with a project! Join an activity or workshop to start building something amazing.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="achievements" className="p-6">
                    {isLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <div className="grid grid-cols-4 gap-4">
                          <Skeleton className="h-16 w-16 rounded-full" />
                          <Skeleton className="h-16 w-16 rounded-full" />
                          <Skeleton className="h-16 w-16 rounded-full" />
                          <Skeleton className="h-16 w-16 rounded-full" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Progress Tracking Preview */}
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
                          <h3 className="font-heading font-bold text-lg text-purple-900 mb-2">Learning Progress</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Level</span>
                                <span className="text-lg font-bold">{userData?.level || 1}</span>
                              </div>
                              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"
                                  style={{ width: `${((userData?.xp_points || 0) % 100) / 100 * 100}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">0 XP</span>
                                <span className="text-xs text-gray-500">100 XP</span>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <div className="flex flex-col h-full justify-center items-center">
                                <span className="text-sm text-gray-500">Current XP</span>
                                <span className="text-2xl font-bold text-indigo-600">{userData?.xp_points || 0}</span>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <div className="flex flex-col h-full justify-center items-center">
                                <span className="text-sm text-gray-500">Activity Streak</span>
                                <div className="flex items-center mt-1">
                                  <span className="text-2xl font-bold text-amber-500">0</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <Link href="/progress-tracking">
                            <div className="w-full bg-white hover:bg-gray-50 transition-colors text-center py-2 rounded-lg shadow-sm font-medium text-indigo-600 cursor-pointer">
                              View Detailed Progress
                            </div>
                          </Link>
                        </div>
                        
                        {/* Achievements */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-heading font-bold text-lg text-gray-900">Your Achievements</h3>
                            <span className="text-sm text-gray-500">0 of 24 unlocked</span>
                          </div>
                          
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-4">
                            {/* Achievement badges would normally be populated from API */}
                            {Array(6).fill(0).map((_, i) => (
                              <div key={i} className="relative group">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  </svg>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-black bg-opacity-60 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  ?
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="text-center mt-6">
                            <p className="text-gray-600 text-sm">
                              Complete courses and challenges to earn achievements and showcase your skills!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-nurd rounded-xl shadow-lg overflow-hidden">
            <div className="bg-purple-900/20 backdrop-blur-sm p-6 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h2 className="font-heading font-bold text-2xl mb-2">Ready for your next challenge?</h2>
                  <p className="mb-4 md:mb-0">
                    Explore our workshops, projects, and challenges to take your skills to the next level.
                  </p>
                </div>
                <Link href="/learning">
                  <div className="bg-white text-purple-700 hover:bg-gray-100 transition-colors py-2 px-6 rounded-lg font-bold cursor-pointer">
                    Explore Activities
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
