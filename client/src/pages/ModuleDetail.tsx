import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import {
  BookOpen,
  Clock,
  Play,
  ChevronRight,
  CheckCircle,
  Clock3,
  Star,
  Award,
  ArrowLeft,
  Lock,
  FileText,
  ExternalLink,
  Video,
  MousePointerClick
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningModule } from '@/components/learning/module-card';

// This would come from your API/database with all module data
import { sampleModules } from '@/data/learning-modules';

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    duration: string;
    isCompleted: boolean;
    isLocked: boolean;
    description?: string;
    contentType: 'text' | 'video' | 'interactive';
  };
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, index, isActive, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className={`p-4 rounded-lg border mb-2 cursor-pointer transition-all ${
        isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      }`}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            lesson.isCompleted ? 'bg-green-100 text-green-600' : 
            isActive ? 'bg-primary/20 text-primary' : 
            'bg-muted text-muted-foreground'
          }`}>
            {lesson.isCompleted ? (
              <CheckCircle className="h-5 w-5" />
            ) : lesson.isLocked ? (
              <Lock className="h-5 w-5" />
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </div>
          <div>
            <h3 className={`font-medium ${lesson.isLocked ? 'text-muted-foreground' : ''}`}>
              {lesson.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Clock3 className="h-3 w-3" />
                <span>{lesson.duration}</span>
              </div>
              {lesson.contentType === 'video' && (
                <div className="flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  <span>Video</span>
                </div>
              )}
              {lesson.contentType === 'interactive' && (
                <div className="flex items-center gap-1">
                  <MousePointerClick className="h-3 w-3" />
                  <span>Interactive</span>
                </div>
              )}
              {lesson.contentType === 'text' && (
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>Reading</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {!lesson.isLocked && (
          <Button size="sm" variant={isActive ? "default" : "outline"} className="h-8">
            {lesson.isCompleted ? 'Review' : isActive ? 'Continue' : 'Start'}
          </Button>
        )}
      </div>
      {isActive && lesson.description && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 text-sm text-muted-foreground pl-11"
        >
          {lesson.description}
        </motion.div>
      )}
    </motion.div>
  );
};

interface ResourceItemProps {
  title: string;
  url: string;
  type: 'pdf' | 'link' | 'code' | 'video';
}

const ResourceItem: React.FC<ResourceItemProps> = ({ title, url, type }) => {
  const getIconForType = () => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'link':
        return <ExternalLink className="h-4 w-4 text-blue-500" />;
      case 'code':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'video':
        return <Video className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 p-3 rounded-md border hover:border-primary/50 hover:bg-primary/5 transition-colors"
    >
      {getIconForType()}
      <span className="flex-grow">{title}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </a>
  );
};

const ModuleDetail: React.FC = () => {
  const [, params] = useRoute('/learning/:id');
  const moduleId = params?.id;
  
  // Find module by ID
  const module = sampleModules.find(m => m.id === moduleId) || sampleModules[0];
  
  // Sample lessons for this module 
  const [lessons, setLessons] = useState([
    {
      id: '1',
      title: 'Introduction to the module',
      duration: '10 mins',
      isCompleted: true,
      isLocked: false,
      contentType: 'video' as const,
      description: 'An overview of what you will learn in this module and how it will help you build real-world projects.'
    },
    {
      id: '2',
      title: 'Core concepts',
      duration: '15 mins',
      isCompleted: true,
      isLocked: false,
      contentType: 'text' as const,
      description: 'Learn the fundamental concepts that will serve as the foundation for the more advanced topics.'
    },
    {
      id: '3',
      title: 'Building your first project',
      duration: '25 mins',
      isCompleted: false,
      isLocked: false,
      contentType: 'interactive' as const,
      description: 'Apply what you have learned by building a simple project step by step with guidance.'
    },
    {
      id: '4',
      title: 'Advanced techniques',
      duration: '20 mins',
      isCompleted: false,
      isLocked: true,
      contentType: 'video' as const
    },
    {
      id: '5',
      title: 'Final project',
      duration: '30 mins',
      isCompleted: false,
      isLocked: true,
      contentType: 'interactive' as const
    },
  ]);
  
  const [activeTab, setActiveTab] = useState('content');
  const [activeLessonId, setActiveLessonId] = useState(lessons.find(l => !l.isCompleted)?.id || lessons[0].id);
  
  // Calculate progress
  const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
  const totalLessons = lessons.length;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
  
  // Sample resources
  const resources = [
    {
      title: 'Module Guide PDF',
      url: '#',
      type: 'pdf' as const
    },
    {
      title: 'Official Documentation',
      url: '#',
      type: 'link' as const
    },
    {
      title: 'Starter Code Repository',
      url: '#',
      type: 'code' as const
    },
    {
      title: 'Additional Video Tutorial',
      url: '#',
      type: 'video' as const
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Module Header */}
        <section className="relative bg-gradient-to-br from-[#121645] to-[#2C2F7C] text-white py-16">
          <div className="absolute inset-0 bg-grid-white/5 mask-gradient-b" />
          <div className="container mx-auto px-4 relative z-10">
            <Link href="/learning">
              <Button variant="ghost" className="text-white mb-6 -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to all modules
              </Button>
            </Link>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <Badge className="mb-3 bg-white text-[#121645]">
                  {module.level}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{module.title}</h1>
                <p className="text-lg opacity-90 mb-6">
                  {module.description}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#3DE053]" />
                    <span>{module.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#3DE053]" />
                    <span>{completedLessons}/{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-[#3DE053]" />
                    <span>{module.category}</span>
                  </div>
                </div>
                
                <div className="w-full md:max-w-md mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Your progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 bg-white/20" />
                </div>
                
                <Button 
                  className="bg-[#3DE053] hover:bg-[#32bd45] text-black"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" /> 
                  {progressPercentage === 0 ? 'Start Learning' : 
                   progressPercentage === 100 ? 'Review Module' : 'Continue Learning'}
                </Button>
              </div>
              
              <div className="md:w-1/3 rounded-xl overflow-hidden h-64 md:h-auto relative">
                <img 
                  src={module.imageUrl} 
                  alt={module.title} 
                  className="w-full h-full object-cover" 
                />
                {module.isLocked && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <Lock className="h-16 w-16 text-white opacity-70" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Module Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs 
              defaultValue="content" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-8">
                <TabsTrigger value="content">Lesson Content</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="mt-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div className="md:col-span-2" variants={itemVariants}>
                      <h2 className="text-2xl font-bold mb-4">Module Lessons</h2>
                      <div className="space-y-2">
                        {lessons.map((lesson, index) => (
                          <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            index={index}
                            isActive={lesson.id === activeLessonId}
                            onClick={() => !lesson.isLocked && setActiveLessonId(lesson.id)}
                          />
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
                        <h3 className="font-semibold mb-4 flex items-center">
                          <Award className="h-5 w-5 text-amber-500 mr-2" />
                          Complete This Module To Earn
                        </h3>
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">250 XP</Badge>
                            <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">Community Badge</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Unlock the next level on your learning journey
                          </p>
                        </div>
                        
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-medium mb-2">What You'll Learn</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Fundamental concepts and application</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Problem-solving techniques</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Practical project implementation</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Advanced development techniques</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="resources">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.h2 className="text-2xl font-bold mb-6" variants={itemVariants}>
                    Module Resources
                  </motion.h2>
                  
                  <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={itemVariants}>
                    {resources.map((resource, index) => (
                      <ResourceItem
                        key={index}
                        title={resource.title}
                        url={resource.url}
                        type={resource.type}
                      />
                    ))}
                  </motion.div>
                  
                  <motion.div 
                    className="mt-8 bg-slate-50 dark:bg-slate-900 rounded-xl p-6"
                    variants={itemVariants}
                  >
                    <h3 className="font-semibold mb-4">Need Additional Help?</h3>
                    <p className="text-muted-foreground mb-4">
                      If you need more resources or have questions about the material, reach out to our community members or instructors.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline">Join Discord Community</Button>
                      <Button>Ask a Question</Button>
                    </div>
                  </motion.div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="discussion">
                <div className="text-center py-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-bold mb-2">Discussion Forum</h2>
                    <p className="text-muted-foreground mb-6">
                      Connect with fellow learners and instructors to discuss course content.
                    </p>
                    <Button>Coming Soon</Button>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ModuleDetail;