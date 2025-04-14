import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, Book, Calendar, MessageSquare, Award, Clipboard, Video, 
  Globe, FileText, Clock, HelpCircle, BarChart, CheckCircle, Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: number;
  name: string;
  avatarUrl?: string;
  level: number;
  grade: string;
  progressPercent: number;
  lastActive: string;
  badges: number;
  assignments: {
    completed: number;
    total: number;
  };
}

interface TrainerSchedule {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  location: string;
  type: 'virtual' | 'in-person' | 'hybrid';
}

interface TrainerPortalProps {
  students: Student[];
  upcomingSessions: TrainerSchedule[];
  trainerLevel: number;
  trainerRating: number;
  totalSessionsCompleted: number;
  specializations: string[];
  onAddFeedback?: (studentId: number, feedback: string) => void;
  onCreateSession?: (session: Partial<TrainerSchedule>) => void;
  onStartSession?: (sessionId: number) => void;
}

export function TrainerPortal({
  students = [],
  upcomingSessions = [],
  trainerLevel = 5,
  trainerRating = 4.8,
  totalSessionsCompleted = 24,
  specializations = ['Coding', 'Problem Solving', 'Design Thinking'],
  onAddFeedback,
  onCreateSession,
  onStartSession
}: TrainerPortalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('students');
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [sessionForm, setSessionForm] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'virtual',
    description: ''
  });

  const handleFeedbackSubmit = () => {
    if (!selectedStudent) return;
    
    if (!feedbackText.trim()) {
      toast({
        title: "Empty feedback",
        description: "Please write feedback before submitting",
        variant: "destructive"
      });
      return;
    }
    
    onAddFeedback?.(selectedStudent.id, feedbackText);
    
    toast({
      title: "Feedback submitted",
      description: `Your feedback for ${selectedStudent.name} has been recorded`,
    });
    
    setFeedbackText('');
    setSelectedStudent(null);
  };

  const handleCreateSession = () => {
    // Simple validation
    if (!sessionForm.title || !sessionForm.date || !sessionForm.startTime || !sessionForm.endTime) {
      toast({
        title: "Incomplete session details",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    onCreateSession?.(sessionForm);
    
    toast({
      title: "Session created",
      description: `Your ${sessionForm.type} session has been scheduled`,
    });
    
    // Reset form
    setSessionForm({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      type: 'virtual',
      description: ''
    });
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Trainer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-950 to-blue-900 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">{trainerLevel}</span>
              <span className="text-gray-300">Trainer Level</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-indigo-950 to-purple-900 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">{trainerRating}</span>
              <span className="text-gray-300">Rating</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-950 to-indigo-900 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">{students.length}</span>
              <span className="text-gray-300">Active Students</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-cyan-950 to-blue-900 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">{totalSessionsCompleted}</span>
              <span className="text-gray-300">Sessions Completed</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Trainer Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="students">
            <Users className="h-4 w-4 mr-2" /> Students
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="h-4 w-4 mr-2" /> Schedule
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Book className="h-4 w-4 mr-2" /> Resources
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart className="h-4 w-4 mr-2" /> Reports
          </TabsTrigger>
        </TabsList>
        
        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Students</CardTitle>
              <CardDescription>
                View, manage, and provide feedback to your assigned students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-xl font-medium text-gray-600">No students assigned yet</h3>
                  <p className="text-gray-500 mt-1 max-w-md mx-auto">
                    When students are assigned to you, they will appear here for you to manage and support.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {students.map(student => (
                    <div 
                      key={student.id} 
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12">
                            {student.avatarUrl ? (
                              <AvatarImage src={student.avatarUrl} />
                            ) : (
                              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="ml-4">
                            <h4 className="font-medium">{student.name}</h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <Badge className="mr-2 bg-blue-500">{student.grade}</Badge>
                              <span>Level {student.level}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {student.lastActive}
                          </Badge>
                          <Badge variant="outline" className="flex items-center">
                            <Award className="h-3 w-3 mr-1" />
                            {student.badges}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span>Course Progress</span>
                          <span>{student.progressPercent}%</span>
                        </div>
                        <Progress value={student.progressPercent} className="h-2" />
                      </div>
                      
                      <div className="mt-4 flex justify-between">
                        <div className="text-sm text-gray-500">
                          Assignments: {student.assignments.completed}/{student.assignments.total} completed
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <MessageSquare className="h-4 w-4 mr-1" /> 
                          Add Feedback
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                  <CardDescription>Your scheduled sessions with students</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingSessions.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-xl font-medium text-gray-600">No upcoming sessions</h3>
                      <p className="text-gray-500 mt-1">
                        Schedule your first session using the form on the right.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingSessions.map(session => (
                        <div key={session.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{session.title}</h4>
                              <p className="text-sm text-gray-500">{session.date}</p>
                            </div>
                            <Badge className={
                              session.type === 'virtual' 
                                ? 'bg-blue-500' 
                                : session.type === 'in-person' 
                                ? 'bg-green-500' 
                                : 'bg-purple-500'
                            }>
                              {session.type}
                            </Badge>
                          </div>
                          
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{session.startTime} - {session.endTime}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{session.attendees} participants</span>
                            </div>
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{session.location}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <Button 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => onStartSession?.(session.id)}
                            >
                              <Video className="h-4 w-4 mr-1" /> Start Session
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Create New Session</CardTitle>
                  <CardDescription>Schedule a new training session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Session Title</label>
                      <Input 
                        value={sessionForm.title}
                        onChange={(e) => setSessionForm({...sessionForm, title: e.target.value})}
                        placeholder="E.g., Basic Coding Concepts"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Date</label>
                      <Input 
                        type="date"
                        value={sessionForm.date}
                        onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-medium block mb-1">Start Time</label>
                        <Input 
                          type="time"
                          value={sessionForm.startTime}
                          onChange={(e) => setSessionForm({...sessionForm, startTime: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1">End Time</label>
                        <Input 
                          type="time"
                          value={sessionForm.endTime}
                          onChange={(e) => setSessionForm({...sessionForm, endTime: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Location</label>
                      <Input 
                        value={sessionForm.location}
                        onChange={(e) => setSessionForm({...sessionForm, location: e.target.value})}
                        placeholder="Zoom link or physical location"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Session Type</label>
                      <select 
                        className="w-full px-3 py-2 border rounded-md"
                        value={sessionForm.type}
                        onChange={(e) => setSessionForm({...sessionForm, type: e.target.value as any})}
                      >
                        <option value="virtual">Virtual</option>
                        <option value="in-person">In-Person</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Description</label>
                      <Textarea 
                        value={sessionForm.description}
                        onChange={(e) => setSessionForm({...sessionForm, description: e.target.value})}
                        placeholder="Enter details about this session"
                        rows={3}
                      />
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleCreateSession}
                    >
                      Schedule Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Resources</CardTitle>
              <CardDescription>
                Access materials to enhance your training sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <FileText className="h-8 w-8 text-blue-500 mb-2" />
                    <h3 className="font-medium text-lg">Lesson Plans</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Structured guides for teaching key concepts
                    </p>
                    <Button variant="ghost" className="mt-4 text-blue-600 p-0">
                      Access Library
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <Video className="h-8 w-8 text-purple-500 mb-2" />
                    <h3 className="font-medium text-lg">Video Resources</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Tutorial videos to share with students
                    </p>
                    <Button variant="ghost" className="mt-4 text-blue-600 p-0">
                      View Collection
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <Clipboard className="h-8 w-8 text-green-500 mb-2" />
                    <h3 className="font-medium text-lg">Assignment Templates</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Ready-to-use templates for student projects
                    </p>
                    <Button variant="ghost" className="mt-4 text-blue-600 p-0">
                      Download Templates
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <Award className="h-8 w-8 text-amber-500 mb-2" />
                    <h3 className="font-medium text-lg">Achievement System</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Badges and rewards to motivate students
                    </p>
                    <Button variant="ghost" className="mt-4 text-blue-600 p-0">
                      Manage Achievements
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <HelpCircle className="h-8 w-8 text-red-500 mb-2" />
                    <h3 className="font-medium text-lg">Trainer Support</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Get help with teaching challenges
                    </p>
                    <Button variant="ghost" className="mt-4 text-blue-600 p-0">
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <Zap className="h-8 w-8 text-cyan-500 mb-2" />
                    <h3 className="font-medium text-lg">Quick Activities</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      5-10 minute exercises for class engagement
                    </p>
                    <Button variant="ghost" className="mt-4 text-blue-600 p-0">
                      Browse Activities
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Performance</CardTitle>
              <CardDescription>
                Insights and analytics about your teaching impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                <h3 className="text-xl font-medium text-gray-600">Enhanced Reports Coming Soon</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  We're building advanced analytics tools to help you track student progress, 
                  measure teaching effectiveness, and optimize your training approach.
                </p>
                <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                  Request Early Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Student Feedback Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-medium mb-4">
                Feedback for {selectedStudent.name}
              </h3>
              
              <div className="mb-4">
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Enter your feedback and observations..."
                  rows={5}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedStudent(null)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleFeedbackSubmit}
                >
                  <CheckCircle className="h-4 w-4 mr-1" /> Submit Feedback
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}