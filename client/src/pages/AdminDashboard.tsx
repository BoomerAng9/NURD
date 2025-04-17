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
  PenSquare,
  TrendingUp,
  Activity,
  UserPlus,
  RefreshCw,
  UserCheck,
  Palette,
  BarChart2,
  PieChart,
  LineChart,
  Loader2
} from 'lucide-react';
import {
  FuturisticContainer,
  FadeIn,
  ScaleIn
} from '@/components/animations/futuristic-transitions';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const AdminDashboard: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userGrowthPeriod, setUserGrowthPeriod] = useState('month');
  const [currentUserPage, setCurrentUserPage] = useState(1);

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
  const { data: landingContent, isLoading: isLoadingContent } = useQuery<LandingContent[]>({
    queryKey: ['/api/landing-content'],
    enabled: isAdmin
  });

  // Define interface for platform stats
  interface PlatformStats {
    totalUsers: number;
    activeUsers: number;
    totalExchanges: number;
    completedExchanges: number;
    activeOfferings: number;
    activeRequests: number;
    completionRate: number;
    timestamp: string;
  }

  // Fetch platform stats
  const { data: platformStats, isLoading: isLoadingStats } = useQuery<PlatformStats>({
    queryKey: ['/api/analytics/platform-stats'],
    enabled: isAdmin && activeTab === 'dashboard'
  });

  // Define interface for chart data
  interface ChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  }

  // Define interface for user growth data
  interface UserGrowth {
    chartData: ChartData;
    totalUsers: number;
    growthRate: number;
    period: string;
  }

  // Define interface for marketplace stats
  interface MarketplaceStats {
    totalOfferings: number;
    totalRequests: number;
    completedExchanges: number;
    activeCategories: number;
    popularSkills: { skill: string; count: number }[];
  }

  // Define interface for user preferences stats
  interface UserPreferenceStats {
    colorSchemes: { scheme: string; count: number }[];
    themeModes: { mode: string; count: number }[];
    accentColors: { color: string; count: number }[];
  }

  // Define interface for user data
  interface User {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    is_admin: boolean;
    user_type: string;
    created_at: string;
    last_login?: string;
  }

  // Define interface for pagination
  interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  }

  // Define interface for users response
  interface UsersResponse {
    users: User[];
    pagination: Pagination;
  }

  // Fetch user growth data
  const { data: userGrowth, isLoading: isLoadingGrowth } = useQuery<UserGrowth>({
    queryKey: ['/api/analytics/user-growth', userGrowthPeriod],
    enabled: isAdmin && (activeTab === 'dashboard' || activeTab === 'users'),
  });

  // Fetch marketplace stats
  const { data: marketplaceStats, isLoading: isLoadingMarketplace } = useQuery<MarketplaceStats>({
    queryKey: ['/api/analytics/marketplace'],
    enabled: isAdmin && activeTab === 'marketplace',
  });

  // Fetch user preferences stats
  const { data: userPreferenceStats, isLoading: isLoadingPreferences } = useQuery<UserPreferenceStats>({
    queryKey: ['/api/analytics/user-preferences'],
    enabled: isAdmin && activeTab === 'theme',
  });

  // Fetch all users with pagination
  const { data: allUsers, isLoading: isLoadingUsers } = useQuery<UsersResponse>({
    queryKey: ['/api/analytics/users', currentUserPage],
    enabled: isAdmin && activeTab === 'users',
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
                  {isLoadingStats ? (
                    <>
                      {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="bg-white border-0 shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col items-center space-y-2">
                              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  ) : (
                    <>
                      <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/30 mb-3">
                              <UserCheck className="h-6 w-6" />
                            </div>
                            <span className="text-3xl font-bold">{platformStats?.activeUsers || 0}</span>
                            <span className="text-blue-100">Active Users</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/30 mb-3">
                              <Users className="h-6 w-6" />
                            </div>
                            <span className="text-3xl font-bold">{platformStats?.totalUsers || 0}</span>
                            <span className="text-purple-100">Total Users</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/30 mb-3">
                              <Activity className="h-6 w-6" />
                            </div>
                            <span className="text-3xl font-bold">{platformStats?.completionRate || 0}%</span>
                            <span className="text-emerald-100">Completion Rate</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-amber-600 to-amber-700 text-white border-0 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/30 mb-3">
                              <RefreshCw className="h-6 w-6" />
                            </div>
                            <span className="text-3xl font-bold">{platformStats?.activeOfferings || 0}</span>
                            <span className="text-amber-100">Active Offerings</span>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </ScaleIn>

              {/* User Growth Analytics */}
              <FadeIn delay={0.3}>
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>User Growth Analytics</CardTitle>
                      <CardDescription>New user registrations over time</CardDescription>
                    </div>
                    <Select
                      value={userGrowthPeriod}
                      onValueChange={(value) => setUserGrowthPeriod(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Daily</SelectItem>
                        <SelectItem value="week">Weekly</SelectItem>
                        <SelectItem value="month">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    {isLoadingGrowth ? (
                      <div className="w-full h-[300px] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : userGrowth && userGrowth.chartData ? (
                      <div className="h-[300px]">
                        {/* Chart would go here - using a placeholder for now */}
                        <div className="w-full h-full bg-gray-50 rounded-md p-4 flex flex-col">
                          <div className="flex-1 flex items-end space-x-2">
                            {userGrowth.chartData.labels.map((label, index) => {
                              const value = userGrowth.chartData.datasets[0].data[index] || 0;
                              const maxValue = Math.max(...userGrowth.chartData.datasets[0].data);
                              const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                              
                              return (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                  <div className="w-full flex justify-center mb-1">
                                    <span className="text-xs font-medium">{value}</span>
                                  </div>
                                  <div 
                                    className="w-full bg-blue-500 rounded-t-sm"
                                    style={{ height: `${height}%` }}
                                  ></div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex space-x-2 mt-2">
                            {userGrowth.chartData.labels.map((label, index) => (
                              <div key={index} className="flex-1 text-center">
                                <span className="text-xs text-gray-500">{label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-[300px] flex items-center justify-center">
                        <p className="text-gray-500">No data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>

              {/* User Management */}
              <FadeIn delay={0.4}>
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage user accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingUsers ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : allUsers && allUsers.users && allUsers.users.length > 0 ? (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Date Joined</TableHead>
                              <TableHead>Last Login</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {allUsers.users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center space-x-2">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                                      {user.first_name?.charAt(0) || user.username?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                      <p className="font-medium">{user.first_name || user.username}</p>
                                      <p className="text-sm text-gray-500">@{user.username}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <span className={`
                                      px-2 py-1 rounded-full text-xs font-medium
                                      ${user.is_admin ? 'bg-purple-100 text-purple-700' : 
                                        user.user_type === 'parent' ? 'bg-blue-100 text-blue-700' : 
                                        user.user_type === 'student' ? 'bg-green-100 text-green-700' : 
                                        'bg-gray-100 text-gray-700'}
                                    `}>
                                      {user.is_admin ? 'Admin' : 
                                        user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  {new Date(user.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <span className="sr-only">Edit</span>
                                    <PenSquare className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        {/* Pagination Controls */}
                        {allUsers.pagination && (
                          <div className="flex items-center justify-between space-x-2 py-4">
                            <div className="text-sm text-gray-500">
                              Showing page {allUsers.pagination.currentPage} of {allUsers.pagination.totalPages}
                            </div>
                            <div className="space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled={allUsers.pagination.currentPage <= 1}
                                onClick={() => setCurrentUserPage(prev => Math.max(prev - 1, 1))}
                              >
                                Previous
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled={allUsers.pagination.currentPage >= allUsers.pagination.totalPages}
                                onClick={() => setCurrentUserPage(prev => Math.min(prev + 1, allUsers.pagination.totalPages))}
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                        <p className="text-gray-500">There are no registered users yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Content Management */}
              <FadeIn delay={0.5}>
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