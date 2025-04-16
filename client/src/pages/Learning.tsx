import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import ModulesGrid from '@/components/learning/modules-grid';
import { LearningModule } from '@/components/learning/module-card';
import { BookOpen, Code, Lightbulb, Award, ArrowRight, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const featuredModule: LearningModule = {
  id: '3',
  title: 'Game Development with JavaScript',
  description: 'Create exciting games that you can play and share with friends. Learn game mechanics, physics, animations, and more in this comprehensive course.',
  imageUrl: 'https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=3174&auto=format&fit=crop',
  category: 'Game Development',
  level: 'Intermediate',
  duration: '6 hours',
  progress: 25,
  isLocked: false,
  completeCount: 2,
  totalLessons: 8
};

const Learning: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative bg-gradient-to-br from-[#121645] to-[#2C2F7C] text-white">
        <div className="absolute inset-0 bg-grid-white/5 mask-gradient-b" />
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Interactive Learning Modules</h1>
            <p className="text-xl opacity-90 mb-8">
              Explore our collection of interactive modules designed to make coding fun, 
              engaging, and accessible for learners of all levels.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-[#3DE053]" />
                <span className="font-medium">Self-Paced</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Code className="h-8 w-8 mx-auto mb-2 text-[#3DE053]" />
                <span className="font-medium">Interactive</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 text-[#3DE053]" />
                <span className="font-medium">Creative</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-[#3DE053]" />
                <span className="font-medium">Earn Badges</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          {/* Create AI Course Section - Moved to Top */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-8 mb-12 backdrop-blur-sm border border-purple-500/30"
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl font-bold mb-4">Create Your Own AI-Generated Course</h2>
                <p className="mb-6 max-w-2xl text-gray-700 dark:text-gray-300">
                  Design personalized learning experiences with our AI course generator. 
                  Generate comprehensive course materials for any topic in seconds. 
                  Perfect for educators, mentors, and self-learners!
                </p>
              </div>
              <Link href="/learning/create">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 rounded-xl shadow-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create AI Course
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Motivation Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#13172a] text-white rounded-xl p-8 mb-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#3DE053]/20 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">Ready to Dive Into Learning?</h2>
              <p className="mb-6 max-w-3xl">
                Our modules combine fun activities with real-world applications, allowing you to 
                build your skills while creating projects you can be proud of. Track your progress 
                and earn badges as you complete each module!
              </p>
              <Link href="/register">
                <Button className="bg-[#3DE053] hover:bg-[#32bd45] text-black">
                  Join the NURD Program <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Learning Modules */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Learning Modules</h2>
              <Link href="/apply">
                <Button variant="outline" className="text-primary border-primary/30 hover:bg-primary/10">
                  <Plus className="mr-2 h-4 w-4" />
                  Apply to Teach
                </Button>
              </Link>
            </div>
            <ModulesGrid featured={featuredModule} />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Learning;