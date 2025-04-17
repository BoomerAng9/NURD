import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { ColorScheme } from './color-scheme-provider';

// Define the shape of user preferences
interface UserPreferences {
  colorScheme: ColorScheme;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
  autoDetect: boolean;
}

// Default user preferences
const defaultPreferences: UserPreferences = {
  colorScheme: 'default',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false,
  autoDetect: true
};

// Interface for the context
interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetPreferences: () => void;
  isLoading: boolean;
  autoDetectPreferences: () => void;
}

// Create the context
const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: defaultPreferences,
  updatePreference: () => {},
  resetPreferences: () => {},
  isLoading: false,
  autoDetectPreferences: () => {}
});

// Props for the provider component
interface UserPreferencesProviderProps {
  children: React.ReactNode;
}

// The preferences provider component
export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage or API when component mounts or user changes
  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      
      try {
        // If user is logged in, try to fetch preferences from API
        if (user) {
          // This would be replaced with an actual API call in production
          // const response = await fetch(`/api/user-preferences/${user.id}`);
          // if (response.ok) {
          //   const data = await response.json();
          //   setPreferences(data);
          //   return;
          // }
        }
        
        // Fallback to localStorage if no user or API fetch fails
        const storedPrefs = localStorage.getItem('nurd-user-preferences');
        if (storedPrefs) {
          try {
            const parsedPrefs = JSON.parse(storedPrefs);
            // Validate the parsed preferences structure
            if (typeof parsedPrefs === 'object' && parsedPrefs !== null) {
              // Merge with default preferences to handle missing properties
              setPreferences({
                ...defaultPreferences,
                ...parsedPrefs
              });
            }
          } catch (e) {
            console.error('Failed to parse stored preferences', e);
            setPreferences(defaultPreferences);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Save preferences whenever they change
  useEffect(() => {
    if (!isLoading) {
      // Save to localStorage
      localStorage.setItem('nurd-user-preferences', JSON.stringify(preferences));
      
      // If user is logged in, save to API
      if (user) {
        // This would be replaced with an actual API call in production
        // fetch(`/api/user-preferences/${user.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(preferences)
        // });
      }
    }
  }, [preferences, isLoading, user]);

  // Update a single preference
  const updatePreference = <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset preferences to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  // Auto-detect preferences based on system settings
  const autoDetectPreferences = () => {
    const newPrefs = { ...preferences };
    
    // Detect preferred color scheme
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // If dark mode is preferred, use a darker color scheme
      newPrefs.colorScheme = 'space';
    } else {
      // If light mode is preferred, use a lighter color scheme
      newPrefs.colorScheme = 'default';
    }
    
    // Detect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      newPrefs.reducedMotion = true;
    }
    
    // Detect contrast preference
    if (window.matchMedia('(prefers-contrast: more)').matches) {
      newPrefs.highContrast = true;
    }
    
    setPreferences(newPrefs);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updatePreference,
        resetPreferences,
        isLoading,
        autoDetectPreferences
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Custom hook to use the user preferences context
export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  
  return context;
};