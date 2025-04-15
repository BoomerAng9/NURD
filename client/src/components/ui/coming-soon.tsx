import React from 'react';

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title = "Coming Soon", 
  description = "We're working hard to bring you this exciting feature. Check back soon for updates!" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="glass-container max-w-3xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 mb-6">
          {title}
        </h1>
        <p className="text-xl text-gray-200 mb-8">
          {description}
        </p>
        <div className="flex justify-center space-x-4">
          <a href="/home" className="glass-button transform hover:scale-105 transition-all">
            Go Home
          </a>
          <a href="/dashboard" className="glass-button bg-primary/20 border-primary/30 transform hover:scale-105 transition-all">
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};