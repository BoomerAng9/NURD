import React from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import { AICourseCreator } from '@/components/learning/ai-course-creator';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft, GraduationCap, LightbulbIcon, BookOpen } from 'lucide-react';

const AICourseCreatorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-br from-[#121645] to-[#2C2F7C] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <Link href="/learning">
                  <Button variant="ghost" className="text-white mb-4 -ml-2">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Learning
                  </Button>
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Course Creator</h1>
                <p className="text-lg opacity-90 max-w-2xl">
                  Create comprehensive learning materials with AI assistance. Upload your PDF documents 
                  or simply describe a topic to generate structured courses with lessons, quizzes, and resources.
                </p>
                
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <GraduationCap className="h-8 w-8 mx-auto mb-2 text-[#3DE053]" />
                    <span className="font-medium">Auto-Generated Content</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <LightbulbIcon className="h-8 w-8 mx-auto mb-2 text-[#3DE053]" />
                    <span className="font-medium">PDF Analysis</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-[#3DE053]" />
                    <span className="font-medium">Structured Lessons</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <AICourseCreator />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AICourseCreatorPage;