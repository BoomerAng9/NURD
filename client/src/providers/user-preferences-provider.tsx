import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorScheme } from '@/providers/color-scheme-provider';
import { applyUserPreferences, detectSystemPreferences } from '@/lib/preference-utils';

export interface UserPreferences {
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
      
      // Apply preferences to the document
      applyUserPreferences(preferences);
      console.log('Applied user preferences:', preferences);
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
    
    // Use our utility function to detect system preferences
    const detectedPreferences = detectSystemPreferences();
    
    setPreferences(prev => ({
      ...prev,
      ...detectedPreferences,
      // We're not auto-detecting colorScheme to allow for user customization
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