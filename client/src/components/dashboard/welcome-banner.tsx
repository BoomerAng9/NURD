import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'wouter';

interface WelcomeBannerProps {
  name: string;
  isLoading: boolean;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ name, isLoading }) => {
  // Get time of day for custom greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  // Get current date in friendly format
  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-90"></div>
        <div className="relative p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-40 bg-white/20 mb-3" />
                  <Skeleton className="h-4 w-64 bg-white/20" />
                </>
              ) : (
                <>
                  <h1 className="font-heading font-bold text-2xl sm:text-3xl mb-2">
                    Good {getTimeOfDay()}, {name}!
                  </h1>
                  <p className="opacity-90">{getCurrentDate()}</p>
                </>
              )}
            </div>
            
            <div className="mt-4 sm:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 flex items-center">
                <div className="mr-4">
                  <div className="text-3xl font-bold">0</div>
                  <div className="text-xs text-white/80">Completed</div>
                </div>
                <div className="mr-4">
                  <div className="text-3xl font-bold">1</div>
                  <div className="text-xs text-white/80">In Progress</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">2</div>
                  <div className="text-xs text-white/80">Upcoming</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
        <div className="flex flex-wrap gap-4">
          <button className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Start New Project
          </button>
          <button className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View Schedule
          </button>
          <button className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Contact Mentor
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
