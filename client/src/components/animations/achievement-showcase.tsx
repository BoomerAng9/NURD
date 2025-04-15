import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trophy, Award, Star, Medal, Zap } from 'lucide-react';
import { AchievementCelebration } from './achievement-celebration';

interface Achievement {
  id: number;
  title: string;
  description: string;
  type: 'completion' | 'streak' | 'milestone' | 'special';
  icon_name?: string;
  xp_reward: number;
}

// Mock achievements for the showcase
const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: "First Step!",
    description: "Completed your first lesson in the NURD program",
    type: 'milestone',
    xp_reward: 150
  },
  {
    id: 2,
    title: "Coding Streak: 7 Days",
    description: "You've consistently coded for 7 days in a row!",
    type: 'streak',
    xp_reward: 200
  },
  {
    id: 3,
    title: "Module Master",
    description: "Completed all lessons in the introductory module",
    type: 'completion',
    xp_reward: 300
  },
  {
    id: 4,
    title: "Community Champion",
    description: "Made your first connection with another NURD member",
    type: 'special',
    xp_reward: 250
  }
];

export const AchievementShowcase = () => {
  // Use WebSocket to trigger achievement celebrations
  const simulateAchievement = (achievement: Achievement) => {
    // In a real app, this would come through WebSocket
    // Create a custom event to trigger the achievement celebration
    const event = new CustomEvent('achievement-earned', { 
      detail: { achievementId: achievement.id, achievement }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Achievement Showcase</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {mockAchievements.map((achievement) => (
          <AchievementCard 
            key={achievement.id}
            achievement={achievement}
            onTrigger={() => simulateAchievement(achievement)}
          />
        ))}
      </div>
      
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Create Custom Achievement</h3>
        <CustomAchievementForm onTrigger={simulateAchievement} />
      </div>
      
      {/* This component will listen for achievement events */}
      <AchievementCelebration />
    </div>
  );
};

// Individual achievement card
const AchievementCard = ({ 
  achievement, 
  onTrigger 
}: { 
  achievement: Achievement, 
  onTrigger: () => void 
}) => {
  const getIcon = () => {
    switch (achievement.type) {
      case 'completion':
        return <Medal className="h-8 w-8 text-green-500" />;
      case 'streak':
        return <Zap className="h-8 w-8 text-blue-500" />;
      case 'milestone':
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 'special':
        return <Star className="h-8 w-8 text-purple-500" />;
      default:
        return <Award className="h-8 w-8 text-primary" />;
    }
  };

  const getTypeColor = () => {
    switch (achievement.type) {
      case 'completion':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case 'streak':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case 'milestone':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case 'special':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{achievement.title}</CardTitle>
          <div className={`p-1.5 rounded-full ${getTypeColor()}`}>
            {getIcon()}
          </div>
        </div>
        <CardDescription>
          {achievement.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 pt-0 flex-grow">
        <div className="flex items-center gap-1.5 text-sm font-medium mt-2">
          <span className="text-amber-500">+{achievement.xp_reward} XP</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          onClick={onTrigger} 
          variant="secondary" 
          className="w-full"
        >
          Trigger Achievement Animation
        </Button>
      </CardFooter>
    </Card>
  );
};

// Form to create and test custom achievements
const CustomAchievementForm = ({ 
  onTrigger 
}: { 
  onTrigger: (achievement: Achievement) => void 
}) => {
  const [customAchievement, setCustomAchievement] = useState<Achievement>({
    id: 999,
    title: "",
    description: "",
    type: "special",
    xp_reward: 100
  });

  const handleChange = (field: keyof Achievement, value: any) => {
    setCustomAchievement(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAchievement.title && customAchievement.description) {
      onTrigger(customAchievement);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Achievement Title</Label>
            <Input
              id="title"
              placeholder="Enter a title"
              value={customAchievement.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Achievement Type</Label>
            <Select
              value={customAchievement.type}
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completion">Completion</SelectItem>
                <SelectItem value="streak">Streak</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
                <SelectItem value="special">Special</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description"
              value={customAchievement.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="xp">XP Reward</Label>
            <Input
              id="xp"
              type="number"
              min="1"
              max="1000"
              placeholder="100"
              value={customAchievement.xp_reward}
              onChange={(e) => handleChange('xp_reward', parseInt(e.target.value) || 0)}
              required
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setCustomAchievement({
              id: 999,
              title: "",
              description: "",
              type: "special",
              xp_reward: 100
            })}
          >
            Reset
          </Button>
          <Button type="submit">Test Achievement</Button>
        </CardFooter>
      </form>
    </Card>
  );
};