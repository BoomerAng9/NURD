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
  { 
    id: 'default', 
    name: 'Default Blue', 
    description: 'Standard blue theme with energetic accents', 
    color: '#3B82F6',
    secondaryColor: '#3EC6E0',
    highlightColor: '#6A2FF8'
  },
  { 
    id: 'ocean', 
    name: 'Ocean', 
    description: 'Calm and soothing ocean-inspired theme', 
    color: '#0EA5E9',
    secondaryColor: '#06B6D4',
    highlightColor: '#2563EB'
  },
  { 
    id: 'forest', 
    name: 'Forest', 
    description: 'Nature-inspired green theme', 
    color: '#22C55E',
    secondaryColor: '#10B981',
    highlightColor: '#4ADE80'
  },
  { 
    id: 'sunset', 
    name: 'Sunset', 
    description: 'Warm orange and gold hues', 
    color: '#F97316',
    secondaryColor: '#FB923C',
    highlightColor: '#FBBF24'
  },
  { 
    id: 'space', 
    name: 'Space', 
    description: 'Futuristic purple and violet theme', 
    color: '#8B5CF6',
    secondaryColor: '#A78BFA',
    highlightColor: '#C4B5FD'
  },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {colorSchemes.map(scheme => (
              <div 
                key={scheme.id}
                className={`relative p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden ${
                  colorScheme === scheme.id 
                    ? 'ring-2 ring-primary shadow-md' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setColorScheme(scheme.id)}
              >
                {/* Color preview */}
                <div className="flex space-x-2 mb-3">
                  <div 
                    className="w-10 h-10 rounded-full shadow-sm" 
                    style={{ backgroundColor: scheme.color }}
                  />
                  <div 
                    className="w-8 h-8 rounded-full shadow-sm mt-4" 
                    style={{ backgroundColor: scheme.secondaryColor }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full shadow-sm mt-1" 
                    style={{ backgroundColor: scheme.highlightColor }}
                  />
                </div>
                
                {/* Scheme name and indicator */}
                <span className="font-medium text-sm mb-1">{scheme.name}</span>
                
                {/* Selected indicator */}
                {colorScheme === scheme.id && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -right-1 -top-1 w-12 h-12">
                      <div 
                        className="absolute transform rotate-45 bg-primary text-white top-6 right-4 text-xs py-0.5 px-6"
                      ></div>
                    </div>
                    <div className="absolute top-3 right-3 bg-white rounded-full p-0.5 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Background pattern */}
                <div className="absolute inset-0 -z-10 overflow-hidden opacity-5">
                  <div className="absolute bottom-0 left-0 right-0 h-16" 
                    style={{ backgroundColor: scheme.color }}></div>
                  <div className="absolute top-0 w-full h-16 transform -rotate-45 -translate-x-1/2" 
                    style={{ backgroundColor: scheme.highlightColor }}></div>
                </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* UI Components Preview */}
            <div className="p-6 border rounded-lg bg-card shadow">
              <h4 className="font-medium mb-4">UI Components Preview</h4>
              <div className="flex flex-wrap gap-3 mb-4">
                <Button>Primary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="secondary">Secondary Button</Button>
              </div>
              <div 
                className="p-4 border rounded-md mb-4" 
                style={{ 
                  backgroundColor: 'var(--accent-color)', 
                  color: 'white' 
                }}
              >
                <p className="font-medium">Accent Color Card</p>
                <p className="text-sm opacity-90">This card uses your selected accent color</p>
              </div>
              
              {/* Color swatches */}
              <div className="border rounded-md p-4 bg-gray-50">
                <p className="text-sm font-medium mb-3">Theme Color Palette</p>
                <div className="flex gap-3 justify-center">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full mb-1" style={{ backgroundColor: 'var(--accent-color)' }}></div>
                    <span className="text-xs">Accent</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full mb-1" style={{ backgroundColor: 'var(--secondary-color)' }}></div>
                    <span className="text-xs">Secondary</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full mb-1" style={{ backgroundColor: 'var(--highlight-color)' }}></div>
                    <span className="text-xs">Highlight</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full border mb-1" style={{ backgroundColor: 'var(--muted-color)' }}></div>
                    <span className="text-xs">Muted</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mock UI Preview */}
            <div className="border rounded-lg overflow-hidden">
              <div className="h-10 flex items-center px-4 bg-gray-100 border-b">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <div className="flex-1 text-center text-xs font-medium text-gray-600">NURD Application Preview</div>
              </div>
              
              <div className="p-4" style={{ backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#f9f9f9' }}>
                {/* Mock navbar */}
                <div className="flex justify-between items-center p-2 mb-3 rounded"
                  style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}>
                  <div className="font-bold text-sm">NURD</div>
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-white/50"></div>
                    <div className="h-2 w-2 rounded-full bg-white/50"></div>
                    <div className="h-2 w-2 rounded-full bg-white/50"></div>
                  </div>
                </div>
                
                {/* Mock content */}
                <div className="flex gap-2 mb-3">
                  <div className="w-1/3 h-20 rounded"
                    style={{ backgroundColor: 'var(--secondary-color)', opacity: 0.7 }}></div>
                  <div className="w-2/3 space-y-2">
                    <div className="h-4 rounded"
                      style={{ backgroundColor: 'var(--highlight-color)', opacity: 0.7 }}></div>
                    <div className="h-4 rounded w-2/3"
                      style={{ backgroundColor: 'var(--highlight-color)', opacity: 0.5 }}></div>
                    <div className="h-4 rounded w-4/5"
                      style={{ backgroundColor: 'var(--highlight-color)', opacity: 0.3 }}></div>
                  </div>
                </div>
                
                {/* Mock button row */}
                <div className="flex gap-2 justify-end mb-3">
                  <div className="h-5 w-16 rounded-sm"
                    style={{ backgroundColor: 'var(--accent-color)', opacity: 0.8 }}></div>
                  <div className="h-5 w-16 rounded-sm"
                    style={{ backgroundColor: 'var(--secondary-color)', opacity: 0.8 }}></div>
                </div>
                
                {/* Mock card grid */}
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-2 rounded"
                      style={{ 
                        border: '1px solid rgba(var(--accent-color-rgb), 0.2)',
                        backgroundColor: 'rgba(var(--accent-color-rgb), 0.05)'
                      }}>
                      <div className="h-3 w-3/4 rounded-sm mb-1"
                        style={{ backgroundColor: 'var(--accent-color)', opacity: 0.7 }}></div>
                      <div className="h-2 w-full rounded-sm mb-1"
                        style={{ backgroundColor: 'var(--muted-color)', opacity: 0.3 }}></div>
                      <div className="h-2 w-5/6 rounded-sm"
                        style={{ backgroundColor: 'var(--muted-color)', opacity: 0.3 }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}