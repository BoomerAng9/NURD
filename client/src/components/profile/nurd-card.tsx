import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Define profile types
export interface NurdCardProfile {
  avatarUrl: string;
  name: string;
  classType: string;
  level: string;
  coreTrait: string;
  vibeAbility: string;
  syncStatus: string;
  bio: string;
  isOnline?: boolean;
}

interface NurdCardProps {
  profile: NurdCardProfile;
  onUpdateProfile?: (profile: NurdCardProfile) => void;
  isEditable?: boolean;
  className?: string;
}

export default function NurdCard({ 
  profile, 
  onUpdateProfile, 
  isEditable = false, 
  className = "" 
}: NurdCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<NurdCardProfile>({...profile});
  
  // Handle input changes in edit mode
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save changes
  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile(editedProfile);
    }
    setIsEditing(false);
  };
  
  // Cancel editing
  const handleCancel = () => {
    setEditedProfile({...profile});
    setIsEditing(false);
  };
  
  return (
    <div className={cn("relative", className)}>
      {isEditable && !isEditing && (
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute -top-3 -right-3 z-10 bg-background"
          onClick={() => setIsEditing(true)}
        >
          Edit Card
        </Button>
      )}
      
      {isEditing ? (
        /* Editing Form */
        <div className="bg-card border rounded-lg p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4">Edit Your NURD Card</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                value={editedProfile.avatarUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/your-avatar.png"
              />
            </div>
            
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={editedProfile.name}
                onChange={handleInputChange}
                placeholder="Tech Kid"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="classType">Class</Label>
                <Input
                  id="classType"
                  name="classType"
                  value={editedProfile.classType}
                  onChange={handleInputChange}
                  placeholder="Tech Sage"
                />
              </div>
              
              <div>
                <Label htmlFor="level">Level</Label>
                <Input
                  id="level"
                  name="level"
                  value={editedProfile.level}
                  onChange={handleInputChange}
                  placeholder="7"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coreTrait">Core Trait</Label>
                <Input
                  id="coreTrait"
                  name="coreTrait"
                  value={editedProfile.coreTrait}
                  onChange={handleInputChange}
                  placeholder="Vitality"
                />
              </div>
              
              <div>
                <Label htmlFor="vibeAbility">Vibe Ability</Label>
                <Input
                  id="vibeAbility"
                  name="vibeAbility"
                  value={editedProfile.vibeAbility}
                  onChange={handleInputChange}
                  placeholder="Kinetic Fitness"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="syncStatus">NURD Sync Status</Label>
              <Input
                id="syncStatus"
                name="syncStatus"
                value={editedProfile.syncStatus}
                onChange={handleInputChange}
                placeholder="Active"
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={editedProfile.bio}
                onChange={handleInputChange}
                placeholder="A young innovator with boundless energy..."
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Display Card */
        <Card className="overflow-hidden border-2 border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 text-cyan-400 p-1">
          <div className="rounded-md border border-cyan-500/30 overflow-hidden">
            <div className="bg-gradient-to-br from-cyan-900/40 to-gray-900 p-5">
              {/* Header & Name */}
              <div className="relative mb-4">
                <div className="bg-orange-900/90 absolute -left-6 -top-5 px-4 py-2 pr-8 transform skew-x-12 border-r-2 border-b-2 border-orange-500/70 shadow-lg">
                  <h2 className="font-bold text-lg text-orange-400 transform -skew-x-12">
                    {profile.name || 'NAME'}
                  </h2>
                </div>
                
                {/* Online Status Indicator */}
                {profile.isOnline !== undefined && (
                  <div className="absolute top-0 right-0">
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        profile.isOnline ? "bg-green-500" : "bg-gray-400"
                      )}></div>
                      <span className="text-xs">
                        {profile.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Avatar Image */}
              {profile.avatarUrl && (
                <div className="flex justify-center mb-4 mt-8">
                  <div className="relative w-36 h-36 overflow-hidden rounded-lg border-2 border-cyan-500/40">
                    <img 
                      src={profile.avatarUrl} 
                      alt={`${profile.name}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  </div>
                </div>
              )}
              
              {/* Stats Panel */}
              <div className="grid grid-cols-2 gap-2 mt-6 mb-4">
                <div className="flex justify-between items-center border-b border-cyan-500/30 pb-1">
                  <span className="text-cyan-300 text-sm">CLASS</span>
                  <span className="font-bold text-yellow-400">
                    {profile.classType || 'TECH SAGE'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-b border-cyan-500/30 pb-1">
                  <span className="text-cyan-300 text-sm">LEVEL</span>
                  <span className="font-bold text-orange-400">
                    {profile.level || '1'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-b border-cyan-500/30 pb-1">
                  <span className="text-cyan-300 text-sm">CORE TRAIT</span>
                  <span className="font-bold text-yellow-400">
                    {profile.coreTrait || 'VITALITY'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-b border-cyan-500/30 pb-1">
                  <span className="text-cyan-300 text-sm">VIBE ABILITY</span>
                  <span className="font-bold text-yellow-400">
                    {profile.vibeAbility || 'KINETIC FITNESS'}
                  </span>
                </div>
              </div>
              
              {/* Sync Status */}
              <div className="flex justify-between items-center border-b border-cyan-500/30 pb-2 mb-3">
                <span className="text-cyan-300 text-sm">NURD SYNC STATUS</span>
                <Badge className="bg-yellow-500 text-black font-bold">
                  {profile.syncStatus || 'ACTIVE'}
                </Badge>
              </div>
              
              {/* Bio */}
              {profile.bio && (
                <div className="bg-gray-900/50 border border-cyan-500/20 rounded p-3 mb-4">
                  <p className="text-sm text-gray-300">
                    {profile.bio}
                  </p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-between gap-2 mt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 border-cyan-500/40 text-cyan-400 hover:bg-cyan-950 hover:text-cyan-300"
                >
                  TAP TO CONNECT
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-orange-500/40 text-orange-400 hover:bg-orange-950 hover:text-orange-300"
                >
                  SWIPE TO DRAFT
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}