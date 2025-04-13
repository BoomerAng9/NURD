import { useState } from 'react';
import { useLocation } from 'wouter';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import { useSupabase } from '@/components/ui/supabase-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  UsersRound, 
  Calendar, 
  CheckSquare, 
  FileText, 
  Settings, 
  LayoutDashboard, 
  AlertCircle, 
  MessageSquare,
  BookOpen,
  GraduationCap,
  BarChart3
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

// Sample data for the dashboard
const recentActivities = [
  { id: 1, user: 'Alex Johnson', action: 'Completed module', item: 'Introduction to AI', time: '2 hours ago' },
  { id: 2, user: 'Maya Patel', action: 'Submitted project', item: 'Virtual Pet App', time: '4 hours ago' },
  { id: 3, user: 'Jordan Smith', action: 'Started module', item: 'Game Development Basics', time: '5 hours ago' },
  { id: 4, user: 'Taylor Chen', action: 'Joined program', item: 'Summer Coding Camp', time: '1 day ago' },
  { id: 5, user: 'Sam Rodriguez', action: 'Posted question', item: 'Help with JavaScript arrays', time: '1 day ago' },
];

const upcomingEvents = [
  { id: 1, title: 'Virtual Coding Workshop', date: '2025-06-15', time: '10:00 AM - 12:00 PM', attendees: 23 },
  { id: 2, title: 'Parent Orientation', date: '2025-06-17', time: '6:00 PM - 7:30 PM', attendees: 45 },
  { id: 3, title: 'AI Project Showcase', date: '2025-06-20', time: '1:00 PM - 3:00 PM', attendees: 18 },
  { id: 4, title: 'Robotics Introduction', date: '2025-06-22', time: '10:00 AM - 1:00 PM', attendees: 15 },
];

