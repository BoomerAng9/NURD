import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ActivityProps {
  activity: {
    id: number;
    title: string;
    category: string;
    progress: number;
    startDate: string;
    endDate: string;
    description: string;
    imageUrl: string;
  };
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const ActivityCard: React.FC<ActivityProps> = ({ activity }) => {
  const startFormatted = formatDate(activity.startDate);
  const endFormatted = formatDate(activity.endDate);
  
  // Determine color based on category
  const categoryColors = {
    'Project': 'bg-green-100 text-green-800',
    'Workshop': 'bg-blue-100 text-blue-800',
    'Challenge': 'bg-orange-100 text-orange-800',
  };
  
  const categoryColor = categoryColors[activity.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';
  
  // Determine status based on progress
  let status = 'Not Started';
  let statusColor = 'bg-gray-100 text-gray-800';
  
  if (activity.progress === 100) {
    status = 'Completed';
    statusColor = 'bg-green-100 text-green-800';
  } else if (activity.progress > 0) {
    status = 'In Progress';
    statusColor = 'bg-blue-100 text-blue-800';
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/4 h-40 sm:h-auto overflow-hidden">
          <img 
            src={activity.imageUrl} 
            alt={activity.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 sm:w-3/4">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded-full ${categoryColor}`}>
              {activity.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
              {status}
            </span>
          </div>
          
          <h3 className="font-heading font-bold text-lg text-gray-900">{activity.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
          
          <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
            <span>Progress</span>
            <span>{activity.progress}%</span>
          </div>
          <Progress value={activity.progress} className="h-2 mb-3" />
          
          <div className="text-xs text-gray-500">
            {startFormatted} - {endFormatted}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
