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
                    <div className="text-center py-10">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">Coming Soon!</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Complete activities and projects to earn achievements and showcase your skills. Check back soon!
                      </p>
                    </div>
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
