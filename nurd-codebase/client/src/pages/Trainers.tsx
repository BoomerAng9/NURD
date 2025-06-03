import React, { useState, useEffect } from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import TrainersList from '@/components/trainers/trainers-list';
import { TrainerPortal } from '@/components/trainer/trainer-portal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FuturisticContainer, FadeIn } from '@/components/animations/futuristic-transitions';
import { useAuth } from '@/hooks/use-auth';

const Trainers: React.FC = () => {
  const [viewMode, setViewMode] = useState<'default' | 'compact'>('default');
  const [showTrainerPortal, setShowTrainerPortal] = useState(false);
  const { user } = useAuth();
  const [isTrainer, setIsTrainer] = useState(false);
  
  // Check if user is a trainer (in a real app, this would check user roles or database)
  useEffect(() => {
    // For demo purposes, we'll consider any logged-in user as a potential trainer
    if (user) {
      // In a real app, you would check if user has trainer role
      setIsTrainer(true);
    }
  }, [user]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-12">
          {/* Trainer Portal Access - Only visible to trainers */}
          {isTrainer && (
            <FadeIn>
              <div className="max-w-7xl mx-auto mb-12">
                <FuturisticContainer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-8 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-grid-pattern opacity-20"></div>
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">Trainer Dashboard</h2>
                        <p className="text-indigo-200">Manage your students, schedule, and resources</p>
                      </div>
                      <Button
                        className="mt-4 md:mt-0 bg-white text-indigo-900 hover:bg-indigo-100"
                        onClick={() => setShowTrainerPortal(!showTrainerPortal)}
                      >
                        {showTrainerPortal ? 'Hide Dashboard' : 'Show Dashboard'}
                      </Button>
                    </div>
                    
                    {showTrainerPortal && (
                      <div className="bg-white text-gray-900 rounded-lg p-6 mt-4">
                        <TrainerPortal 
                          students={[
                            {
                              id: 1,
                              name: "Jamie Reynolds",
                              avatarUrl: "https://i.pravatar.cc/150?img=32",
                              level: 5,
                              grade: "Intermediate",
                              progressPercent: 75,
                              lastActive: "Today",
                              badges: 12,
                              assignments: {
                                completed: 8,
                                total: 10,
                              },
                            },
                            {
                              id: 2,
                              name: "Taylor Wong",
                              avatarUrl: "https://i.pravatar.cc/150?img=5",
                              level: 3,
                              grade: "Beginner",
                              progressPercent: 40,
                              lastActive: "Yesterday",
                              badges: 5,
                              assignments: {
                                completed: 4,
                                total: 10,
                              },
                            },
                            {
                              id: 3,
                              name: "Jordan Patel",
                              avatarUrl: "https://i.pravatar.cc/150?img=12",
                              level: 7,
                              grade: "Advanced",
                              progressPercent: 90,
                              lastActive: "2 days ago",
                              badges: 18,
                              assignments: {
                                completed: 9,
                                total: 10,
                              },
                            },
                          ]}
                          upcomingSessions={[
                            {
                              id: 1,
                              title: "Introduction to Game Development",
                              date: "April 16, 2025",
                              startTime: "3:00 PM",
                              endTime: "5:00 PM",
                              attendees: 12,
                              location: "Virtual Classroom B",
                              type: "virtual",
                            },
                            {
                              id: 2,
                              title: "Advanced Unity Techniques",
                              date: "April 18, 2025",
                              startTime: "2:00 PM",
                              endTime: "4:30 PM",
                              attendees: 8,
                              location: "Atlanta Tech Center",
                              type: "in-person",
                            },
                          ]}
                          trainerLevel={9}
                          trainerRating={4.8}
                          totalSessionsCompleted={42}
                          specializations={["Game Development", "Unity", "C#"]}
                        />
                      </div>
                    )}
                  </div>
                </FuturisticContainer>
              </div>
            </FadeIn>
          )}
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold font-heading text-gray-900 mb-4">Meet Our Expert Trainers</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Learn from industry professionals who are passionate about teaching and mentoring the next generation of tech innovators.
              </p>
            </div>
            
            <Tabs defaultValue="all" className="mb-8">
              <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Trainers</TabsTrigger>
                  <TabsTrigger value="game-dev">Game Development</TabsTrigger>
                  <TabsTrigger value="digital-art">Digital Art</TabsTrigger>
                  <TabsTrigger value="ai-ml">AI & ML</TabsTrigger>
                </TabsList>
                
                <div className="bg-white rounded-md shadow-sm p-1 border">
                  <button
                    className={`px-3 py-1 rounded-md ${viewMode === 'default' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}
                    onClick={() => setViewMode('default')}
                  >
                    Detailed
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md ${viewMode === 'compact' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}
                    onClick={() => setViewMode('compact')}
                  >
                    Grid
                  </button>
                </div>
              </div>
              
              <TabsContent value="all">
                <TrainersList variant={viewMode} />
              </TabsContent>
              
              <TabsContent value="game-dev">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Game Development Trainers</h2>
                  <p className="text-gray-600">
                    Our game development experts will teach you everything from game design principles to programming in Unity and Unreal Engine.
                  </p>
                </div>
                <TrainersList variant={viewMode} />
              </TabsContent>
              
              <TabsContent value="digital-art">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Digital Art & Animation Trainers</h2>
                  <p className="text-gray-600">
                    Learn digital art, animation, and character design from professionals with years of industry experience.
                  </p>
                </div>
                <TrainersList variant={viewMode} />
              </TabsContent>
              
              <TabsContent value="ai-ml">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">AI & Machine Learning Trainers</h2>
                  <p className="text-gray-600">
                    Our AI and machine learning experts will guide you through the exciting world of artificial intelligence, data science, and advanced computing.
                  </p>
                </div>
                <TrainersList variant={viewMode} />
              </TabsContent>
            </Tabs>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Want to Become a NURD Trainer?</h2>
              <p className="text-gray-600 mb-6">
                We're always looking for talented and passionate individuals to join our team of trainers. If you have expertise in game development, digital art, AI, or other tech fields and enjoy teaching, we'd love to hear from you!
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#" 
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
                >
                  Apply to Teach
                </a>
                <a 
                  href="#" 
                  className="px-6 py-3 bg-white text-indigo-600 rounded-md font-medium border border-indigo-200 hover:bg-indigo-50 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Trainers;