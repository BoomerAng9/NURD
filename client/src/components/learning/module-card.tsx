import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Lock, Award, Clock, CheckCircle, BookOpen } from 'lucide-react';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  progress: number;
  isLocked: boolean;
  completeCount: number;
  totalLessons: number;
}

interface ModuleCardProps {
  module: LearningModule;
  variant?: 'default' | 'compact' | 'featured';
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, variant = 'default' }) => {
  const {
    id,
    title,
    description,
    imageUrl,
    category,
    level,
    duration,
    progress,
    isLocked,
    completeCount,
    totalLessons
  } = module;

  // Different variants of the card for different layouts
  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="h-full"
      >
        <Card className="h-full overflow-hidden transition-shadow hover:shadow-md flex flex-col">
          <Link href={`/learning/${id}`}>
            <div className="relative h-32 cursor-pointer">
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
              {isLocked && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-white opacity-80" />
                </div>
              )}
              <Badge className="absolute top-2 right-2 bg-white text-black">
                {level}
              </Badge>
            </div>
          </Link>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-base line-clamp-1">{title}</CardTitle>
            <CardDescription className="text-xs line-clamp-2">
              {category}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2 flex-grow">
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <Clock className="h-3 w-3 mr-1" />
              {duration}
            </div>
            <Progress value={progress} className="h-1.5 mb-2" />
            <div className="text-xs text-gray-500">
              {completeCount}/{totalLessons} lessons
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              variant={isLocked ? "outline" : "default"}
              size="sm"
              className="w-full"
              disabled={isLocked}
            >
              {progress > 0 && progress < 100 ? (
                <>
                  <Play className="h-4 w-4 mr-1" /> Continue
                </>
              ) : progress === 100 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" /> Completed
                </>
              ) : isLocked ? (
                <>
                  <Lock className="h-4 w-4 mr-1" /> Locked
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" /> Start
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="h-full"
      >
        <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg flex flex-col bg-gradient-to-br from-[#121645] to-[#2C2F7C] text-white">
          <div className="relative h-56">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121645] to-transparent" />
            <Badge className="absolute top-4 left-4 bg-[#3DE053] text-black">
              Featured
            </Badge>
            <Badge className="absolute top-4 right-4 bg-white text-[#121645]">
              {level}
            </Badge>
          </div>
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-gray-300">
              {category}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2 flex-grow">
            <p className="mb-4 text-gray-300">{description}</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-[#3DE053]" />
                <span className="text-sm">{duration}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-[#3DE053]" />
                <span className="text-sm">{totalLessons} lessons</span>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-gray-700" />
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Button
              className="w-full bg-[#3DE053] hover:bg-[#32bd45] text-black"
              size="lg"
              disabled={isLocked}
            >
              {progress > 0 && progress < 100 ? (
                <>
                  <Play className="h-4 w-4 mr-2" /> Continue Learning
                </>
              ) : progress === 100 ? (
                <>
                  <Award className="h-4 w-4 mr-2" /> Review Completed Module
                </>
              ) : isLocked ? (
                <>
                  <Lock className="h-4 w-4 mr-2" /> Unlock Module
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Start Learning
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  // Default card view
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md flex flex-col">
        <Link href={`/learning/${id}`}>
            <div className="relative h-48 cursor-pointer">
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
              {isLocked && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <Lock className="h-10 w-10 text-white opacity-80" />
                </div>
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="outline" className="bg-black/70 text-white border-none">
                  {category}
                </Badge>
              </div>
              <Badge className="absolute top-3 right-3 bg-white text-black">
                {level}
              </Badge>
            </div>
        </Link>
        <CardHeader className="p-5 pb-0">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="line-clamp-2 mt-1">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-4 flex-grow">
          <div className="flex justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {duration}
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {completeCount}/{totalLessons} lessons
            </div>
          </div>
          <div className="mb-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="p-5 pt-0">
          <Button
            variant={isLocked ? "outline" : "default"}
            className="w-full"
            disabled={isLocked}
          >
            {progress > 0 && progress < 100 ? (
              <>
                <Play className="h-4 w-4 mr-2" /> Continue Learning
              </>
            ) : progress === 100 ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" /> Completed
              </>
            ) : isLocked ? (
              <>
                <Lock className="h-4 w-4 mr-2" /> Locked
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" /> Start Learning
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ModuleCard;