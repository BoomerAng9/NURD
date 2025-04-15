import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import SocialLoginButtons from "@/components/auth/social-login-buttons";
import nurdHeroImage from "@assets/IMG_0115.jpeg";

// Define schemas for form validation
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  first_name: z.string().min(1, "First name is required"),
  age: z.union([
    z.string().refine(val => val === '', { message: 'Age is required' }),
    z.number().min(8, "Minimum age is 8").max(18, "Maximum age is 18")
  ]),
  grade_level: z.string().min(1, "Grade level is required"),
  user_type: z.enum(["student", "parent"]),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  path_choice: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      toast({
        title: "Already logged in",
        description: "You are already logged in. Redirecting to dashboard...",
      });
      setLocation('/dashboard');
    }
  }, [user, isLoading, setLocation, toast]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      first_name: "",
      age: 12,
      grade_level: "",
      user_type: "student",
      gender: "prefer_not_to_say",
      path_choice: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...formData } = data;
    
    // Ensure age is a number for API submission
    const registerData = {
      ...formData,
      age: typeof formData.age === 'string' ? 12 : formData.age  // Default to 12 if empty string
    };
    
    registerMutation.mutate(registerData);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#121645] to-[#0A0A1B]">
      {/* Left column - Auth Forms */}
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Welcome to NURD</h1>
            <p className="mt-2 text-gray-400">Join the community of Naturally Unstoppable Resourceful Dreamers</p>
          </div>

          <Card className="w-full backdrop-blur-xl bg-white/10 border-gray-700/30">
            <CardHeader>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={activeTab === "login" ? "default" : "outline"} 
                  onClick={() => setActiveTab("login")}
                  className="w-full"
                >
                  Login
                </Button>
                <Button 
                  variant={activeTab === "register" ? "default" : "outline"} 
                  onClick={() => setActiveTab("register")}
                  className="w-full"
                >
                  Register
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === "login" ? (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your username" 
                              className="bg-white/5 border-gray-700 focus:border-primary text-white" 
                              {...field} 
                            />
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
                          <FormLabel className="text-gray-200">Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your password" 
                              className="bg-white/5 border-gray-700 focus:border-primary text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full btn-nurd"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Choose a username" 
                              className="bg-white/5 border-gray-700 focus:border-primary text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">First Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your first name" 
                              className="bg-white/5 border-gray-700 focus:border-primary text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Age</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                min={8}
                                max={18}
                                placeholder="Your age" 
                                className="bg-white/5 border-gray-700 focus:border-primary text-white" 
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value === '' ? '' : parseInt(value));
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="grade_level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Grade Level</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your grade" 
                                className="bg-white/5 border-gray-700 focus:border-primary text-white" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="user_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">User Type</FormLabel>
                            <select
                              className="flex h-10 w-full rounded-md border border-gray-700 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              {...field}
                            >
                              <option value="student" className="bg-gray-800">Student</option>
                              <option value="parent" className="bg-gray-800">Parent</option>
                            </select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Gender</FormLabel>
                            <select
                              className="flex h-10 w-full rounded-md border border-gray-700 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              {...field}
                            >
                              <option value="male" className="bg-gray-800">Male</option>
                              <option value="female" className="bg-gray-800">Female</option>
                              <option value="other" className="bg-gray-800">Other</option>
                              <option value="prefer_not_to_say" className="bg-gray-800">Prefer not to say</option>
                            </select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={registerForm.control}
                      name="path_choice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">Preferred Learning Path (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Coding, Art, Design, etc." 
                              className="bg-white/5 border-gray-700 focus:border-primary text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Create a password" 
                              className="bg-white/5 border-gray-700 focus:border-primary text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Confirm your password" 
                              className="bg-white/5 border-gray-700 focus:border-primary text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full btn-nurd"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pb-6">
              <div className="w-full border-t border-gray-700 my-2"></div>
              <div className="text-sm text-gray-400 text-center">
                {activeTab === "login" ? (
                  <p>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setActiveTab("register")}
                      className="text-primary hover:underline focus:outline-none"
                    >
                      Register here
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      onClick={() => setActiveTab("login")}
                      className="text-primary hover:underline focus:outline-none"
                    >
                      Log in
                    </button>
                  </p>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right column - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#121645]/90 to-transparent z-10"></div>
        <img
          src={nurdHeroImage}
          alt="NURD Initiative"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-12 z-20">
          <h2 className="text-4xl font-bold text-white mb-6">
            Become a <span className="text-[#3DE053]">NURD</span>
          </h2>
          <p className="text-lg text-gray-200 max-w-md mb-8">
            Join our community of creators, innovators, and problem-solvers. The NURD Summer Initiative offers hands-on learning experiences in technology, creativity, and collaboration.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-[#3DE053]/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3DE053]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white">Hands-on learning experiences</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-[#3EC6E0]/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3EC6E0]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white">Creative coding and project-based learning</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-[#FF8A00]/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF8A00]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white">Community building and collaboration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}