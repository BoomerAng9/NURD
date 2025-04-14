
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';

export default function Landing() {
  const { data: landingContent } = useQuery({
    queryKey: ['/api/landing-content'],
    queryFn: ({ queryKey }) => fetch(queryKey[0]).then(res => res.json())
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <Card className="bg-black/50 border-none p-6 backdrop-blur">
          <h1 className="text-4xl font-bold mb-4">
            {landingContent?.title || 'Welcome to NURD'}
          </h1>
          <div className="prose prose-invert max-w-none">
            {landingContent?.content}
          </div>
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
