import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserPreferences } from './user-preferences-provider';

// Define the available color schemes
export type ColorScheme = 'default' | 'ocean' | 'forest' | 'sunset' | 'space';

// Define the shape of our context
interface ColorSchemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  availableSchemes: { 
    id: ColorScheme; 
    name: string; 
    description: string; 
    colors: { primary: string; accent: string; };
    recommended?: boolean;
    tags?: string[];
  }[];
}

// Create the context with a default value
const ColorSchemeContext = createContext<ColorSchemeContextType>({
  colorScheme: 'default',
  setColorScheme: () => {},
  availableSchemes: [],
});

// Define the props for our provider component
interface ColorSchemeProviderProps {
  children: React.ReactNode;
}

// Available color schemes with additional information
const schemes = [
  {
    id: 'default' as ColorScheme,
    name: 'NURD Blue',
    description: 'The classic NURD blue and purple gradients',
    colors: {
      primary: '#3760ff',
      accent: '#6638e8',
    },
    recommended: true,
    tags: ['vibrant', 'energetic', 'creative']
  },
  {
    id: 'ocean' as ColorScheme,
    name: 'Ocean Waves',
    description: 'Calming blue and teal tones inspired by the ocean',
    colors: {
      primary: '#0891b2',
      accent: '#2563eb',
    },
    tags: ['calm', 'peaceful', 'focused']
  },
  {
    id: 'forest' as ColorScheme,
    name: 'Forest Canopy',
    description: 'Refreshing green tones from nature',
    colors: {
      primary: '#16a34a',
      accent: '#059669',
    },
    tags: ['natural', 'fresh', 'growth']
  },
  {
    id: 'sunset' as ColorScheme,
    name: 'Sunset Glow',
    description: 'Warm orange and red tones inspired by sunset',
    colors: {
      primary: '#ea580c',
      accent: '#dc2626',
    },
    tags: ['warm', 'energetic', 'creative']
  },
  {
    id: 'space' as ColorScheme,
    name: 'Cosmic Purple',
    description: 'Deep purple and indigo tones of the cosmos',
    colors: {
      primary: '#7c3aed',
      accent: '#4f46e5',
    },
    tags: ['mysterious', 'creative', 'imaginative']
  },
];

export const ColorSchemeProvider: React.FC<ColorSchemeProviderProps> = ({ children }) => {
  // Access user preferences if available, otherwise use local state
  const userPrefsContext = useContext(React.createContext(null));
  const hasUserPrefs = userPrefsContext !== null;
  
  // If we have user preferences, use them; otherwise use local state
  const userPrefs = hasUserPrefs ? useUserPreferences() : null;
  
  // Initialize color scheme from preferences, localStorage, or default
  const [localColorScheme, setLocalColorScheme] = useState<ColorScheme>(() => {
    if (typeof window !== 'undefined') {
      const savedScheme = localStorage.getItem('nurd-color-scheme');
      return (savedScheme as ColorScheme) || 'default';
    }
    return 'default';
  });

  // Use user preferences if available, otherwise use local state
  const colorScheme = userPrefs ? userPrefs.preferences.colorScheme : localColorScheme;
  
  // Update the color scheme in user preferences or local state
  const setColorScheme = (scheme: ColorScheme) => {
    if (userPrefs) {
      userPrefs.updatePreference('colorScheme', scheme);
    } else {
      setLocalColorScheme(scheme);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nurd-color-scheme', scheme);
      }
    }
  };

  // Apply the CSS variables for the current color scheme
  useEffect(() => {
    const scheme = schemes.find(s => s.id === colorScheme) || schemes[0];
    
    // Apply CSS variables to the root element
    document.documentElement.style.setProperty('--color-primary', scheme.colors.primary);
    document.documentElement.style.setProperty('--color-accent', scheme.colors.accent);
    
    // Update the data-color-scheme attribute for additional CSS targeting
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
    
    console.log(`Applied color scheme: ${scheme.name}`);
  }, [colorScheme]);

  // Provide the context value to children
  return (
    <ColorSchemeContext.Provider 
      value={{ 
        colorScheme, 
        setColorScheme, 
        availableSchemes: schemes
      }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
};

// Custom hook to use the color scheme context
export const useColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  
  if (context === undefined) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  
  return context;
};