import React from 'react';
import { motion } from 'framer-motion';
import { UserProgress, Course, Achievement, User } from '@shared/progress-schema';
import { Progress } from '@/components/ui/progress';
import { Award, ChevronRight, Calendar, CheckCircle2, BookOpen, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AchievementBadge } from './achievement-badge';
import { Link } from 'wouter';

interface ProgressTrackerProps {
  user: User;
  progress: UserProgress[];
  courses: Course[];
  achievements: (Achievement & { isEarned: boolean })[];
  className?: string;
}

export function ProgressTracker({
  user,
  progress,
  courses,
  achievements,
  className
}: ProgressTrackerProps) {
  // Get current streak
  const currentStreak = user.avatar_data?.streak?.current || 0;
  
  // Calculate overall progress percentage
  const calculateOverallProgress = () => {
    if (!progress || progress.length === 0) return 0;
    
    const totalCompleted = progress.reduce((acc, curr) => {
      return acc + (curr.completed_lessons || 0);
    }, 0);
    
    const totalLessons = courses.reduce((acc, curr) => {
      return acc + (curr.total_lessons || 0);
    }, 0);
    
    if (totalLessons === 0) return 0;
    return Math.round((totalCompleted / totalLessons) * 100);
  };
  
  // Get courses in progress
  const coursesInProgress = progress.filter(p => p.progress_percentage > 0 && p.progress_percentage < 100);
  const completedCourses = progress.filter(p => p.progress_percentage === 100);
  
  // Calculate earned XP
  const totalXP = progress.reduce((acc, curr) => acc + (curr.earned_xp || 0), 0);
  
  // Format date for display
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get course by ID
  const getCourse = (courseId: number) => {
    return courses.find(c => c.id === courseId);
  };
  
  // Get earned achievements count
  const earnedAchievements = achievements.filter(a => a.isEarned);
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Overview */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Progress Overview</CardTitle>
          <CardDescription>Your journey so far</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Overall Progress</span>
              <span className="text-white font-medium">{calculateOverallProgress()}%</span>
            </div>
            <Progress value={calculateOverallProgress()} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 p-3 rounded-lg text-center">
              <div className="text-cyan-400 mb-1"><Award size={20} className="inline" /></div>
              <div className="text-2xl font-bold text-white">{totalXP}</div>
              <div className="text-xs text-slate-400">TOTAL XP</div>
            </div>
            
            <div className="bg-slate-800/50 p-3 rounded-lg text-center">
              <div className="text-green-400 mb-1"><CheckCircle2 size={20} className="inline" /></div>
              <div className="text-2xl font-bold text-white">{completedCourses.length}</div>
              <div className="text-xs text-slate-400">COMPLETED</div>
            </div>
            
            <div className="bg-slate-800/50 p-3 rounded-lg text-center">
              <div className="text-amber-400 mb-1"><Calendar size={20} className="inline" /></div>
              <div className="text-2xl font-bold text-white">{currentStreak}</div>
              <div className="text-xs text-slate-400">DAY STREAK</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Current Courses */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">My Courses</CardTitle>
          <CardDescription>
            Courses you're currently taking ({coursesInProgress.length})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {coursesInProgress.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>You haven't started any courses yet.</p>
              <Button variant="outline" className="mt-4">
                Browse Courses
              </Button>
            </div>
          ) : (
            coursesInProgress.map((course) => {
              const courseData = getCourse(course.course_id);
              return (
                <motion.div 
                  key={course.course_id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-700 rounded-md flex items-center justify-center">
                      {courseData?.image_url ? (
                        <img 
                          src={courseData.image_url} 
                          alt={courseData.title} 
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <BookOpen className="text-slate-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h3 className="text-white font-medium truncate">
                          {courseData?.title || 'Course'}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            course.progress_percentage >= 75 ? "border-green-500 text-green-400" :
                            course.progress_percentage >= 50 ? "border-yellow-500 text-yellow-400" :
                            course.progress_percentage >= 25 ? "border-blue-500 text-blue-400" :
                            "border-slate-500 text-slate-400"
                          )}
                        >
                          {course.progress_percentage}%
                        </Badge>
                      </div>
                      
                      <div className="mt-1 text-sm text-slate-400 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {courseData?.duration || '2 weeks'} • {course.completed_lessons} / {courseData?.total_lessons || 0} lessons
                      </div>
                      
                      <div className="mt-2">
                        <Progress value={course.progress_percentage} className="h-1" />
                      </div>
                      
                      <div className="mt-3 flex justify-between items-center">
                        <div className="text-xs text-slate-500">
                          Last accessed: {formatDate(course.last_accessed)}
                        </div>
                        <Link href={`/courses/${course.course_id}`}>
                          <Button size="sm" variant="ghost" className="h-7 gap-1">
                            Continue <ChevronRight size={14} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View All Courses</Button>
        </CardFooter>
      </Card>
      
      {/* Achievements */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl text-white">Achievements</CardTitle>
              <CardDescription>
                {earnedAchievements.length} of {achievements.length} unlocked
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {achievements.slice(0, 5).map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                isEarned={achievement.isEarned}
                size="md"
              />
            ))}
          </div>
          
          {achievements.length === 0 && (
            <div className="text-center py-6 text-slate-400">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Complete courses and activities to earn achievements.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}