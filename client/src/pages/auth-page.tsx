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
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username"
                          type="text"
                          placeholder="Enter your username"
                          value={loginForm.watch('username')}
                          onChange={(e) => loginForm.setValue('username', e.target.value)}
                        />
                        {loginForm.formState.errors.username && (
                          <p className="text-sm text-red-500 mt-1">{loginForm.formState.errors.username.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginForm.watch('password')}
                          onChange={(e) => loginForm.setValue('password', e.target.value)}
                        />
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      
                      <Button 
                        type="button"
                        className="w-full"
                        disabled={loginMutation.isPending}
                        onClick={() => {
                          loginForm.handleSubmit(onLoginSubmit)();
                        }}
                      >
                        {loginMutation.isPending ? 'Logging in...' : 'Login'}
                      </Button>
                    </div>
                    
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
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name" 
                          placeholder="Enter your first name"
                          value={registrationForm.watch('first_name')}
                          onChange={(e) => registrationForm.setValue('first_name', e.target.value)}
                        />
                        {registrationForm.formState.errors.first_name && (
                          <p className="text-sm text-red-500 mt-1">{registrationForm.formState.errors.first_name.message}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age" 
                            type="number" 
                            placeholder="Age"
                            min={8}
                            max={18}
                            value={registrationForm.watch('age')}
                            onChange={(e) => registrationForm.setValue('age', parseInt(e.target.value))}
                          />
                          {registrationForm.formState.errors.age && (
                            <p className="text-sm text-red-500 mt-1">{registrationForm.formState.errors.age.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="grade_level">Grade Level</Label>
                          <Input
                            id="grade_level" 
                            placeholder="Grade (e.g., 7)"
                            value={registrationForm.watch('grade_level')}
                            onChange={(e) => registrationForm.setValue('grade_level', e.target.value)}
                          />
                          {registrationForm.formState.errors.grade_level && (
                            <p className="text-sm text-red-500 mt-1">{registrationForm.formState.errors.grade_level.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="user_type">I am a</Label>
                          <Select 
                            value={registrationForm.watch('user_type')}
                            onValueChange={(value) => registrationForm.setValue('user_type', value)}
                          >
                            <SelectTrigger id="user_type">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                            </SelectContent>
                          </Select>
                          {registrationForm.formState.errors.user_type && (
                            <p className="text-sm text-red-500 mt-1">{registrationForm.formState.errors.user_type.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={registrationForm.watch('gender')}
                            onValueChange={(value) => registrationForm.setValue('gender', value)}
                          >
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          {registrationForm.formState.errors.gender && (
                            <p className="text-sm text-red-500 mt-1">{registrationForm.formState.errors.gender.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="path_choice">Program Interest (optional)</Label>
                        <Select
                          value={registrationForm.watch('path_choice') || ''}
                          onValueChange={(value) => registrationForm.setValue('path_choice', value)}
                        >
                          <SelectTrigger id="path_choice">
                            <SelectValue placeholder="Select a program path..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="coding">Coding & Development</SelectItem>
                            <SelectItem value="design">Digital Design</SelectItem>
                            <SelectItem value="business">Business & Entrepreneurship</SelectItem>
                            <SelectItem value="gaming">Gaming & Esports</SelectItem>
                            <SelectItem value="creativity">Creative Digital Arts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="reg-username" 
                          placeholder="Choose a username"
                          value={registrationForm.watch('username')}
                          onChange={(e) => registrationForm.setValue('username', e.target.value)}
                        />
                        {registrationForm.formState.errors.username && (
                          <p className="text-sm text-red-500 mt-1">{registrationForm.formState.errors.username.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="reg-password">Password</Label>
                        <Input
                          id="reg-password" 
                          type="password"
                          placeholder="Choose a password"
                          value={registrationForm.watch('password')}
                          onChange={(e) => registrationForm.setValue('password', e.target.value)}
                        />
                        {registrationForm.formState.errors.password && (
                          <p className="text-sm text-red-500 mt-1">{registrationForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      
                      <Button 
                        type="button"
                        className="w-full"
                        disabled={registerMutation.isPending}
                        onClick={() => {
                          registrationForm.handleSubmit(onRegisterSubmit)();
                        }}
                      >
                        {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </div>
                    
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