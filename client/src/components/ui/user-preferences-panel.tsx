import React, { useState } from 'react';
import { useUserPreferences } from '@/providers/user-preferences-provider';
import { useColorScheme } from '@/providers/color-scheme-provider';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { CheckIcon, PaletteIcon, Settings2, SlidersHorizontal, EyeIcon, MousePointerClick, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const UserPreferencesPanel = () => {
  const { preferences, updatePreference, resetPreferences, autoDetectPreferences } = useUserPreferences();
  const { colorScheme, setColorScheme, availableSchemes } = useColorScheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // Font size conversion (small/medium/large to pixels or rem for preview)
  const fontSizes = {
    small: '0.875rem',
    medium: '1rem',
    large: '1.125rem'
  };
  
  // Preview text for font size
  const previewText = "The quick brown fox jumps over the lazy dog";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative group"
          aria-label="User preferences"
        >
          <Settings2 className="h-5 w-5 rotate-0 scale-100 transition-all group-hover:text-primary" />
          <span className="sr-only">User Preferences</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Personalize Your Experience</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="appearance" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="appearance">
              <PaletteIcon className="h-4 w-4 mr-2" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="accessibility">
              <EyeIcon className="h-4 w-4 mr-2" /> Accessibility
            </TabsTrigger>
            <TabsTrigger value="interaction">
              <MousePointerClick className="h-4 w-4 mr-2" /> Interaction
            </TabsTrigger>
          </TabsList>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Color Scheme</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableSchemes.map((scheme) => (
                  <div 
                    key={scheme.id}
                    className={cn(
                      "relative p-3 border rounded-lg cursor-pointer transition-all",
                      "hover:shadow-md bg-card/80 backdrop-blur-sm overflow-hidden",
                      colorScheme === scheme.id 
                        ? "ring-2 ring-primary border-primary/40" 
                        : "hover:border-primary/50"
                    )}
                    onClick={() => {
                      setColorScheme(scheme.id);
                      updatePreference('colorScheme', scheme.id);
                    }}
                  >
                    <div className="flex items-center mb-2">
                      {/* Color preview */}
                      <div 
                        className="h-7 w-7 rounded-full mr-2 flex-shrink-0"
                        style={{ 
                          background: `linear-gradient(135deg, ${scheme.colors.primary}, ${scheme.colors.accent})` 
                        }}
                      >
                        {colorScheme === scheme.id && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-full w-full bg-background/80 rounded-full flex items-center justify-center"
                          >
                            <CheckIcon className="h-4 w-4 text-primary" />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="font-medium">{scheme.name}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {scheme.description}
                        </span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {scheme.tags && scheme.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {scheme.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Recommended indicator */}
                    {scheme.recommended && (
                      <div className="absolute top-2 right-2 text-xs font-medium text-green-500 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Recommended
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Font Size</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="font-size">Text Size</Label>
                  <span className="text-sm font-medium capitalize">
                    {preferences.fontSize}
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    id="font-size"
                    min={0}
                    max={2}
                    step={1}
                    defaultValue={preferences.fontSize === 'small' ? [0] : preferences.fontSize === 'medium' ? [1] : [2]}
                    onValueChange={(value) => {
                      const size = value[0] === 0 ? 'small' : value[0] === 1 ? 'medium' : 'large';
                      updatePreference('fontSize', size);
                    }}
                    className="flex-1"
                  />
                  <SlidersHorizontal className="h-6 w-6 text-muted-foreground" />
                </div>
                
                {/* Preview text */}
                <div 
                  className="p-4 border rounded-md bg-muted/50 mt-2"
                  style={{ fontSize: fontSizes[preferences.fontSize] }}
                >
                  {previewText}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better readability
                  </p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) => updatePreference('highContrast', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reduced-motion">Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations throughout the interface
                  </p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={preferences.reducedMotion}
                  onCheckedChange={(checked) => updatePreference('reducedMotion', checked)}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Interaction Tab */}
          <TabsContent value="interaction" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-detect">Auto-detect Settings</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically detect and apply settings based on your system preferences
                  </p>
                </div>
                <Switch
                  id="auto-detect"
                  checked={preferences.autoDetect}
                  onCheckedChange={(checked) => updatePreference('autoDetect', checked)}
                />
              </div>
              
              {preferences.autoDetect && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md text-sm">
                  When enabled, the app will adapt to your system preferences for color scheme, reduced motion, and contrast.
                </div>
              )}
              
              <Button 
                onClick={autoDetectPreferences}
                variant="outline"
                className="w-full"
                disabled={!preferences.autoDetect}
              >
                <CheckIcon className="h-4 w-4 mr-2" /> Detect Now
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Reset Preferences</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Restore all preferences to their default values
              </p>
              
              <Button 
                onClick={resetPreferences}
                variant="destructive"
                className="w-full"
              >
                Reset All Preferences
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};