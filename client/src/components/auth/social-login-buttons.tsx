import React from 'react';
import { Button } from '@/components/ui/button';
import { SiGoogle, SiFacebook, SiGithub, SiMicrosoft } from 'react-icons/si';

interface SocialLoginButtonsProps {
  className?: string;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ 
  className = '' 
}) => {
  
  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = '/auth/facebook';
  };

  const handleGithubLogin = () => {
    window.location.href = '/auth/github';
  };

  const handleMicrosoftLogin = () => {
    window.location.href = '/auth/microsoft';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-600"></span>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#121645] px-2 text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          onClick={handleGoogleLogin}
          className="bg-white/5 border-gray-700 text-white hover:bg-white/10 hover:text-white"
        >
          <SiGoogle className="mr-2 h-4 w-4 text-red-500" />
          Google
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleFacebookLogin}
          className="bg-white/5 border-gray-700 text-white hover:bg-white/10 hover:text-white"
        >
          <SiFacebook className="mr-2 h-4 w-4 text-blue-600" />
          Facebook
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleGithubLogin}
          className="bg-white/5 border-gray-700 text-white hover:bg-white/10 hover:text-white"
        >
          <SiGithub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleMicrosoftLogin}
          className="bg-white/5 border-gray-700 text-white hover:bg-white/10 hover:text-white"
        >
          <SiMicrosoft className="mr-2 h-4 w-4 text-blue-500" />
          Microsoft
        </Button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;