const studentProgress = [
  { id: 1, name: 'Alex Johnson', progress: 85, modules: '17/20', lastActive: '2 hours ago', avatar: 'AJ' },
  { id: 2, name: 'Maya Patel', progress: 72, modules: '12/20', lastActive: '1 day ago', avatar: 'MP' },
  { id: 3, name: 'Jordan Smith', progress: 45, modules: '9/20', lastActive: '3 hours ago', avatar: 'JS' },
  { id: 4, name: 'Riley Chen', progress: 92, modules: '18/20', lastActive: '5 hours ago', avatar: 'RC' },
  { id: 5, name: 'Sam Taylor', progress: 60, modules: '12/20', lastActive: '1 day ago', avatar: 'ST' },
];

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const { user } = useSupabase();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if not logged in or not an admin
  // In a real application, you would check admin status from user metadata or a separate admin table
  if (!user) {
    setLocation('/auth');
    return null;
  }

  const handleStudentClick = (studentId: number) => {
    toast({
      title: 'Student Profile',
      description: `Viewing detailed profile for student ID: ${studentId}`,
    });
    // In a real application, you would navigate to student details page
  };

  const handleEventClick = (eventId: number) => {
    toast({
      title: 'Event Details',
      description: `Viewing detailed information for event ID: ${eventId}`,
    });
    // In a real application, you would navigate to event details page
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="md:w-64 flex-shrink-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Admin Panel</CardTitle>
                  <CardDescription>Program Coordinator</CardDescription>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-1">
                    <Button 
                      variant={currentTab === 'overview' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => setCurrentTab('overview')}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Overview
                    </Button>
                    <Button 
                      variant={currentTab === 'students' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => setCurrentTab('students')}
                    >
                      <UsersRound className="mr-2 h-4 w-4" />
                      Students
                    </Button>
                    <Button 
                      variant={currentTab === 'courses' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => setCurrentTab('courses')}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Courses
                    </Button>
                    <Button 
                      variant={currentTab === 'events' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => setCurrentTab('events')}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Events
                    </Button>
                    <Button 
                      variant={currentTab === 'reports' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => setCurrentTab('reports')}
                    >
                      <BarChart className="mr-2 h-4 w-4" />
                      Reports
                    </Button>
                    <Button 
                      variant={currentTab === 'messages' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => setCurrentTab('messages')}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                    </Button>
                    <Button 
                      variant={currentTab === 'settings' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => setCurrentTab('settings')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-grow">
              {currentTab === 'overview' && (
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold">Program Dashboard</h1>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Total Students</p>
                            <h3 className="text-2xl font-bold mt-1">156</h3>
                            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                          </div>
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <UsersRound className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Active Courses</p>
                            <h3 className="text-2xl font-bold mt-1">24</h3>
                            <p className="text-xs text-green-600 mt-1">+3 new this week</p>
                          </div>
                          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                            <h3 className="text-2xl font-bold mt-1">78%</h3>
                            <p className="text-xs text-green-600 mt-1">+5% from last week</p>
                          </div>
                          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <CheckSquare className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
                            <h3 className="text-2xl font-bold mt-1">7</h3>
                            <p className="text-xs text-amber-600 mt-1">Next event in 3 days</p>
                          </div>
                          <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-amber-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Recent Activities and Upcoming Events */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">Recent Activities</CardTitle>
                        <CardDescription>Latest actions from students</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-grow">
                                <p className="text-sm font-medium">{activity.user}</p>
                                <p className="text-xs text-gray-500">
                                  {activity.action} - {activity.item}
                                </p>
                              </div>
                              <span className="text-xs text-gray-400">{activity.time}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" size="sm" className="w-full">
                          View All Activities
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">Upcoming Events</CardTitle>
                        <CardDescription>Scheduled workshops and sessions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {upcomingEvents.map((event) => (
                            <div 
                              key={event.id} 
                              className="flex items-start gap-4 pb-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                              onClick={() => handleEventClick(event.id)}
                            >
                              <div className="h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-grow">
                                <p className="text-sm font-medium">{event.title}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(event.date)} • {event.time}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {event.attendees} attendees registered
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" size="sm" className="w-full">
                          View Calendar
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  {/* Student Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Student Progress</CardTitle>
                      <CardDescription>Track completion and engagement</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Modules Completed</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentProgress.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{student.avatar}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{student.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="w-full flex flex-col gap-1">
                                  <Progress value={student.progress} className="h-2" />
                                  <span className="text-xs text-gray-500">{student.progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell>{student.modules}</TableCell>
                              <TableCell>{student.lastActive}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleStudentClick(student.id)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        View All Students
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
              
              {currentTab === 'students' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Students</h1>
                    <div className="flex gap-2">
                      <Button variant="outline">Export CSV</Button>
                      <Button>Add Student</Button>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center p-12">
                        <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium">Student Management Coming Soon</h3>
                        <p className="text-gray-500 mt-2">
                          This section will allow you to manage student enrollments, track progress, and review submissions.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {currentTab === 'courses' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Courses</h1>
                    <div className="flex gap-2">
                      <Button>Create Course</Button>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center p-12">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium">Course Management Coming Soon</h3>
                        <p className="text-gray-500 mt-2">
                          This section will allow you to create and manage courses, modules, and learning materials.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {currentTab === 'events' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Events</h1>
                    <div className="flex gap-2">
                      <Button>Schedule Event</Button>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center p-12">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium">Event Calendar Coming Soon</h3>
                        <p className="text-gray-500 mt-2">
                          This section will allow you to schedule and manage virtual and in-person events.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {currentTab === 'reports' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Reports</h1>
                    <div className="flex gap-2">
                      <Button variant="outline">Export</Button>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center p-12">
                        <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium">Analytics Dashboard Coming Soon</h3>
                        <p className="text-gray-500 mt-2">
                          This section will provide detailed analytics and reports on student performance and engagement.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {currentTab === 'messages' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Messages</h1>
                    <div className="flex gap-2">
                      <Button>New Message</Button>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center p-12">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium">Messaging System Coming Soon</h3>
                        <p className="text-gray-500 mt-2">
                          This section will allow you to communicate with students, parents, and staff.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {currentTab === 'settings' && (
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold">Settings</h1>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center p-12">
                        <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium">System Settings Coming Soon</h3>
                        <p className="text-gray-500 mt-2">
                          This section will allow you to configure system preferences and manage user permissions.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;