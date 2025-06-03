import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, BookOpen, Lock, Hourglass } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';

interface CourseProgress {
  id: number;
  user_id: number;
  course_id: number;
  progress_percentage: number;
  completed_lessons: number;
  start_date: string;
  last_accessed: string;
  completion_date?: string;
  is_completed: boolean;
  earned_xp: number;
  // Populated from course join
  course?: {
    title: string;
    description: string;
    category: string;
    level: string;
    image_url?: string;
  };
}

interface CourseProgressListProps {
  courses: CourseProgress[];
  minimal?: boolean;
}

const CourseProgressList: React.FC<CourseProgressListProps> = ({ courses, minimal = false }) => {
  // Function to fetch course details if needed
  const getCourseInfo = (course: CourseProgress) => {
    // If we already have course details, use those
    if (course.course) {
      return {
        title: course.course.title,
        image: course.course.image_url,
        description: course.course.description,
        category: course.course.category,
        level: course.course.level
      };
    }
    
    // Otherwise use query to fetch course details
    const { data: courseData } = useQuery({
      queryKey: [`/api/courses/${course.course_id}`],
      queryFn: getQueryFn({ on401: "throw" }),
      enabled: !!course.course_id,
    });
    
    return {
      title: courseData?.title || 'Loading...',
      image: courseData?.image_url,
      description: courseData?.description || '',
      category: courseData?.category || '',
      level: courseData?.level || 'beginner'
    };
  };
  
  // Format date from ISO string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };
  
  // Get level badge color
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  // If no courses, show empty state
  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <BookOpen className="h-8 w-8 mb-2 opacity-70" />
        <p>No courses started yet. Begin your learning journey by enrolling in a course!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {courses.map((course) => {
        const courseInfo = getCourseInfo(course);
        
        return (
          <div 
            key={course.id} 
            className={`p-4 border rounded-lg ${
              course.is_completed ? 'bg-green-50 border-green-200' : 'bg-white'
            }`}
          >
            <div className="flex items-center gap-4">
              {courseInfo.image && !minimal && (
                <div className="hidden sm:block h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={courseInfo.image} 
                    alt={courseInfo.title}
                    className="h-full w-full object-cover" 
                  />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{courseInfo.title}</h3>
                  {course.is_completed && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
                
                {!minimal && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {courseInfo.category}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getLevelBadgeColor(courseInfo.level)}`}>
                      {courseInfo.level.charAt(0).toUpperCase() + courseInfo.level.slice(1)}
                    </Badge>
                    {course.earned_xp > 0 && (
                      <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-100">
                        {course.earned_xp} XP
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="mt-2">
                  <Progress value={course.progress_percentage} className="h-2" />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {course.progress_percentage}% complete
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {course.completed_lessons} lessons completed
                    </span>
                  </div>
                </div>
              </div>
              
              {!minimal && (
                <div className="hidden md:flex flex-col items-center justify-center gap-1 min-w-24">
                  {course.is_completed ? (
                    <div className="text-xs flex flex-col items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mb-1" />
                      <span className="font-medium">Completed</span>
                      <span className="text-muted-foreground">{formatDate(course.completion_date)}</span>
                    </div>
                  ) : (
                    <div className="text-xs flex flex-col items-center">
                      <Clock className="h-5 w-5 text-amber-500 mb-1" />
                      <span className="font-medium">In Progress</span>
                      <span className="text-muted-foreground">
                        Started {formatDate(course.start_date)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CourseProgressList;