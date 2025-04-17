import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorScheme } from '@/providers/color-scheme-provider';

interface UserPreferences {
  colorScheme: ColorScheme;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
  autoDetect: boolean;
}

const defaultPreferences: UserPreferences = {
  colorScheme: 'default',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false,
  autoDetect: true,
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetPreferences: () => void;
  isLoading: boolean;
  autoDetectPreferences: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

interface UserPreferencesProviderProps {
  children: React.ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = () => {
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences);
          setPreferences(prev => ({
            ...prev,
            ...parsed
          }));
        } catch (error) {
          console.error('Failed to parse user preferences:', error);
          // If parsing fails, reset to defaults
          localStorage.removeItem('userPreferences');
        }
      }
      
      // Auto-detect on first load if enabled
      if (preferences.autoDetect) {
        autoDetectPreferences();
      }
      
      setIsLoading(false);
    };

    loadPreferences();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
  }, [preferences, isLoading]);

  // Update a single preference value
  const updatePreference = <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset all preferences to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('userPreferences');
  };

  // Auto-detect preferences from system/browser settings
  const autoDetectPreferences = () => {
    if (!preferences.autoDetect) return;
    
    // Detect preferred color scheme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Could set a specific dark/light color scheme here based on preference
    
    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detect contrast preference (if supported)
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
    
    setPreferences(prev => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast,
      // Don't automatically change color scheme here, as we allow manual selection
      // If we want to auto-detect, we would add: colorScheme: prefersDarkScheme ? 'dark' : 'light',
    }));
  };

  return (
    <UserPreferencesContext.Provider 
      value={{ 
        preferences, 
        updatePreference, 
        resetPreferences, 
        isLoading,
        autoDetectPreferences,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};