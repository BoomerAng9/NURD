
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';

export default function Landing() {
  const { data: landingContent } = useQuery({
    queryKey: ['/api/landing-content'],
    queryFn: ({ queryKey }) => fetch(queryKey[0]).then(res => res.json())
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-4 py-8 pt-20"
      >
        <Card 
          as={motion.div}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-black/50 border-none p-6 backdrop-blur"
        >
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl font-bold mb-4"
          >
            {landingContent?.title || 'Welcome to NURD'}
          </motion.h1>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="prose prose-invert max-w-none"
          >
            {landingContent?.content}
          </motion.div>
          {landingContent?.mediaUrl && (
            <div className="mt-4 rounded-lg overflow-hidden">
              {landingContent.mediaType === 'video' ? (
                <video src={landingContent.mediaUrl} controls className="w-full" />
              ) : (
                <img src={landingContent.mediaUrl} alt="" className="w-full" />
              )}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
