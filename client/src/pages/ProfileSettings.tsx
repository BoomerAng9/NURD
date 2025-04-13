import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import ProfileEditor from '@/components/profile/profile-editor';
import ThemeCustomizer, { ThemeFormValues } from '@/components/profile/theme-customizer';
import { useSupabase } from '@/components/ui/supabase-provider';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, ArrowLeft, User, Palette } from 'lucide-react';

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
  const { supabase, user } = useSupabase();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Sample profile data (in a real app, this would come from the database)
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: 'Jamie Smith',
    username: 'jamie_codes',
    bio: 'Aspiring game developer and digital artist. I love creating and learning new things!',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    favoriteSubject: 'Game Design',
    interests: ['Gaming', 'Drawing', 'Coding', 'Science', 'Music'],
    schoolName: 'Lincoln Middle School',
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
  
  const [themeSettings, setThemeSettings] = useState<ThemeFormValues>({
    colorScheme: 'default' as const,
    appearance: 'system' as const,
    radius: 0.5,
    animations: true,
    hapticFeedback: true,
  });
  
  useEffect(() => {
    // Simulate loading profile data
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // If no user is logged in, redirect to auth page
      // This would be real authentication logic in a production app
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please login to access profile settings.",
          variant: "destructive",
        });
        // setLocation('/auth');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
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
  
  const handleSaveThemeSettings = (values: ThemeFormValues) => {
    setThemeSettings(prev => ({ ...prev, ...values }));
    
    // This simulates saving to a database
    toast({
      title: "Theme updated",
      description: "Your dashboard theme settings have been saved",
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
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
        <Navbar />
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
      <Navbar />
      
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
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Theme</span>
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
              <ThemeCustomizer
                initialTheme={themeSettings}
                onSave={handleSaveThemeSettings}
              />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default ProfileSettings;