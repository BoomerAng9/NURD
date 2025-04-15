import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import { useAuth } from '@/hooks/use-auth';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { registrationSchema } from '@shared/schema';

// Form schema for login
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  // Setup login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  // Setup registration form
  const registrationForm = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      first_name: '',
      age: 12,
      grade_level: '7',
      user_type: 'student',
      gender: 'prefer_not_to_say',
      path_choice: '',
      username: '',
      password: ''
    }
  });

  // Handle login submission
  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        setLocation('/');
      }
    });
  };

  // Handle registration submission
  const onRegisterSubmit = async (values: z.infer<typeof registrationSchema>) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        setLocation('/');
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full mx-auto grid md:grid-cols-2 gap-8">
          {/* Left side: Auth forms */}
          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Welcome to NURD</h1>
              <p className="text-muted-foreground mt-2">
                Sign in to your account or create a new one
              </p>
            </div>
            
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  {/* Login Form */}
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit"
                          className="w-full"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? 'Logging in...' : 'Login'}
                        </Button>
                      </form>
                    </Form>
                    
                    <div className="mt-4 text-center text-sm">
                      <p>Don't have an account?{" "}
                        <span 
                          className="text-primary cursor-pointer hover:underline"
                          onClick={() => setActiveTab("register")}
                        >
                          Register
                        </span>
                      </p>
                    </div>
                  </TabsContent>
                  
                  {/* Registration Form */}
                  <TabsContent value="register">
                    <Form {...registrationForm}>
                      <form onSubmit={registrationForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registrationForm.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your first name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={registrationForm.control}
                            name="age"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="Age"
                                    min={8}
                                    max={18}
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registrationForm.control}
                            name="grade_level"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Grade Level</FormLabel>
                                <FormControl>
                                  <Input placeholder="Grade (e.g., 7)" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={registrationForm.control}
                            name="user_type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>I am a</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="parent">Parent</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registrationForm.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={registrationForm.control}
                          name="path_choice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Program Interest (optional)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a program path..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="coding">Coding & Development</SelectItem>
                                  <SelectItem value="design">Digital Design</SelectItem>
                                  <SelectItem value="business">Business & Entrepreneurship</SelectItem>
                                  <SelectItem value="gaming">Gaming & Esports</SelectItem>
                                  <SelectItem value="creativity">Creative Digital Arts</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registrationForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registrationForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Choose a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit"
                          className="w-full"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                        </Button>
                      </form>
                    </Form>
                    
                    <div className="mt-4 text-center text-sm">
                      <p>Already have an account?{" "}
                        <span 
                          className="text-primary cursor-pointer hover:underline"
                          onClick={() => setActiveTab("login")}
                        >
                          Login
                        </span>
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Right side: Hero section */}
          <div className="hidden md:flex flex-col justify-center p-6 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm rounded-lg text-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Become a NURD</h2>
              <p className="text-lg">
                Join our summer initiative for Naturally Unstoppable Resourceful Dreamers
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-background/20 backdrop-blur-md rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Learn Through Creation</h3>
                <p>Our project-based approach helps you develop real skills while building amazing projects</p>
              </div>
              
              <div className="p-4 bg-background/20 backdrop-blur-md rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Connect with Peers</h3>
                <p>Collaborate, share ideas, and make friends with like-minded creative thinkers</p>
              </div>
              
              <div className="p-4 bg-background/20 backdrop-blur-md rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Build Your Future</h3>
                <p>Develop technical and soft skills that prepare you for success in the digital age</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}