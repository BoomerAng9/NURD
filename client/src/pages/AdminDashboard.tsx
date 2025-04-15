import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLandingEditor } from '@/components/landing/admin-editor';
import { useToast } from '@/hooks/use-toast';
import { LandingContent } from '@shared/schema';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import { useAuth } from '@/hooks/use-auth';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  BarChart, 
  ListTodo,
  Megaphone, 
  ShieldAlert,
  BookOpenCheck,
  PenSquare
} from 'lucide-react';
import {
  FuturisticContainer,
  FadeIn,
  ScaleIn
} from '@/components/animations/futuristic-transitions';

const AdminDashboard: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();

  // Check if user is admin
  useEffect(() => {
    if (user) {
      // In a real app, this would check a database or role
      // For demo, we'll set all logged in users as admin
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      toast({
        title: "Access Restricted",
        description: "Please log in to access the admin dashboard",
        variant: "destructive"
      });
      
      const timer = setTimeout(() => {
        setLocation('/register');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [user, setLocation, toast]);

  // Fetch landing content data
  const { data: landingContent, isLoading } = useQuery<LandingContent[]>({
    queryKey: ['/api/landing-content'],
    enabled: isAdmin
  });

  // Mutation for saving landing content
  const updateContentMutation = useMutation({
    mutationFn: async (contentData: Partial<LandingContent>) => {
      const response = await fetch('/api/landing-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contentData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update content');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/landing-content'] });
      toast({
        title: "Content Updated",
        description: "Your changes have been saved successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Mutation for deleting landing content
  const deleteContentMutation = useMutation({
    mutationFn: async (contentId: number) => {
      const response = await fetch(`/api/landing-content/${contentId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete content');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/landing-content'] });
      toast({
        title: "Content Deleted",
        description: "The section has been removed successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Mutation for reordering content
  const reorderContentMutation = useMutation({
    mutationFn: async (orderedIds: number[]) => {
      const response = await fetch('/api/landing-content/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderedIds })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reorder content');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/landing-content'] });
      toast({
        title: "Order Updated",
        description: "Landing page sections have been reordered"
      });
    },
    onError: (error) => {
      toast({
        title: "Reorder Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Handle content save
  const handleSaveContent = (content: any) => {
    updateContentMutation.mutate(content);
  };

  // Handle content delete
  const handleDeleteContent = (id: number) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      deleteContentMutation.mutate(id);
    }
  };

  // Handle content reorder
  const handleReorderContent = (orderedIds: number[]) => {
    reorderContentMutation.mutate(orderedIds);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Restricted</CardTitle>
              <CardDescription>
                You must be an administrator to view this page.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex justify-center w-full">
                <ShieldAlert className="h-16 w-16 text-red-500" />
              </div>
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
      
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <FadeIn>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium">
                Administrator Access
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Sidebar Navigation */}
            <FadeIn delay={0.2} className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4">
                  <h2 className="font-bold text-xl">Control Panel</h2>
                </div>
                <nav className="p-4">
                  <ul className="space-y-2">
                    <li>
                      <a 
                        href="#dashboard" 
                        className="flex items-center p-3 rounded-lg bg-indigo-50 text-indigo-800 font-medium"
                      >
                        <LayoutDashboard className="h-5 w-5 mr-3" />
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#users" 
                        className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                      >
                        <Users className="h-5 w-5 mr-3" />
                        Users Management
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#content" 
                        className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                      >
                        <FileText className="h-5 w-5 mr-3" />
                        Content Manager
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#courses" 
                        className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                      >
                        <BookOpenCheck className="h-5 w-5 mr-3" />
                        Courses & Lessons
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#tasks" 
                        className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                      >
                        <ListTodo className="h-5 w-5 mr-3" />
                        Tasks & Projects
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#analytics" 
                        className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                      >
                        <BarChart className="h-5 w-5 mr-3" />
                        Analytics
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#announcements" 
                        className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                      >
                        <Megaphone className="h-5 w-5 mr-3" />
                        Announcements
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#settings" 
                        className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                      >
                        <Settings className="h-5 w-5 mr-3" />
                        Settings
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </FadeIn>

            {/* Main Content Area */}
            <div className="lg:col-span-4 space-y-8">
              <ScaleIn>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold">158</span>
                        <span className="text-blue-100">Active Users</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold">12</span>
                        <span className="text-purple-100">Active Courses</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold">89%</span>
                        <span className="text-emerald-100">Completion Rate</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-amber-600 to-amber-700 text-white border-0">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold">32</span>
                        <span className="text-amber-100">Pending Tasks</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScaleIn>

              <FadeIn delay={0.4}>
                {/* Content Management */}
                <Tabs defaultValue="landing-editor" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="landing-editor">
                      <PenSquare className="h-4 w-4 mr-2" /> 
                      Landing Page Editor
                    </TabsTrigger>
                    <TabsTrigger value="pages">
                      <FileText className="h-4 w-4 mr-2" /> 
                      Other Pages
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="landing-editor">
                    <Card>
                      <CardHeader>
                        <CardTitle>Landing Page Content</CardTitle>
                        <CardDescription>
                          Modify the content displayed on the landing page
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AdminLandingEditor 
                          landingContent={landingContent || []}
                          onSaveContent={handleSaveContent}
                          onDeleteContent={handleDeleteContent}
                          onReorderContent={handleReorderContent}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="pages">
                    <Card>
                      <CardHeader>
                        <CardTitle>Other Pages</CardTitle>
                        <CardDescription>
                          Manage content for other pages on the site
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="p-8 text-center">
                          <h3 className="text-xl font-medium text-gray-600">Page Editor Coming Soon</h3>
                          <p className="text-gray-500 mt-2">
                            This feature is currently under development.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;