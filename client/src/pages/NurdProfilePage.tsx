import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';

import NurdCard, { NurdCardProfile } from '@/components/profile/nurd-card';

export default function NurdProfilePage() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Initial profile state
  const [profile, setProfile] = useState<NurdCardProfile>({
    avatarUrl: '',
    name: '',
    classType: '',
    level: '',
    coreTrait: '',
    vibeAbility: '',
    syncStatus: '',
    bio: '',
    isOnline: true
  });
  
  // Store previous profile state for undo functionality
  const [previousProfile, setPreviousProfile] = useState<NurdCardProfile | null>(null);
  
  // Form related states
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save previous profile for undo
      setPreviousProfile({...profile});
      
      // Here you would typically save to database
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      toast({
        title: "Profile Updated",
        description: "Your NURD card has been successfully updated.",
        variant: "default",
      });
      
      setIsSubmitting(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  // Handle profile reset
  const handleReset = () => {
    setProfile({
      avatarUrl: '',
      name: '',
      classType: '',
      level: '',
      coreTrait: '',
      vibeAbility: '',
      syncStatus: '',
      bio: '',
      isOnline: true
    });
    
    toast({
      title: "Profile Reset",
      description: "Your NURD card has been reset to default values.",
    });
  };
  
  // Handle undo changes
  const handleUndo = () => {
    if (previousProfile) {
      setProfile(previousProfile);
      setPreviousProfile(null);
      
      toast({
        title: "Changes Undone",
        description: "Your previous profile settings have been restored.",
      });
    }
  };
  
  // Clear individual field
  const handleClearField = (fieldName: keyof NurdCardProfile) => {
    setProfile(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>NURD Profile Card | NURD App</title>
      </Helmet>
      
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-3">Your NURD Card Profile</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Customize your digital NURD trading card to showcase your skills, achievements, and personality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Card Preview (Left Side on Desktop, Top on Mobile) */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="sticky top-24">
                <h2 className="font-heading font-semibold text-xl mb-4">Card Preview</h2>
                <NurdCard profile={profile} className="w-full max-w-sm mx-auto" />
                
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleReset}
                    disabled={isSubmitting}
                  >
                    Reset Card
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleUndo}
                    disabled={isSubmitting || !previousProfile}
                  >
                    Undo Changes
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Form (Right Side on Desktop, Bottom on Mobile) */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Your NURD Card</CardTitle>
                  <CardDescription>
                    Customize your NURD identity with the form below. All fields are optional.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center">
                          <Label htmlFor="avatarUrl">Avatar Image URL</Label>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleClearField('avatarUrl')}
                            className="h-6 text-xs text-gray-500"
                          >
                            Clear
                          </Button>
                        </div>
                        <Input
                          id="avatarUrl"
                          name="avatarUrl"
                          placeholder="https://example.com/your-avatar.png"
                          value={profile.avatarUrl}
                          onChange={handleInputChange}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter a direct link to your image (JPG, PNG, or GIF)
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center">
                          <Label htmlFor="name">Name</Label>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleClearField('name')}
                            className="h-6 text-xs text-gray-500"
                          >
                            Clear
                          </Button>
                        </div>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your NURD name"
                          value={profile.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between items-center">
                            <Label htmlFor="classType">Class</Label>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleClearField('classType')}
                              className="h-6 text-xs text-gray-500"
                            >
                              Clear
                            </Button>
                          </div>
                          <Input
                            id="classType"
                            name="classType"
                            placeholder="Tech Sage, Code Ninja, etc."
                            value={profile.classType}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center">
                            <Label htmlFor="level">Level</Label>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleClearField('level')}
                              className="h-6 text-xs text-gray-500"
                            >
                              Clear
                            </Button>
                          </div>
                          <Input
                            id="level"
                            name="level"
                            placeholder="1-10"
                            value={profile.level}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between items-center">
                            <Label htmlFor="coreTrait">Core Trait</Label>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleClearField('coreTrait')}
                              className="h-6 text-xs text-gray-500"
                            >
                              Clear
                            </Button>
                          </div>
                          <Input
                            id="coreTrait"
                            name="coreTrait"
                            placeholder="Vitality, Wisdom, etc."
                            value={profile.coreTrait}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center">
                            <Label htmlFor="vibeAbility">Vibe Ability</Label>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleClearField('vibeAbility')}
                              className="h-6 text-xs text-gray-500"
                            >
                              Clear
                            </Button>
                          </div>
                          <Input
                            id="vibeAbility"
                            name="vibeAbility"
                            placeholder="Special skill or ability"
                            value={profile.vibeAbility}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center">
                          <Label htmlFor="syncStatus">NURD Sync Status</Label>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleClearField('syncStatus')}
                            className="h-6 text-xs text-gray-500"
                          >
                            Clear
                          </Button>
                        </div>
                        <Input
                          id="syncStatus"
                          name="syncStatus"
                          placeholder="Active, Learning, Creating, etc."
                          value={profile.syncStatus}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center">
                          <Label htmlFor="bio">Bio</Label>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleClearField('bio')}
                            className="h-6 text-xs text-gray-500"
                          >
                            Clear
                          </Button>
                        </div>
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder="A short description about yourself..."
                          value={profile.bio}
                          onChange={handleInputChange}
                          className="resize-none"
                          rows={3}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Maximum 150 characters
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>About NURD Cards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        NURD Cards are digital identity cards that showcase your unique skills, personality, and achievements within the NURD community.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-2">Card Features</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <Badge variant="outline" className="mt-0.5">Class</Badge>
                              <span>Your tech specialty or focus area</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Badge variant="outline" className="mt-0.5">Level</Badge>
                              <span>Represents your experience and skill level</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Badge variant="outline" className="mt-0.5">Core Trait</Badge>
                              <span>Your primary personal attribute</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Badge variant="outline" className="mt-0.5">Vibe Ability</Badge>
                              <span>Your unique skill or superpower</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-2">Card Benefits</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <span>• Share your profile with other NURDs</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span>• Connect with peers who have complementary skills</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span>• Showcase your progress and achievements</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span>• Express your unique personality and abilities</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}