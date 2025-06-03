import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertCircle, Check, User, Bell, Shield, Upload, Edit2, X, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }).max(30, {
    message: "Display name cannot be longer than 30 characters.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }).max(20, {
    message: "Username cannot be longer than 20 characters.",
  }).regex(/^[a-zA-Z0-9_-]+$/, {
    message: "Username can only contain letters, numbers, underscores, and hyphens.",
  }),
  bio: z.string().max(160, {
    message: "Bio cannot be longer than 160 characters.",
  }).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  favoriteSubject: z.string().optional(),
  interests: z.array(z.string()).optional(),
  schoolName: z.string().optional(),
});

const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  achievements: z.boolean().default(true),
  newModules: z.boolean().default(true),
  comments: z.boolean().default(true),
  mentions: z.boolean().default(true),
  reminders: z.boolean().default(true),
});

const privacyFormSchema = z.object({
  profileVisibility: z.enum(["public", "friends", "private"]).default("public"),
  showOnlineStatus: z.boolean().default(true),
  showProgressInGallery: z.boolean().default(true),
  allowTagging: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;
type PrivacyFormValues = z.infer<typeof privacyFormSchema>;

interface ProfileCustomizationProps {
  initialProfileData?: Partial<ProfileFormValues>;
  initialNotificationSettings?: Partial<NotificationFormValues>;
  initialPrivacySettings?: Partial<PrivacyFormValues>;
  onSave?: (values: {
    profile?: ProfileFormValues;
    notifications?: NotificationFormValues;
    privacy?: PrivacyFormValues;
  }) => void;
}

const badges = [
  { id: 'coding-basics', name: 'Coding Basics', color: 'green', earned: true },
  { id: 'creative-genius', name: 'Creative Genius', color: 'purple', earned: true },
  { id: 'team-player', name: 'Team Player', color: 'blue', earned: true },
  { id: 'problem-solver', name: 'Problem Solver', color: 'orange', earned: false },
  { id: 'ai-explorer', name: 'AI Explorer', color: 'teal', earned: false },
  { id: 'web-wizard', name: 'Web Wizard', color: 'indigo', earned: false },
];

const subjects = [
  "Coding",
  "Digital Art",
  "Game Design",
  "Animation",
  "Web Development",
  "3D Modeling",
  "AI & Machine Learning",
  "Robotics",
  "Music Production",
  "Video Editing"
];

const interestOptions = [
  "Gaming",
  "Drawing",
  "Sports",
  "Science",
  "Music",
  "Reading",
  "Writing",
  "Math",
  "History",
  "Languages",
  "Robotics",
  "Chess",
  "Photography",
  "Dance",
  "Animation",
  "Building",
  "Cooking",
  "Nature",
  "Space",
  "Animals"
];

const ProfileEditor: React.FC<ProfileCustomizationProps> = ({
  initialProfileData = {},
  initialNotificationSettings = {},
  initialPrivacySettings = {},
  onSave
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialProfileData.interests || []);
  const [isUploading, setIsUploading] = useState(false);
  
  // Profile Form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: initialProfileData.displayName || '',
      username: initialProfileData.username || '',
      bio: initialProfileData.bio || '',
      avatarUrl: initialProfileData.avatarUrl || '',
      favoriteSubject: initialProfileData.favoriteSubject || '',
      interests: initialProfileData.interests || [],
      schoolName: initialProfileData.schoolName || '',
    },
  });
  
  // Notification Form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: initialNotificationSettings.emailNotifications !== undefined ? 
        initialNotificationSettings.emailNotifications : true,
      achievements: initialNotificationSettings.achievements !== undefined ? 
        initialNotificationSettings.achievements : true,
      newModules: initialNotificationSettings.newModules !== undefined ? 
        initialNotificationSettings.newModules : true,
      comments: initialNotificationSettings.comments !== undefined ? 
        initialNotificationSettings.comments : true,
      mentions: initialNotificationSettings.mentions !== undefined ? 
        initialNotificationSettings.mentions : true,
      reminders: initialNotificationSettings.reminders !== undefined ? 
        initialNotificationSettings.reminders : true,
    },
  });
  
  // Privacy Form
  const privacyForm = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacyFormSchema),
    defaultValues: {
      profileVisibility: initialPrivacySettings.profileVisibility || "public",
      showOnlineStatus: initialPrivacySettings.showOnlineStatus !== undefined ? 
        initialPrivacySettings.showOnlineStatus : true,
      showProgressInGallery: initialPrivacySettings.showProgressInGallery !== undefined ? 
        initialPrivacySettings.showProgressInGallery : true,
      allowTagging: initialPrivacySettings.allowTagging !== undefined ? 
        initialPrivacySettings.allowTagging : true,
    },
  });
  
  const onProfileSubmit = (values: ProfileFormValues) => {
    // Add the selected interests to the form values
    values.interests = selectedInterests;
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    
    if (onSave) {
      onSave({ profile: values });
    }
  };
  
  const onNotificationSubmit = (values: NotificationFormValues) => {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
    
    if (onSave) {
      onSave({ notifications: values });
    }
  };
  
  const onPrivacySubmit = (values: PrivacyFormValues) => {
    toast({
      title: "Privacy settings updated",
      description: "Your privacy settings have been updated successfully.",
    });
    
    if (onSave) {
      onSave({ privacy: values });
    }
  };
  
  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };
  
  const simulateAvatarUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      profileForm.setValue('avatarUrl', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3');
      toast({
        title: "Avatar uploaded",
        description: "Your new avatar has been uploaded successfully.",
      });
    }, 1500);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield size={16} />
            <span>Privacy</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Avatar and Badges */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Avatar</CardTitle>
                  <CardDescription>Personalize your profile picture</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative group mb-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={profileForm.watch('avatarUrl') || ''} />
                      <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                        {profileForm.watch('displayName')?.charAt(0) || 'N'}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      onClick={simulateAvatarUpload}
                      variant="outline"
                      className="mt-4"
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Change Avatar'}
                      {!isUploading && <Upload className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Badges</CardTitle>
                  <CardDescription>Achievements you've earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {badges.map(badge => (
                      <Badge
                        key={badge.id}
                        variant={badge.earned ? "default" : "outline"}
                        className={`flex items-center gap-1 py-2 ${badge.earned ? `bg-${badge.color}-600` : 'text-gray-400'}`}
                      >
                        {badge.earned ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {badge.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Profile Form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your display name" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is your public display name
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your unique username for the platform
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us a little about yourself"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Brief description for your profile. Max 160 characters.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your school name (optional)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="favoriteSubject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Favorite Subject</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your favorite subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subjects.map(subject => (
                                  <SelectItem key={subject} value={subject}>
                                    {subject}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div>
                        <FormLabel>Your Interests</FormLabel>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {interestOptions.map(interest => (
                            <Badge
                              key={interest}
                              variant={selectedInterests.includes(interest) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handleInterestToggle(interest)}
                            >
                              {interest}
                              {selectedInterests.includes(interest) && (
                                <X className="ml-1 h-3 w-3" onClick={(e) => {
                                  e.stopPropagation();
                                  handleInterestToggle(interest);
                                }} />
                              )}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Select up to 5 interests
                        </p>
                      </div>
                      
                      <Button type="submit" className="w-full">
                        Save Profile
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Customize how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <FormField
                    control={notificationForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Email Notifications</FormLabel>
                          <FormDescription>
                            Receive notifications via email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="achievements"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Achievement Notifications</FormLabel>
                          <FormDescription>
                            Get notified when you earn new badges
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="newModules"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">New Module Alerts</FormLabel>
                          <FormDescription>
                            Get notified when new learning modules are available
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Comment Notifications</FormLabel>
                          <FormDescription>
                            Get notified when someone comments on your posts
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="mentions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Mention Notifications</FormLabel>
                          <FormDescription>
                            Get notified when someone mentions you
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="reminders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Learning Reminders</FormLabel>
                          <FormDescription>
                            Get reminders about your learning progress
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    Save Notification Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your information and how it's used
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...privacyForm}>
                <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-6">
                  <FormField
                    control={privacyForm.control}
                    name="profileVisibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Visibility</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select who can see your profile" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="public">Public (Everyone)</SelectItem>
                            <SelectItem value="friends">Friends Only</SelectItem>
                            <SelectItem value="private">Private (Only Me)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Control who can view your profile information
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={privacyForm.control}
                    name="showOnlineStatus"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Online Status</FormLabel>
                          <FormDescription>
                            Show when you're active on the platform
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={privacyForm.control}
                    name="showProgressInGallery"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Progress in Gallery</FormLabel>
                          <FormDescription>
                            Show your learning progress on shared projects
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={privacyForm.control}
                    name="allowTagging"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Tagging</FormLabel>
                          <FormDescription>
                            Allow others to tag you in posts and projects
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Privacy Information</h4>
                      <p className="text-xs text-blue-600 mt-1">
                        Your privacy is important to us. We never share your personal information with third parties 
                        without your consent. You can request to delete your account and all associated data at any time.
                      </p>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Save Privacy Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProfileEditor;