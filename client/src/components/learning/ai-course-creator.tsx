import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileUp, 
  BookOpen, 
  Sparkles, 
  Loader2, 
  Download, 
  ChevronDown, 
  X, 
  Check, 
  MessageSquareDashed,
  Zap,
  Book
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useMutation } from '@tanstack/react-query';

interface AICreateCourseResponse {
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  duration: string;
  totalLessons: number;
  lessons: {
    id: string;
    title: string;
    description: string;
    content: string;
    duration: string;
    resources?: {
      title: string;
      url: string;
      type: string;
    }[];
  }[];
}

interface FileUploadState {
  file: File | null;
  name: string;
  size: string;
  type: string;
  progress: number;
  error?: string;
}

export function AICourseCreator() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('topic');
  const [topic, setTopic] = useState('');
  const [additional, setAdditional] = useState('');
  const [fileUpload, setFileUpload] = useState<FileUploadState>({
    file: null,
    name: '',
    size: '',
    type: '',
    progress: 0
  });
  const [generatedCourse, setGeneratedCourse] = useState<AICreateCourseResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // For more detailed customization if needed
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [targetAudience, setTargetAudience] = useState('beginners');
  const [courseLength, setCourseLength] = useState('medium');
  const [includeQuizzes, setIncludeQuizzes] = useState(true);
  
  // Course generation using AI API
  const generateCourseMutation = useMutation({
    mutationFn: async (data: { 
      type: 'topic' | 'file',
      topic?: string, 
      additional?: string,
      file?: File,
      targetAudience?: string,
      courseLength?: string,
      includeQuizzes?: boolean
    }) => {
      try {
        let fileContent = '';
        if (data.type === 'file' && data.file) {
          // Read file content as text
          const reader = new FileReader();
          fileContent = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsText(data.file as File);
          });
        }
        
        // API request to the server
        const response = await fetch('/api/ai/generate-course', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: data.type,
            topic: data.topic,
            additional: data.additional,
            fileContent: fileContent,
            targetAudience: data.targetAudience,
            courseLength: data.courseLength,
            includeQuizzes: data.includeQuizzes
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate course');
        }
        
        return await response.json() as AICreateCourseResponse;
      } catch (error) {
        console.error('Error generating course:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setGeneratedCourse(data);
      toast({
        title: "Course Generated Successfully",
        description: "Your course has been created with AI assistance.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Generate Course",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 10MB for example)
      if (file.size > 10 * 1024 * 1024) {
        setFileUpload({
          file: null,
          name: '',
          size: '',
          type: '',
          progress: 0,
          error: 'File is too large. Maximum size is 10MB.'
        });
        return;
      }
      
      // Check file type (PDF, DOCX, etc.)
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setFileUpload({
          file: null,
          name: '',
          size: '',
          type: '',
          progress: 0,
          error: 'Invalid file type. Please upload a PDF or DOCX file.'
        });
        return;
      }
      
      // Set file data
      setFileUpload({
        file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type.split('/')[1].toUpperCase(),
        progress: 100
      });
    }
  };
  
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveFile = () => {
    setFileUpload({
      file: null,
      name: '',
      size: '',
      type: '',
      progress: 0
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleGenerateCourse = () => {
    if (activeTab === 'topic' && !topic.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a topic for your course.",
        variant: "destructive",
      });
      return;
    }
    
    if (activeTab === 'file' && !fileUpload.file) {
      toast({
        title: "Missing Information",
        description: "Please upload a file to generate a course.",
        variant: "destructive",
      });
      return;
    }
    
    generateCourseMutation.mutate({
      type: activeTab as 'topic' | 'file',
      topic,
      additional,
      file: fileUpload.file || undefined,
      targetAudience,
      courseLength,
      includeQuizzes
    });
  };
  
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row items-center justify-center mb-8 gap-4">
          <Sparkles className="h-10 w-10 text-primary" />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold mb-2">AI Course Creator</h1>
            <p className="text-muted-foreground max-w-xl">
              Generate comprehensive learning modules from topics or uploaded documents with AI assistance.
            </p>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Panel */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Create From</CardTitle>
              <CardDescription>
                Choose your preferred method for creating a course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="topic" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="topic">
                    <MessageSquareDashed className="h-4 w-4 mr-2" />
                    Topic
                  </TabsTrigger>
                  <TabsTrigger value="file">
                    <FileUp className="h-4 w-4 mr-2" />
                    File Upload
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="topic" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Course Topic</label>
                    <Input
                      placeholder="e.g., JavaScript for Beginners, Web Development, Data Science"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="mb-4"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Additional Information (Optional)</label>
                    <Textarea
                      placeholder="Add any specific areas to focus on, learning objectives, etc."
                      value={additional}
                      onChange={(e) => setAdditional(e.target.value)}
                      className="h-24 mb-4"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="file">
                  <div 
                    onClick={handleFileUploadClick}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      fileUpload.file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-primary/5'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.docx"
                    />
                    
                    {!fileUpload.file ? (
                      <div className="space-y-4">
                        <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto">
                          <FileUp className="h-6 w-6 text-primary mx-auto" />
                        </div>
                        <div>
                          <p className="font-medium mb-1">Click to upload or drag and drop</p>
                          <p className="text-sm text-muted-foreground">PDF or DOCX (max 10MB)</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge variant="outline" className="bg-primary/10 border-primary/10">
                              {fileUpload.type}
                            </Badge>
                            <Check className="h-4 w-4 text-green-500 ml-2" />
                          </div>
                          <Button
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile();
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-left">
                          <p className="font-medium truncate max-w-xs">{fileUpload.name}</p>
                          <p className="text-xs text-muted-foreground">{fileUpload.size}</p>
                        </div>
                      </div>
                    )}
                    
                    {fileUpload.error && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{fileUpload.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-sm flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Advanced Options
                    <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 border-t pt-4"
                  >
                    <div>
                      <label className="text-sm font-medium mb-2 block">Target Audience</label>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={targetAudience === 'beginners' ? 'default' : 'outline'}
                          onClick={() => setTargetAudience('beginners')}
                        >
                          Beginners
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={targetAudience === 'intermediate' ? 'default' : 'outline'}
                          onClick={() => setTargetAudience('intermediate')}
                        >
                          Intermediate
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={targetAudience === 'advanced' ? 'default' : 'outline'}
                          onClick={() => setTargetAudience('advanced')}
                        >
                          Advanced
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Course Length</label>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={courseLength === 'short' ? 'default' : 'outline'}
                          onClick={() => setCourseLength('short')}
                          className="flex-1"
                        >
                          Short
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={courseLength === 'medium' ? 'default' : 'outline'}
                          onClick={() => setCourseLength('medium')}
                          className="flex-1"
                        >
                          Medium
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={courseLength === 'long' ? 'default' : 'outline'}
                          onClick={() => setCourseLength('long')}
                          className="flex-1"
                        >
                          Comprehensive
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Include Quizzes/Assessments</label>
                      <Button
                        type="button"
                        size="sm"
                        variant={includeQuizzes ? 'default' : 'outline'}
                        onClick={() => setIncludeQuizzes(!includeQuizzes)}
                      >
                        {includeQuizzes ? 'Yes' : 'No'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={handleGenerateCourse}
                disabled={generateCourseMutation.isPending}
              >
                {generateCourseMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Course...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Course with AI
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Preview Panel */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Course Preview</CardTitle>
              <CardDescription>
                {generatedCourse 
                  ? 'Review your AI-generated course curriculum'
                  : 'Your generated course will appear here'}
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px]">
              {!generatedCourse && !generateCourseMutation.isPending ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <Book className="h-16 w-16 text-primary/20 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Course Generated Yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    Use the options on the left to create a new course using AI. You can start from a topic or upload material.
                  </p>
                </div>
              ) : generateCourseMutation.isPending ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="relative mb-6">
                    <Loader2 className="h-16 w-16 text-primary/40 animate-spin" />
                    <Sparkles className="h-8 w-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Generating Your Course</h3>
                  <p className="text-muted-foreground max-w-md">
                    Please wait while our AI analyzes your input and creates a comprehensive course structure...
                  </p>
                </div>
              ) : generatedCourse && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{generatedCourse.title}</h2>
                      <p className="text-muted-foreground mb-4">
                        {generatedCourse.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="bg-primary/10 border-primary/10 text-primary">
                          {generatedCourse.level}
                        </Badge>
                        <Badge variant="outline">
                          {generatedCourse.category}
                        </Badge>
                        <Badge variant="outline">
                          {generatedCourse.duration}
                        </Badge>
                        <Badge variant="outline">
                          {generatedCourse.totalLessons} Lessons
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {generatedCourse.lessons.map((lesson, index) => (
                      <AccordionItem key={lesson.id} value={lesson.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="text-left">
                              <h3 className="font-medium">{lesson.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                {lesson.duration}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-11">
                          <p className="mb-4 text-muted-foreground">
                            {lesson.description}
                          </p>
                          
                          {lesson.resources && lesson.resources.length > 0 && (
                            <div className="space-y-2 mt-4">
                              <h4 className="text-sm font-medium">Lesson Resources</h4>
                              <ul className="space-y-1">
                                {lesson.resources.map((resource, i) => (
                                  <li key={i} className="text-sm flex items-center text-blue-500 hover:text-blue-700">
                                    <span className="text-muted-foreground mr-2">•</span>
                                    <a href={resource.url} target="_blank" rel="noreferrer">
                                      {resource.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </CardContent>
            
            {generatedCourse && (
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Course
                </Button>
                <Button>
                  <Zap className="mr-2 h-4 w-4" />
                  Publish to LMS
                </Button>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}