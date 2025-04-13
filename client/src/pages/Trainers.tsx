import React, { useState } from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import TrainersList from '@/components/trainers/trainers-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Trainers: React.FC = () => {
  const [viewMode, setViewMode] = useState<'default' | 'compact'>('default');
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-12">
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