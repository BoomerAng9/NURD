import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import { useSupabase } from '@/components/ui/supabase-provider';

// Login schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

// Registration schema
const registerSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
});

// Magic link schema
const magicLinkSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type MagicLinkFormValues = z.infer<typeof magicLinkSchema>;

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const { supabase, user } = useSupabase();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  // Setup react-hook-form for login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Setup react-hook-form for registration
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  // Setup react-hook-form for magic link
  const magicLinkForm = useForm<MagicLinkFormValues>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle login submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Login successful',
        description: 'Welcome back to NURD Summer Initiative!',
      });
      
      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration submission
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Create user in Supabase Auth
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      toast({
        title: 'Registration successful',
        description: 'Please check your email to confirm your account.',
      });
      
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle magic link submission
  const onMagicLinkSubmit = async (data: MagicLinkFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard',
        },
      });

      if (error) {
        throw error;
      }

      setMagicLinkSent(true);
      
      toast({
        title: 'Magic link sent',
        description: 'Please check your email for the login link.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to send magic link',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Auth Forms */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Welcome to NURD</h1>
              <p className="text-muted-foreground mt-2">
                Sign in to your account or create a new one to join our Summer Initiative
              </p>
            </div>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
                <TabsTrigger value="magic">Passwordless</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          {...loginForm.register('email')}
                        />
                        {loginForm.formState.errors.email && (
                          <p className="text-sm text-red-500">
                            {loginForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Button variant="link" className="px-0 h-auto font-normal" type="button">
                            Forgot password?
                          </Button>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          {...loginForm.register('password')}
                        />
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-red-500">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-[#6A2FF8] hover:bg-[#5825c5]"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Logging in...' : 'Log in'}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                      Join the NURD Summer Initiative
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First name</Label>
                          <Input
                            id="firstName"
                            {...registerForm.register('firstName')}
                          />
                          {registerForm.formState.errors.firstName && (
                            <p className="text-sm text-red-500">
                              {registerForm.formState.errors.firstName.message}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last name</Label>
                          <Input
                            id="lastName"
                            {...registerForm.register('lastName')}
                          />
                          {registerForm.formState.errors.lastName && (
                            <p className="text-sm text-red-500">
                              {registerForm.formState.errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          {...registerForm.register('email')}
                        />
                        {registerForm.formState.errors.email && (
                          <p className="text-sm text-red-500">
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          {...registerForm.register('password')}
                        />
                        {registerForm.formState.errors.password && (
                          <p className="text-sm text-red-500">
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Must be at least 6 characters
                        </p>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-[#3DE053] hover:bg-[#32bd45] text-black"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating account...' : 'Create account'}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              {/* Magic Link Form */}
              <TabsContent value="magic">
                <Card>
                  <CardHeader>
                    <CardTitle>Passwordless Login</CardTitle>
                    <CardDescription>
                      Get a magic link sent to your email
                    </CardDescription>
                  </CardHeader>
                  
                  {magicLinkSent ? (
                    <CardContent className="space-y-4">
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-green-700">
                              Check your email for the magic link!
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-center text-sm text-gray-500">
                        Didn't receive an email? Check your spam folder or try again.
                      </p>
                      
                      <Button 
                        className="w-full"
                        variant="outline"
                        onClick={() => setMagicLinkSent(false)}
                      >
                        Try again
                      </Button>
                    </CardContent>
                  ) : (
                    <form onSubmit={magicLinkForm.handleSubmit(onMagicLinkSubmit)}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="magic-email">Email</Label>
                          <Input
                            id="magic-email"
                            type="email"
                            placeholder="you@example.com"
                            {...magicLinkForm.register('email')}
                          />
                          {magicLinkForm.formState.errors.email && (
                            <p className="text-sm text-red-500">
                              {magicLinkForm.formState.errors.email.message}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter>
                        <Button 
                          type="submit" 
                          className="w-full bg-[#3EC6E0] hover:bg-[#2ca4ba] text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Sending...' : 'Send Magic Link'}
                        </Button>
                      </CardFooter>
                    </form>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column - Hero */}
          <div className="hidden md:flex flex-col justify-center rounded-2xl overflow-hidden bg-gradient-to-br from-[#6A2FF8] via-[#3EC6E0] to-[#3DE053] p-10 text-white">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Join the NURD Summer Initiative</h2>
                <p className="text-lg opacity-90">
                  Where Creativity Meets Education for the Ultimate Learning Experience
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Access to exclusive NURD content and resources</p>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Connect with experienced trainers and mentors</p>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Share your creative work in our community gallery</p>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Track your progress and learning journey</p>
                </div>
              </div>
              
              <div>
                <p className="text-lg font-semibold mb-2">Get ready for Summer 2025!</p>
                <p className="opacity-80">
                  Join us for an unforgettable summer experience where children develop 
                  creative and technical skills in a nurturing environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AuthPage;