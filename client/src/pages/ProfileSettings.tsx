import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import Footer from '@/components/sections/footer';
import ProfileEditor from '@/components/profile/profile-editor';
import { ThemeEditor } from '@/components/theme/theme-editor';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, ArrowLeft, User, Palette, UserCircle2, Settings, Shield, Bell } from 'lucide-react';

type ProfileData = {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  favoriteSubject: string;
  interests: string[];
  schoolName: string;
};

type NotificationSettings = {
  emailNotifications: boolean;
  achievements: boolean;
  newModules: boolean;
  comments: boolean;
  mentions: boolean;
  reminders: boolean;
};

type PrivacySettings = {
  profileVisibility: "public" | "friends" | "private";
  showOnlineStatus: boolean;
  showProgressInGallery: boolean;
  allowTagging: boolean;
};

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Initialize profile data based on the current user if available
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: user?.first_name || 'Your Name',
    username: user?.username || 'username',
    bio: 'Share a little about yourself and what you enjoy doing!',
    avatarUrl: user?.avatar_url || '',
    favoriteSubject: 'Choose your favorite',
    interests: ['Coding', 'Learning', 'Creating'],
    schoolName: 'Your School',
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    achievements: true,
    newModules: true,
    comments: true,
    mentions: true,
    reminders: false,
  });
  
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: "public",
    showOnlineStatus: true,
    showProgressInGallery: true,
    allowTagging: true,
  });
  
  // Load user data and settings
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      
      try {
        // If we have a user, we could fetch additional data here
        if (user) {
          // Update profile data with user information
          setProfileData(prevData => ({
            ...prevData,
            displayName: user.first_name,
            username: user.username,
            avatarUrl: user.avatar_url || prevData.avatarUrl,
          }));
        } else {
          // If not logged in, show a message and redirect to auth
          toast({
            title: "Authentication required",
            description: "Please login to access profile settings.",
            variant: "destructive",
          });
          setLocation('/auth');
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Could not load your profile data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user, setLocation, toast]);
  
  const handleSaveSettings = (values: {
    profile?: any;
    notifications?: any;
    privacy?: any;
  }) => {
    // Here you would typically save this data to your database
    if (values.profile) {
      setProfileData(prev => ({ ...prev, ...values.profile }));
    }
    
    if (values.notifications) {
      setNotificationSettings(prev => ({ ...prev, ...values.notifications }));
    }
    
    if (values.privacy) {
      setPrivacySettings(prev => ({ ...prev, ...values.privacy }));
    }
    
    // This simulates saving to a database
    toast({
      title: "Settings saved",
      description: "Your profile settings have been updated",
    });
  };
  
  // Theme settings are now handled by the ThemeProvider and ThemeEditor
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-12 pt-24 flex-grow">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-40" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Skeleton className="h-64 w-full" />
                </div>
                <div className="md:col-span-2">
                  <Skeleton className="h-[500px] w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-12 pt-24 flex-grow">
          <div className="max-w-3xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-12 pt-24 flex-grow"
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setLocation('/dashboard')}
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Theme</span>
              </TabsTrigger>
              <TabsTrigger value="avatar" className="flex items-center gap-2">
                <UserCircle2 className="h-4 w-4" />
                <span>Avatar</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <ProfileEditor 
                initialProfileData={profileData}
                initialNotificationSettings={notificationSettings}
                initialPrivacySettings={privacySettings}
                onSave={handleSaveSettings}
              />
            </TabsContent>
            
            <TabsContent value="theme" className="space-y-6">
              <ThemeEditor />
            </TabsContent>
            
            <TabsContent value="avatar" className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="space-y-6">
                  <div className="text-center">
                    <UserCircle2 className="h-24 w-24 mx-auto mb-4 text-indigo-500" />
                    <h3 className="text-xl font-medium">Create Your Personalized Avatar</h3>
                    <p className="text-gray-600 mt-2">
                      Take a fun personality quiz and design a unique avatar that represents you!
                    </p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-medium text-indigo-900 mb-2">Features:</h4>
                    <ul className="space-y-2 text-indigo-800">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                        Personality-based avatar generation
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                        Multiple customization options
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                        Save your avatar to your profile
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                        Download your avatar as an SVG file
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-center">
                    <button 
                      onClick={() => setLocation('/avatar/create')}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                    >
                      <UserCircle2 className="h-5 w-5" />
                      Create Your Avatar
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default ProfileSettings;