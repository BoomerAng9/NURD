import React from 'react';
import { useTheme } from '@/providers/theme-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Predefined color schemes
const colorSchemes = [
  { id: 'default', name: 'Default Blue', description: 'Standard blue theme', color: '#3B82F6' },
  { id: 'ocean', name: 'Ocean', description: 'Calm and soothing ocean-inspired theme', color: '#0EA5E9' },
  { id: 'forest', name: 'Forest', description: 'Nature-inspired green theme', color: '#22C55E' },
  { id: 'sunset', name: 'Sunset', description: 'Warm orange and gold hues', color: '#F97316' },
  { id: 'space', name: 'Space', description: 'Futuristic purple and violet theme', color: '#8B5CF6' },
];

export function ThemeEditor() {
  const { 
    colorScheme, 
    themeMode, 
    accentColor, 
    setColorScheme, 
    setThemeMode, 
    setAccentColor,
    isLoading
  } = useTheme();

  const [customColor, setCustomColor] = React.useState(accentColor);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(event.target.value);
  };

  const applyCustomColor = () => {
    setAccentColor(customColor);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Theme Preferences</CardTitle>
          <CardDescription>Loading your theme preferences...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-6">
          <div className="animate-pulse h-32 w-32 bg-primary/10 rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Theme Preferences</CardTitle>
        <CardDescription>Customize how NURD looks for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Mode Selection */}
        <div className="space-y-2">
          <Label>Theme Mode</Label>
          <RadioGroup 
            defaultValue={themeMode} 
            onValueChange={setThemeMode}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">Follow System</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Color Scheme Selection */}
        <div className="space-y-4">
          <Label>Color Scheme</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {colorSchemes.map(scheme => (
              <div 
                key={scheme.id}
                className={`relative p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-all duration-300 hover:shadow-md ${
                  colorScheme === scheme.id 
                    ? 'ring-2 ring-primary shadow-md' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setColorScheme(scheme.id)}
              >
                <div 
                  className="w-16 h-16 rounded-full mb-2" 
                  style={{ backgroundColor: scheme.color }}
                />
                <span className="font-medium text-sm">{scheme.name}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {colorSchemes.find(s => s.id === colorScheme)?.description || 'Custom color scheme'}
          </p>
        </div>

        {/* Accent Color Customization */}
        <div className="space-y-2">
          <Label>Accent Color</Label>
          <div className="flex space-x-2">
            <Input
              type="color"
              value={customColor}
              onChange={handleColorChange}
              className="w-16 p-1 h-10 cursor-pointer"
            />
            <Input
              type="text"
              value={customColor}
              onChange={handleColorChange}
              className="flex-1"
              placeholder="#3B82F6"
            />
            <Button onClick={applyCustomColor} type="button">
              Apply
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a custom accent color
          </p>
        </div>

        {/* Preview */}
        <div className="space-y-4 pt-4">
          <Label>Preview</Label>
          <div className="grid grid-cols-1 gap-6">
            {/* UI Components Preview */}
            <div className="p-6 border rounded-lg bg-card shadow">
              <h4 className="font-medium mb-4">UI Components Preview</h4>
              <div className="flex flex-wrap gap-3 mb-4">
                <Button>Primary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="secondary">Secondary Button</Button>
              </div>
              <div className="p-4 border rounded-md mb-4" 
                style={{ 
                  backgroundColor: 'var(--accent-color)', 
                  color: 'white' 
                }}
              >
                <p className="font-medium">Accent Color Card</p>
                <p className="text-sm opacity-90">This card uses your selected accent color</p>
              </div>
              <div className="flex gap-3 justify-center">
                <div className="h-12 w-12 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }}></div>
                <div className="h-12 w-12 rounded-full" style={{ backgroundColor: 'var(--secondary-color)' }}></div>
                <div className="h-12 w-12 rounded-full" style={{ backgroundColor: 'var(--highlight-color)' }}></div>
              </div>
            </div>
            
            {/* Theme Information */}
            <div className="p-6 border rounded-lg">
              <h4 className="font-medium mb-4">Active Theme Information</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm font-medium">Scheme</p>
                  <p className="text-sm opacity-70">{colorScheme}</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm font-medium">Mode</p>
                  <p className="text-sm opacity-70">{themeMode}</p>
                </div>
                <div className="bg-muted p-3 rounded-md col-span-2">
                  <p className="text-sm font-medium">Accent Color</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-4 w-4 rounded" style={{ backgroundColor: accentColor }}></div>
                    <p className="text-sm opacity-70">{accentColor}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}