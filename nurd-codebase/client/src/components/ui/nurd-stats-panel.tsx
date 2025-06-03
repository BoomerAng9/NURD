import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, MapPin } from 'lucide-react';

interface NURDStatsPanelProps {
  className?: string;
}

export function NURDStatsPanel({ className = "" }: NURDStatsPanelProps) {
  // Initial counter states
  const [joinedCount, setJoinedCount] = useState(0);
  const [createdCount, setCreatedCount] = useState(0);
  
  // Animation for counters
  useEffect(() => {
    const joinedInterval = setInterval(() => {
      setJoinedCount(prev => {
        if (prev < 120) return prev + 1;
        clearInterval(joinedInterval);
        return prev;
      });
    }, 50);
    
    const createdInterval = setInterval(() => {
      setCreatedCount(prev => {
        if (prev < 87) return prev + 1;
        clearInterval(createdInterval);
        return prev;
      });
    }, 70);
    
    return () => {
      clearInterval(joinedInterval);
      clearInterval(createdInterval);
    };
  }, []);
  
  // Format counter to ensure 4 digits with leading zeros
  const formatCounter = (count: number) => {
    return count.toString().padStart(4, '0');
  };

  return (
    <motion.div 
      className={`flex flex-col h-full px-4 py-6 glass-card rounded-lg border border-white/20 ${className}`}
      style={{
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.08)'
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Top Section - NURDs Joined */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h3 className="text-sm font-medium text-white/70 mb-2">NURDs Joined</h3>
        <div className="flex items-center">
          <motion.div 
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {formatCounter(joinedCount)}
          </motion.div>
          <motion.span 
            className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut" 
            }}
          >
            Active
          </motion.span>
        </div>
      </motion.div>
      
      {/* Middle Section - NURDs Created */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h3 className="text-sm font-medium text-white/70 mb-2">NURDs Created</h3>
        <div className="flex items-center">
          <motion.div 
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {formatCounter(createdCount)}
          </motion.div>
          <motion.span 
            className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            Graduates
          </motion.span>
        </div>
      </motion.div>
      
      {/* Bottom Section - Upcoming Cohort Info */}
      <motion.div
        className="mt-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <h3 className="text-sm font-medium text-white/70 mb-3">Upcoming Cohort</h3>
        <div className="space-y-2">
          <div className="flex items-center text-white/80">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm">TBD</span>
          </div>
          <div className="flex items-center text-white/80">
            <User className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm">TBD</span>
          </div>
          <div className="flex items-center text-white/80">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm">TBD</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}