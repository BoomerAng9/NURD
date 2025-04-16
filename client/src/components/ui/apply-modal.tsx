import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOption = (path: string) => {
    onClose();
    window.location.href = path;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 mb-6">
          Choose Your Path
        </h2>
        
        <div className="space-y-4">
          <button
            onClick={() => handleOption("/achievers")}
            className="flex items-center justify-center w-full p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 hover:from-orange-500/20 hover:to-amber-500/20 hover:border-orange-500/40 transform hover:scale-[1.02] transition-all text-gray-800 dark:text-gray-200 font-medium"
            data-cursor-text="Join as a student!"
          >
            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold">Sign Up as an Achiever</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">For students and parents</div>
            </div>
          </button>
          
          <button
            onClick={() => handleOption("/apply")}
            className="flex items-center justify-center w-full p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 hover:from-blue-500/20 hover:to-indigo-500/20 hover:border-blue-500/40 transform hover:scale-[1.02] transition-all text-gray-800 dark:text-gray-200 font-medium"
            data-cursor-text="Join as a trainer!"
          >
            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold">Sign Up as a Trainer</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">For teachers and mentors</div>
            </div>
          </button>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Have questions? Contact us at hello@achievemor.com
        </div>
      </motion.div>
    </div>
  );
};