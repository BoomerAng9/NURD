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
  { id: 'default', name: 'Default Blue', description: 'Standard blue theme' },
  { id: 'purple', name: 'Purple', description: 'Rich purple theme' },
  { id: 'green', name: 'Green', description: 'Nature-inspired green theme' },
  { id: 'orange', name: 'Orange', description: 'Warm orange theme' },
  { id: 'red', name: 'Red', description: 'Bold red theme' },
  { id: 'teal', name: 'Teal', description: 'Calm teal theme' },
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
        <div className="space-y-2">
          <Label>Color Scheme</Label>
          <Select value={colorScheme} onValueChange={setColorScheme}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a color scheme" />
            </SelectTrigger>
            <SelectContent>
              {colorSchemes.map(scheme => (
                <SelectItem key={scheme.id} value={scheme.id}>
                  {scheme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <div className="space-y-2 pt-4">
          <Label>Preview</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <div className="h-4 w-24 bg-primary mb-2 rounded"></div>
              <div className="h-4 w-32 bg-primary/80 mb-2 rounded"></div>
              <div className="h-4 w-40 bg-primary/60 mb-2 rounded"></div>
              <div className="h-4 w-20 bg-primary/40 rounded"></div>
            </div>
            <div 
              className="p-4 border rounded-md flex items-center justify-center text-center"
              style={{ backgroundColor: 'var(--accent-color)', color: '#fff' }}
            >
              <p className="font-medium">Accent Color Preview</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}