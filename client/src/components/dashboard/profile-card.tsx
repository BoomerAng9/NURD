import React from 'react';
import { Link } from 'wouter';
import { User } from '@shared/schema';

interface ProfileCardProps {
  user: User | undefined;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-6">
          <p className="text-gray-500">User profile not available</p>
        </div>
      </div>
    );
  }

  // Determine user avatar (placeholder)
  const getUserInitial = () => {
    return user.first_name ? user.first_name.charAt(0).toUpperCase() : '?';
  };

  // Get appropriate label for interest area
  const getInterestLabel = (path_choice: string | null) => {
    const interestMap: Record<string, string> = {
      'game_development': 'Game Development',
      'web_design': 'Web & App Design',
      'digital_art': 'Digital Art & Animation',
      'ai_machine_learning': 'AI & Machine Learning',
      'robotics': 'Robotics & Hardware',
      'not_sure': 'Exploring Options'
    };
    
    return path_choice ? interestMap[path_choice] || path_choice : 'Not specified';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="h-24 bg-gradient-nurd"></div>
      <div className="px-6 pb-6">
        <div className="flex justify-center -mt-12">
          <div className="h-24 w-24 rounded-full border-4 border-white bg-purple-600 flex items-center justify-center text-white text-3xl font-bold">
            {getUserInitial()}
          </div>
        </div>
        
        <div className="text-center mt-3">
          <h3 className="font-heading font-bold text-xl text-gray-900">{user.first_name}</h3>
          <p className="text-gray-500 mb-4">@{user.username}</p>
          
          <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-4">
            {user.user_type === 'student' ? 'Student' : 'Parent'}
          </div>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-500">Age</span>
            <span className="font-medium">{user.age}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-500">Grade Level</span>
            <span className="font-medium">{user.grade_level}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-500">Interest Area</span>
            <span className="font-medium">{getInterestLabel(user.path_choice)}</span>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <Link href="/profile/settings">
            <button className="w-full text-center py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
              Edit Profile
            </button>
          </Link>
          <Link href="/avatar/create">
            <button className="w-full text-center py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors text-white">
              Create Avatar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
