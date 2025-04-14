import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/login', credentials);

      if (!response.ok) {
        throw new Error('Login failed');
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      setLocation('/dashboard');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1"> {/* Removed md:grid-cols-2 */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Welcome to NURD</h1>
              <p className="text-muted-foreground mt-2">
                Sign in to your account 
              </p>
            </div>
            <Card className="w-full max-w-md p-6">
              <h1 className="text-2xl font-bold mb-6">Login to NURD</h1>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Username"
                      value={credentials.username}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        username: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"  
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        password: e.target.value
                      }))}
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-[#6A2FF8] hover:bg-[#5825c5]"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}