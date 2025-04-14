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
  BarChart3,
  Trophy,
  Award,
  Medal,
  Star,
  Zap
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
                      <Button variant="outline">Filter</Button>
                      <Button>Create Course</Button>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="active">Active Courses</TabsTrigger>
                      <TabsTrigger value="drafts">Drafts</TabsTrigger>
                      <TabsTrigger value="archived">Archived</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="active" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Active NURD Program Courses</CardTitle>
                          <CardDescription>
                            Manage courses that are currently available to students
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Enrolled</TableHead>
                                <TableHead>Completion Rate</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Programming Fundamentals</div>
                                  <div className="text-sm text-muted-foreground">12 lessons</div>
                                </TableCell>
                                <TableCell>Coding</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                    Beginner
                                  </Badge>
                                </TableCell>
                                <TableCell>32 students</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress value={78} className="h-2 w-16" />
                                    <span className="text-sm">78%</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">Edit</Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Game Development Basics</div>
                                  <div className="text-sm text-muted-foreground">8 lessons</div>
                                </TableCell>
                                <TableCell>Game Design</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                    Intermediate
                                  </Badge>
                                </TableCell>
                                <TableCell>18 students</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress value={64} className="h-2 w-16" />
                                    <span className="text-sm">64%</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">Edit</Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">AI and Machine Learning</div>
                                  <div className="text-sm text-muted-foreground">14 lessons</div>
                                </TableCell>
                                <TableCell>AI</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                                    Advanced
                                  </Badge>
                                </TableCell>
                                <TableCell>12 students</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress value={45} className="h-2 w-16" />
                                    <span className="text-sm">45%</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">Edit</Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">Previous</Button>
                          <Button variant="outline" size="sm">Next</Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="drafts" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Course Drafts</CardTitle>
                          <CardDescription>
                            Courses in development that are not yet published to students
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium">No Draft Courses</h3>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                              Start creating new courses by clicking the "Create Course" button above.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="archived" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Archived Courses</CardTitle>
                          <CardDescription>
                            Previously offered courses that are no longer active
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium">No Archived Courses</h3>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                              Courses that are no longer active will appear here.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="analytics" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Course Analytics</CardTitle>
                          <CardDescription>
                            Performance metrics for all NURD program courses
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium">Course Analytics Coming Soon</h3>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                              This section will provide detailed analytics on course performance, including completion rates, 
                              time spent, and student feedback.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
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
                      <Button variant="outline">Print</Button>
                      <Button variant="outline">Export to CSV</Button>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="achievements">Achievements</TabsTrigger>
                      <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
                      <TabsTrigger value="activity">Activity Log</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Program Overview</CardTitle>
                          <CardDescription>
                            Combined metrics for all NURD program participants
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-blue-50">
                              <BarChart3 className="h-10 w-10 text-blue-600 mb-2" />
                              <div className="text-3xl font-bold">72%</div>
                              <p className="text-center text-sm text-gray-600 mt-1">Average Completion Rate</p>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-green-50">
                              <Trophy className="h-10 w-10 text-green-600 mb-2" />
                              <div className="text-3xl font-bold">258</div>
                              <p className="text-center text-sm text-gray-600 mt-1">Achievements Earned</p>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-purple-50">
                              <Zap className="h-10 w-10 text-purple-600 mb-2" />
                              <div className="text-3xl font-bold">12,540</div>
                              <p className="text-center text-sm text-gray-600 mt-1">Total XP Earned</p>
                            </div>
                          </div>
                          
                          <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-medium mb-4">Most Popular Courses</h3>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">Programming Fundamentals</span>
                                  <span className="text-sm text-gray-500">32 students</span>
                                </div>
                                <Progress value={80} className="h-2" />
                              </div>
                              
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">Game Development Basics</span>
                                  <span className="text-sm text-gray-500">18 students</span>
                                </div>
                                <Progress value={45} className="h-2" />
                              </div>
                              
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">AI and Machine Learning</span>
                                  <span className="text-sm text-gray-500">12 students</span>
                                </div>
                                <Progress value={30} className="h-2" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="achievements" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Achievement Reports</CardTitle>
                          <CardDescription>
                            Track achievement badges earned across the program
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="p-4 border rounded-lg text-center">
                              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Trophy className="h-6 w-6 text-amber-600" />
                              </div>
                              <h3 className="font-medium">Completion</h3>
                              <div className="text-2xl font-bold mt-1">124</div>
                              <p className="text-xs text-gray-500 mt-1">Course completion badges</p>
                            </div>
                            
                            <div className="p-4 border rounded-lg text-center">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Zap className="h-6 w-6 text-blue-600" />
                              </div>
                              <h3 className="font-medium">Streak</h3>
                              <div className="text-2xl font-bold mt-1">56</div>
                              <p className="text-xs text-gray-500 mt-1">Consistency badges</p>
                            </div>
                            
                            <div className="p-4 border rounded-lg text-center">
                              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Award className="h-6 w-6 text-emerald-600" />
                              </div>
                              <h3 className="font-medium">Milestone</h3>
                              <div className="text-2xl font-bold mt-1">48</div>
                              <p className="text-xs text-gray-500 mt-1">Progress milestone badges</p>
                            </div>
                            
                            <div className="p-4 border rounded-lg text-center">
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Star className="h-6 w-6 text-purple-600" />
                              </div>
                              <h3 className="font-medium">Special</h3>
                              <div className="text-2xl font-bold mt-1">30</div>
                              <p className="text-xs text-gray-500 mt-1">Special achievement badges</p>
                            </div>
                          </div>
                          
                          <div className="text-center p-8">
                            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium">Detailed Achievement Analytics Coming Soon</h3>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                              More detailed achievement statistics and visualizations will be available in a future update.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="progress" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Student Progress Reports</CardTitle>
                          <CardDescription>
                            Detailed progress tracking for all program participants
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-8">
                            <div className="border rounded-lg overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Courses Enrolled</TableHead>
                                    <TableHead>Courses Completed</TableHead>
                                    <TableHead>Average Progress</TableHead>
                                    <TableHead>XP Earned</TableHead>
                                    <TableHead>Last Active</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarFallback>AJ</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">Alex Johnson</div>
                                      </div>
                                    </TableCell>
                                    <TableCell>3</TableCell>
                                    <TableCell>2</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Progress value={85} className="h-2 w-16" />
                                        <span>85%</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>1,250</TableCell>
                                    <TableCell>2 hours ago</TableCell>
                                  </TableRow>
                                  
                                  <TableRow>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarFallback>MP</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">Maya Patel</div>
                                      </div>
                                    </TableCell>
                                    <TableCell>2</TableCell>
                                    <TableCell>1</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Progress value={72} className="h-2 w-16" />
                                        <span>72%</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>980</TableCell>
                                    <TableCell>1 day ago</TableCell>
                                  </TableRow>
                                  
                                  <TableRow>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarFallback>JS</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">Jordan Smith</div>
                                      </div>
                                    </TableCell>
                                    <TableCell>3</TableCell>
                                    <TableCell>0</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Progress value={45} className="h-2 w-16" />
                                        <span>45%</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>540</TableCell>
                                    <TableCell>3 hours ago</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">Previous</Button>
                          <div className="text-sm text-gray-500">Page 1 of 3</div>
                          <Button variant="outline" size="sm">Next</Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="activity" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Activity Logs</CardTitle>
                          <CardDescription>
                            Recent platform activity across all users
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {recentActivities.map((activity) => (
                              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
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
                            View All Activity
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                  </Tabs>
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
                  <h1 className="text-3xl font-bold">Platform Settings</h1>
                  
                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="appearance">Appearance</TabsTrigger>
                      <TabsTrigger value="users">User Management</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="general" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Platform Configuration</CardTitle>
                          <CardDescription>
                            Customize core settings for the NURD platform
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label htmlFor="platform-name" className="text-sm font-medium">
                                Platform Name
                              </label>
                              <input
                                id="platform-name"
                                type="text"
                                className="w-full p-2 border rounded-md"
                                defaultValue="NURD Summer Initiative"
                              />
                              <p className="text-sm text-gray-500">
                                The name displayed throughout the platform
                              </p>
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="platform-email" className="text-sm font-medium">
                                Contact Email
                              </label>
                              <input
                                id="platform-email"
                                type="email"
                                className="w-full p-2 border rounded-md"
                                defaultValue="nurds@achievemor.io"
                              />
                              <p className="text-sm text-gray-500">
                                Primary email for notifications and support
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Platform Features
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  id="feature-gallery"
                                  type="checkbox"
                                  className="h-4 w-4"
                                  defaultChecked
                                />
                                <label htmlFor="feature-gallery" className="text-sm">
                                  Enable Community Gallery
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  id="feature-messaging"
                                  type="checkbox"
                                  className="h-4 w-4"
                                  defaultChecked
                                />
                                <label htmlFor="feature-messaging" className="text-sm">
                                  Enable Messaging System
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  id="feature-achievements"
                                  type="checkbox"
                                  className="h-4 w-4"
                                  defaultChecked
                                />
                                <label htmlFor="feature-achievements" className="text-sm">
                                  Enable Achievements & Badges
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  id="feature-meetings"
                                  type="checkbox"
                                  className="h-4 w-4"
                                  defaultChecked
                                />
                                <label htmlFor="feature-meetings" className="text-sm">
                                  Enable Meeting Spaces
                                </label>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="ml-auto"
                            onClick={() => {
                              toast({
                                title: "Settings saved",
                                description: "Platform settings have been updated successfully.",
                              });
                            }}
                          >
                            Save Changes
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Program Schedule</CardTitle>
                          <CardDescription>
                            Configure program dates and availability
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label htmlFor="summer-start" className="text-sm font-medium">
                                Summer Program Start Date
                              </label>
                              <input
                                id="summer-start"
                                type="date"
                                className="w-full p-2 border rounded-md"
                                defaultValue="2025-06-15"
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="summer-end" className="text-sm font-medium">
                                Summer Program End Date
                              </label>
                              <input
                                id="summer-end"
                                type="date"
                                className="w-full p-2 border rounded-md"
                                defaultValue="2025-08-10"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Registration Status
                            </label>
                            <div className="grid grid-cols-1 gap-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  id="registration-open"
                                  type="radio"
                                  name="registration"
                                  className="h-4 w-4"
                                  defaultChecked
                                />
                                <label htmlFor="registration-open" className="text-sm">
                                  Open for Registration
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  id="registration-waitlist"
                                  type="radio"
                                  name="registration"
                                  className="h-4 w-4"
                                />
                                <label htmlFor="registration-waitlist" className="text-sm">
                                  Waitlist Only
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  id="registration-closed"
                                  type="radio"
                                  name="registration"
                                  className="h-4 w-4"
                                />
                                <label htmlFor="registration-closed" className="text-sm">
                                  Registration Closed
                                </label>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="ml-auto"
                            onClick={() => {
                              toast({
                                title: "Schedule updated",
                                description: "Program schedule has been updated successfully.",
                              });
                            }}
                          >
                            Save Schedule
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="appearance" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Brand Customization</CardTitle>
                          <CardDescription>
                            Personalize the look and feel of the NURD platform
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <label className="text-sm font-medium">
                                Primary Color Theme
                              </label>
                              <div className="grid grid-cols-4 gap-3">
                                <div className="cursor-pointer">
                                  <div className="h-12 w-full rounded-md bg-gradient-to-br from-[#23c55e] to-[#16a34a] border-2 border-primary"></div>
                                  <p className="text-xs mt-1 text-center">Green</p>
                                </div>
                                <div className="cursor-pointer">
                                  <div className="h-12 w-full rounded-md bg-gradient-to-br from-[#3b82f6] to-[#1e40af]"></div>
                                  <p className="text-xs mt-1 text-center">Blue</p>
                                </div>
                                <div className="cursor-pointer">
                                  <div className="h-12 w-full rounded-md bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9]"></div>
                                  <p className="text-xs mt-1 text-center">Purple</p>
                                </div>
                                <div className="cursor-pointer">
                                  <div className="h-12 w-full rounded-md bg-gradient-to-br from-[#f97316] to-[#ea580c]"></div>
                                  <p className="text-xs mt-1 text-center">Orange</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <label className="text-sm font-medium">
                                Default Appearance
                              </label>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="cursor-pointer">
                                  <div className="h-12 w-full rounded-md bg-white border border-gray-200 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                  </div>
                                  <p className="text-xs mt-1 text-center">Light</p>
                                </div>
                                <div className="cursor-pointer">
                                  <div className="h-12 w-full rounded-md bg-gray-900 border border-gray-700 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                  </div>
                                  <p className="text-xs mt-1 text-center">Dark</p>
                                </div>
                                <div className="cursor-pointer">
                                  <div className="h-12 w-full rounded-md bg-gradient-to-r from-white to-gray-900 border border-gray-200 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <p className="text-xs mt-1 text-center">System</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Upload Custom Logo
                            </label>
                            <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-md">
                              <div className="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-1 text-sm text-gray-600">
                                  Drag and drop or click to upload logo
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  PNG, JPG, SVG up to 2MB
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="ml-auto"
                            onClick={() => {
                              toast({
                                title: "Appearance updated",
                                description: "Brand customization settings have been saved.",
                              });
                            }}
                          >
                            Save Appearance
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="users" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>User Management</CardTitle>
                          <CardDescription>
                            Configure permissions and user roles
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Role</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">Admin</TableCell>
                                <TableCell>Full system access</TableCell>
                                <TableCell>All permissions</TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">Edit</Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Trainer</TableCell>
                                <TableCell>Can manage courses and students</TableCell>
                                <TableCell>Create/edit courses, grade work</TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">Edit</Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Student</TableCell>
                                <TableCell>Can access learning content</TableCell>
                                <TableCell>View courses, submit work</TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">Edit</Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Parent</TableCell>
                                <TableCell>Can monitor student progress</TableCell>
                                <TableCell>View progress, messages</TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">Edit</Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                        <CardFooter className="justify-between">
                          <Button variant="outline">
                            Add Custom Role
                          </Button>
                          <Button 
                            onClick={() => {
                              toast({
                                title: "Roles saved",
                                description: "User roles and permissions have been updated.",
                              });
                            }}
                          >
                            Save Changes
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="advanced" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Advanced Settings</CardTitle>
                          <CardDescription>
                            Configure system-level settings and integrations
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              External Integrations
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  id="zoom-integration"
                                  type="checkbox"
                                  className="h-4 w-4"
                                  defaultChecked
                                />
                                <label htmlFor="zoom-integration" className="text-sm">
                                  Zoom Video Conferencing
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  id="github-integration"
                                  type="checkbox"
                                  className="h-4 w-4"
                                  defaultChecked
                                />
                                <label htmlFor="github-integration" className="text-sm">
                                  GitHub Classroom
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  id="discord-integration"
                                  type="checkbox"
                                  className="h-4 w-4"
                                />
                                <label htmlFor="discord-integration" className="text-sm">
                                  Discord Community
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  id="google-integration"
                                  type="checkbox"
                                  className="h-4 w-4"
                                />
                                <label htmlFor="google-integration" className="text-sm">
                                  Google Workspace
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              System Maintenance
                            </label>
                            <div className="grid grid-cols-1 gap-4">
                              <div className="flex justify-between items-center p-4 border rounded-md">
                                <div>
                                  <h4 className="font-medium">Database Backup</h4>
                                  <p className="text-sm text-gray-500">Last backup: April 10, 2025</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  Run Backup
                                </Button>
                              </div>
                              <div className="flex justify-between items-center p-4 border rounded-md">
                                <div>
                                  <h4 className="font-medium">Cache Management</h4>
                                  <p className="text-sm text-gray-500">Clear system caches</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  Clear Cache
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="ml-auto"
                            onClick={() => {
                              toast({
                                title: "Advanced settings saved",
                                description: "System configuration has been updated successfully.",
                              });
                            }}
                          >
                            Save Configuration
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                  </Tabs>
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