import React from 'react';
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/sections/footer";
import AvatarGenerator from "@/components/avatar/avatar-generator";
import { useSupabase } from '@/components/ui/supabase-provider';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';

const AvatarCreator: React.FC = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!user && !isLoading) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create and save your custom avatar.",
        variant: "destructive",
      });
      
      const timer = setTimeout(() => {
        setLocation('/auth');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, setLocation, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-20">
          <Card className="w-[380px]">
            <CardHeader>
              <div className="flex items-center justify-center mb-4 text-red-500">
                <ShieldAlert size={40} />
              </div>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please log in to create and customize your avatar.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              <p>
                Your personalized avatar will be saved to your profile and can be used throughout the NURD platform.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setLocation('/')}>
                Go Home
              </Button>
              <Button onClick={() => setLocation('/auth')}>
                Login
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Create Your NURD Avatar
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Take a personality quiz and design a custom avatar that reflects your unique traits and style!
              </p>
            </div>
            
            <AvatarGenerator />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AvatarCreator;