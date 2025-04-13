import React from 'react';
import { Calendar, User, Briefcase, Mail, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Define the trainer data type
export interface TrainerProfile {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  bio: string;
  imageUrl: string;
  calendlyUrl?: string;
  email?: string;
  phone?: string;
  availability?: {
    days: string[];
    hours: string;
  };
}

interface TrainerCardProps {
  trainer: TrainerProfile;
  variant?: 'default' | 'compact';
}

export const TrainerCard: React.FC<TrainerCardProps> = ({ trainer, variant = 'default' }) => {
  // Handle scheduling
  const handleSchedule = () => {
    if (trainer.calendlyUrl) {
      window.open(trainer.calendlyUrl, '_blank');
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col h-full">
          <div className="relative h-40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10" />
            <img 
              src={trainer.imageUrl || 'https://via.placeholder.com/400x300?text=Trainer'} 
              alt={trainer.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 z-20">
              <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">
                {trainer.specialties[0]}
              </Badge>
            </div>
          </div>
          <CardHeader className="p-4 pb-2 flex-grow">
            <CardTitle className="text-lg">{trainer.name}</CardTitle>
            <CardDescription>{trainer.title}</CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button variant="outline" size="sm" onClick={handleSchedule} disabled={!trainer.calendlyUrl}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href={`/trainers/${trainer.id}`}>View Profile</a>
            </Button>
          </CardFooter>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-1 h-full min-h-[200px]">
          <img 
            src={trainer.imageUrl || 'https://via.placeholder.com/400x600?text=Trainer'} 
            alt={trainer.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:col-span-2 flex flex-col">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start mb-2">
              <div>
                <CardTitle className="text-2xl">{trainer.name}</CardTitle>
                <CardDescription className="text-lg">{trainer.title}</CardDescription>
              </div>
              {trainer.calendlyUrl && (
                <Button onClick={handleSchedule} className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {trainer.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="p-4 pt-0 flex-grow">
            <p className="text-gray-700 mb-4">{trainer.bio}</p>
            
            <div className="mt-4 space-y-2">
              {trainer.availability && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Available: {trainer.availability.days.join(', ')} ({trainer.availability.hours})</span>
                </div>
              )}
              
              {trainer.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-blue-500" />
                  <a href={`mailto:${trainer.email}`} className="hover:text-blue-600">{trainer.email}</a>
                </div>
              )}
              
              {trainer.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-blue-500" />
                  <a href={`tel:${trainer.phone}`} className="hover:text-blue-600">{trainer.phone}</a>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-4 border-t">
            <Button variant="outline" className="w-full" asChild>
              <a href={`/trainers/${trainer.id}`}>
                View Full Profile & Courses
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default TrainerCard;