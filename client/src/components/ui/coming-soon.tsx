import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "./button";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  title,
  description = "We're working hard to bring this feature to you. Check back soon for updates!"
}) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-xl"
      >
        <div className="mb-6 flex justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="relative w-24 h-24 flex items-center justify-center"
          >
            <Clock className="w-16 h-16 text-primary" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10"></div>
          </motion.div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          {title}
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          {description}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-gray-400">
            Want updates? Follow us on social media or sign up for our newsletter.
          </p>
        </div>
      </motion.div>
    </div>
  );
};