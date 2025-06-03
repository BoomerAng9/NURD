import React from 'react';
import { AchievementShowcase } from '@/components/animations/achievement-showcase';

const AchievementDemo = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Achievement Animations</h1>
        <p className="text-muted-foreground mb-8">
          This page demonstrates the different achievement celebration styles with glass-like UI elements and interactive animations.
        </p>
        
        <AchievementShowcase />
      </div>
    </div>
  );
};

export default AchievementDemo;