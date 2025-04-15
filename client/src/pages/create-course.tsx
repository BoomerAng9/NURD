import React, { useState } from 'react';
import { PageTransition } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, X, Plus, Upload, FileText, BookOpen, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define the form schema with Zod
const courseFormSchema = z.object({
  title: z.string().min(5, { message: "Course title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  objectives: z.string().min(10, { message: "Objectives must be at least 10 characters" }),
  difficulty: z.string().min(1, { message: "Please select a difficulty level" }),
  isPublic: z.boolean().default(true),
  estimatedDuration: z.string().min(1, { message: "Please provide an estimated duration" }),
});

// Infer the form types from the schema
type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function CreateCoursePage() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Initialize the form with default values
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      objectives: '',
      difficulty: 'beginner',
      isPublic: true,
      estimatedDuration: '',
    },
  });

  // Handle form submission
  const onSubmit = (data: CourseFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      console.log({ ...data, tags, files: uploadedFiles });
      
      toast({
        title: "Course Created!",
        description: "Your course has been successfully created and is ready for students.",
        variant: "default",
      });
      
      setIsSubmitting(false);
      form.reset();
      setTags([]);
      setUploadedFiles([]);
      setActiveTab('basic');
    }, 1500);
  };

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsUploading(true);
      
      // Simulate upload delay
      setTimeout(() => {
        const newFiles = Array.from(e.target.files || []).map(file => file.name);
        setUploadedFiles([...uploadedFiles, ...newFiles]);
        setIsUploading(false);
        
        toast({
          title: "Files Uploaded",
          description: `${newFiles.length} file(s) successfully uploaded.`,
          variant: "default",
        });
      }, 1000);
    }
  };

  // Handle tag addition
  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  // Handle tag removal
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle tag input keypress (add on Enter)
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Create a Course
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Design and publish your own course for the NURD community. 
              Share your expertise and help others develop their skills and creativity.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="border border-border/40 backdrop-blur-sm bg-background/60 shadow-md">
            <CardContent className="p-6">
              <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="basic" className="data-[state=active]:bg-primary/20">
                    <FileText className="h-4 w-4 mr-2" />
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="content" className="data-[state=active]:bg-primary/20">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="publish" className="data-[state=active]:bg-primary/20">
                    <Users className="h-4 w-4 mr-2" />
                    Publish
                  </TabsTrigger>
                </TabsList>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <TabsContent value="basic" className="space-y-6 mt-0">
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Title</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., Introduction to Web Development" 
                                  {...field} 
                                  className="bg-background/50 border-border/50"
                                />
                              </FormControl>
                              <FormDescription>
                                Choose a clear, descriptive title that represents your course content.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Provide an overview of what students will learn..." 
                                  rows={4} 
                                  {...field} 
                                  className="bg-background/50 border-border/50"
                                />
                              </FormControl>
                              <FormDescription>
                                Describe the course content, goals, and what students will achieve.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants}>
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-background/50 border-border/50">
                                      <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="stem">STEM</SelectItem>
                                    <SelectItem value="arts">Arts</SelectItem>
                                    <SelectItem value="programming">Programming</SelectItem>
                                    <SelectItem value="design">Design</SelectItem>
                                    <SelectItem value="business">Business</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                          <FormField
                            control={form.control}
                            name="difficulty"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Difficulty Level</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-background/50 border-border/50">
                                      <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </div>
                      
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="estimatedDuration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estimated Duration</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., 4 weeks, 10 hours" 
                                  {...field} 
                                  className="bg-background/50 border-border/50"
                                />
                              </FormControl>
                              <FormDescription>
                                How long will it take students to complete the course?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          onClick={() => setActiveTab('content')}
                          className="bg-primary/90 hover:bg-primary text-white"
                        >
                          Next: Course Content
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="content" className="space-y-6 mt-0">
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="objectives"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Learning Objectives</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="List the key learning objectives, one per line..." 
                                  rows={4} 
                                  {...field} 
                                  className="bg-background/50 border-border/50"
                                />
                              </FormControl>
                              <FormDescription>
                                What specific skills or knowledge will students gain from this course?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="space-y-3">
                        <FormLabel>Course Tags</FormLabel>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1 bg-primary/10">
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-2 text-foreground/60 hover:text-foreground"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a tag..."
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={handleTagKeyPress}
                            className="bg-background/50 border-border/50"
                          />
                          <Button
                            type="button"
                            onClick={addTag}
                            size="sm"
                            variant="outline"
                            className="flex-shrink-0"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        <FormDescription>
                          Tags help students find your course. Add relevant keywords.
                        </FormDescription>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="space-y-3">
                        <FormLabel>Course Materials</FormLabel>
                        <div className="p-4 border border-dashed border-border/70 rounded-lg text-center bg-background/30">
                          <div className="space-y-3">
                            <div className="flex justify-center">
                              {isUploading ? (
                                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                              ) : (
                                <Upload className="h-10 w-10 text-primary/70" />
                              )}
                            </div>
                            <p className="text-sm text-foreground/70">
                              Drag and drop files here, or click to browse
                            </p>
                            <div>
                              <input
                                type="file"
                                multiple
                                id="file-upload"
                                className="sr-only"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                              />
                              <label htmlFor="file-upload">
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={isUploading}
                                  className="bg-background/50"
                                >
                                  {isUploading ? 'Uploading...' : 'Upload Files'}
                                </Button>
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        {uploadedFiles.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium">Uploaded Files:</p>
                            <ul className="space-y-2">
                              {uploadedFiles.map((file, index) => (
                                <li key={index} className="flex items-center justify-between bg-background/40 p-2 rounded-md">
                                  <span className="flex items-center">
                                    <FileText className="h-4 w-4 text-primary/80 mr-2" />
                                    {file}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <FormDescription>
                          Upload slides, worksheets, example code, or any materials students will need.
                        </FormDescription>
                      </motion.div>
                      
                      <div className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setActiveTab('basic')}
                        >
                          Back
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => setActiveTab('publish')}
                          className="bg-primary/90 hover:bg-primary text-white"
                        >
                          Next: Publish Settings
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="publish" className="space-y-6 mt-0">
                      <motion.div variants={itemVariants} className="space-y-3">
                        <FormField
                          control={form.control}
                          name="isPublic"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-background/40">
                              <div className="space-y-1">
                                <FormLabel>Make Course Public</FormLabel>
                                <FormDescription>
                                  When enabled, your course will be visible to all users.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="rounded-lg border border-border/40 bg-background/40 p-4">
                          <h3 className="font-medium text-lg mb-2 flex items-center">
                            <Sparkles className="h-5 w-5 text-primary mr-2" />
                            Course Preview
                          </h3>
                          <div className="bg-background/60 rounded-md p-4 mb-4">
                            <h4 className="font-bold text-xl">
                              {form.watch('title') || 'Course Title'}
                            </h4>
                            <p className="text-sm text-foreground/70 mt-2">
                              {form.watch('description') || 'Course description will appear here...'}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {form.watch('category') && (
                                <Badge variant="outline" className="bg-primary/10">
                                  {form.watch('category')}
                                </Badge>
                              )}
                              {form.watch('difficulty') && (
                                <Badge variant="outline" className="bg-blue-500/10">
                                  {form.watch('difficulty')}
                                </Badge>
                              )}
                              {tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="bg-secondary/10">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-foreground/70">
                            This is how your course will appear in the course listings.
                          </p>
                        </div>
                      </motion.div>
                      
                      <div className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setActiveTab('content')}
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-primary hover:bg-primary/90 text-white"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Course...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Publish Course
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}