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
  MousePointerClick,
  Volume2
} from 'lucide-react';
import { LessonExporter } from '@/components/learning/tools/lesson-exporter';
import { LessonTextToSpeech } from '@/components/learning/tools/lesson-text-to-speech';
import { LessonQuiz } from '@/components/learning/tools/lesson-quiz';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningModule } from '@/components/learning/module-card';

// This would come from your API/database with all module data
import { sampleModules } from '../data/learning-modules';

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
  const module = sampleModules.find((m: LearningModule) => m.id === moduleId) || sampleModules[0];
  
  // Sample lessons for this module 
  const [lessons, setLessons] = useState([
    {
      id: '1',
      title: 'Introduction to the module',
      duration: '10 mins',
      isCompleted: true,
      isLocked: false,
      contentType: 'video' as const,
      description: 'An overview of what you will learn in this module and how it will help you build real-world projects.',
      content: `Welcome to this exciting module! In this introductory lesson, we'll explore the overall structure of what you'll be learning and how it applies to real-world scenarios.

This module is designed to take you from the foundational concepts all the way to advanced implementation techniques. By the end, you'll have the skills to build your own projects from scratch.

The lessons are structured to build upon each other, so it's important to complete them in order. Each concept introduced will be used in subsequent lessons, creating a comprehensive learning experience.

Throughout this module, we've included practical exercises, real-world examples, and interactive components to ensure you're not just learning theory, but also applying what you've learned.`
    },
    {
      id: '2',
      title: 'Core concepts',
      duration: '15 mins',
      isCompleted: true,
      isLocked: false,
      contentType: 'text' as const,
      description: 'Learn the fundamental concepts that will serve as the foundation for the more advanced topics.',
      content: `In this lesson, we'll cover the core concepts that form the foundation of everything we'll build in this module.

The first key concept is component-based architecture. This approach allows us to break down complex systems into smaller, reusable pieces that can be developed and tested independently.

Next, we'll explore state management - how data flows through your application and how to maintain consistency across different parts of your system.

We'll also discuss the importance of responsive design principles, ensuring your applications work seamlessly across different devices and screen sizes.

Finally, we'll introduce you to the concept of event-driven programming, which will be crucial for building interactive user interfaces.`
    },
    {
      id: '3',
      title: 'Building your first project',
      duration: '25 mins',
      isCompleted: false,
      isLocked: false,
      contentType: 'interactive' as const,
      description: 'Apply what you have learned by building a simple project step by step with guidance.',
      content: `Now that we've covered the core concepts, it's time to put them into practice by building a small project together. This hands-on experience will solidify your understanding of the concepts we've discussed.

We'll start by planning our project, identifying the components we'll need and how they'll interact with each other. This planning phase is crucial for any successful project.

Then, we'll implement each component one by one, explaining the decisions behind our implementation choices and how they relate to the concepts we've learned.

As we build, we'll encounter common challenges and learn strategies to overcome them. These problem-solving skills will be invaluable as you progress to more complex projects.

By the end of this lesson, you'll have a functioning project that demonstrates the concepts we've covered so far.`
    },
    {
      id: '4',
      title: 'Advanced techniques',
      duration: '20 mins',
      isCompleted: false,
      isLocked: true,
      contentType: 'video' as const,
      content: `Building on our previous lessons, we'll now explore more advanced techniques that will take your skills to the next level.

We'll dive into optimization strategies to ensure your applications perform well even as they grow in complexity. You'll learn techniques for reducing unnecessary re-renders, efficiently handling large datasets, and implementing lazy loading.

Next, we'll cover advanced state management patterns for complex applications, including strategies for managing global state and handling complex data flows.

We'll also explore techniques for implementing smooth animations and transitions that enhance the user experience without sacrificing performance.

Finally, we'll discuss advanced error handling and debugging strategies that will help you identify and fix issues efficiently in your applications.`
    },
    {
      id: '5',
      title: 'Final project',
      duration: '30 mins',
      isCompleted: false,
      isLocked: true,
      contentType: 'interactive' as const,
      content: `Congratulations on making it to the final project! In this lesson, you'll apply everything you've learned throughout the module to build a comprehensive application from scratch.

Unlike the previous lessons where you received step-by-step guidance, this project will challenge you to make more independent decisions about how to implement various features.

You'll start with a set of requirements and a basic project structure, then you'll need to plan and implement the solution using the concepts and techniques we've covered.

Don't worry - we'll provide hints and suggestions along the way, but the goal is for you to practice applying your knowledge in a more open-ended context.

By completing this final project, you'll demonstrate your mastery of the module's content and gain confidence in your ability to apply these skills to your own projects in the future.`
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
                      
                      {/* Active Lesson Content */}
                      {activeLessonId && (
                        <motion.div 
                          className="mt-8 border rounded-lg p-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          {(() => {
                            const activeLesson = lessons.find(l => l.id === activeLessonId);
                            if (!activeLesson) return null;
                            
                            return (
                              <>
                                <div className="flex justify-between items-center mb-4">
                                  <h3 className="text-xl font-bold">{activeLesson.title}</h3>
                                  <div className="flex gap-3">
                                    {!activeLesson.isLocked && (
                                      <>
                                        <LessonExporter 
                                          lesson={{
                                            id: activeLesson.id,
                                            title: activeLesson.title,
                                            content: activeLesson.content || ''
                                          }}
                                          module={{
                                            title: module.title
                                          }}
                                        />
                                        <LessonQuiz
                                          lessonId={activeLesson.id}
                                          lessonTitle={activeLesson.title}
                                          onComplete={(score, total) => {
                                            console.log(`Quiz completed with score ${score}/${total}`);
                                            
                                            // In a real app, this would update the lesson progress in the database
                                            if (score / total >= 0.7) {
                                              // If passed with 70% or higher
                                              const updatedLessons = lessons.map(l => 
                                                l.id === activeLesson.id 
                                                  ? { ...l, isCompleted: true } 
                                                  : l
                                              );
                                              setLessons(updatedLessons);
                                            }
                                          }}
                                        />
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Lesson content */}
                                <div className="prose prose-slate max-w-none dark:prose-invert">
                                  {activeLesson.content?.split('\n\n').map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                  ))}
                                </div>
                                
                                {/* Text-to-speech */}
                                {!activeLesson.isLocked && activeLesson.content && (
                                  <div className="mt-8">
                                    <LessonTextToSpeech 
                                      content={activeLesson.content} 
                                      title={activeLesson.title}
                                    />
                                  </div>
                                )}
                                
                                {/* Navigation between lessons */}
                                <div className="mt-8 pt-6 border-t flex justify-between">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      const currentIndex = lessons.findIndex(l => l.id === activeLessonId);
                                      if (currentIndex > 0) {
                                        const prevLesson = lessons[currentIndex - 1];
                                        if (!prevLesson.isLocked) {
                                          setActiveLessonId(prevLesson.id);
                                        }
                                      }
                                    }}
                                    disabled={
                                      lessons.findIndex(l => l.id === activeLessonId) === 0 ||
                                      lessons[lessons.findIndex(l => l.id === activeLessonId) - 1].isLocked
                                    }
                                  >
                                    Previous Lesson
                                  </Button>
                                  
                                  <Button
                                    onClick={() => {
                                      const currentIndex = lessons.findIndex(l => l.id === activeLessonId);
                                      if (currentIndex < lessons.length - 1) {
                                        const nextLesson = lessons[currentIndex + 1];
                                        if (!nextLesson.isLocked) {
                                          setActiveLessonId(nextLesson.id);
                                        }
                                      }
                                    }}
                                    disabled={
                                      lessons.findIndex(l => l.id === activeLessonId) === lessons.length - 1 ||
                                      lessons[lessons.findIndex(l => l.id === activeLessonId) + 1].isLocked
                                    }
                                  >
                                    Next Lesson
                                  </Button>
                                </div>
                              </>
                            );
                          })()}
                        </motion.div>
                      )}
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