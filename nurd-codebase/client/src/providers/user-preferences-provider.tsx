import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorScheme } from '@/providers/color-scheme-provider';
import { applyUserPreferences, detectSystemPreferences } from '@/lib/preference-utils';
import { toast } from '@/hooks/use-toast';

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
  resetPreferences: () => Promise<void>;
  isLoading: boolean;
  autoDetectPreferences: () => Promise<void>;
  isAuthenticated: boolean;
  syncWithServer: () => Promise<void>;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

interface UserPreferencesProviderProps {
  children: React.ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authentication check disabled - all users treated as authenticated for preferences
  useEffect(() => {
    // Set authenticated true for all users after Replit Auth removal
    setIsAuthenticated(true);
  }, []);

  // Load preferences on mount (from server if authenticated, otherwise from localStorage)
  useEffect(() => {
    const loadPreferences = async () => {
      // First try to load from server if authenticated
      if (isAuthenticated) {
        try {
          const response = await fetch('/api/user/preferences');
          if (response.ok) {
            const data = await response.json();
            if (data.preferences) {
              // Map from server format to our format
              const serverPrefs = {
                fontSize: data.preferences.fontSize || 'medium',
                highContrast: data.preferences.highContrast || false,
                reducedMotion: data.preferences.reducedMotion || false,
                // Keep local color scheme and autoDetect settings
                colorScheme: preferences.colorScheme,
                autoDetect: preferences.autoDetect,
              };
              
              setPreferences(prev => ({
                ...prev,
                ...serverPrefs
              }));
              
              // Sync with localStorage
              localStorage.setItem('userPreferences', JSON.stringify(serverPrefs));
              
              setIsLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error loading preferences from server:', error);
          // Fall back to localStorage
        }
      }
      
      // Fall back to localStorage if not authenticated or server fetch failed
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
        await autoDetectPreferences();
      }
      
      setIsLoading(false);
    };

    if (!isLoading || isAuthenticated) {
      loadPreferences();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Save preferences to localStorage and server whenever they change
  useEffect(() => {
    if (!isLoading) {
      // Always save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // Apply preferences to the document
      applyUserPreferences(preferences);
      console.log('Applied user preferences:', preferences);
      
      // Save to server if authenticated (debounced to avoid too many requests)
      const timeoutId = setTimeout(() => {
        if (isAuthenticated) {
          syncWithServer();
        }
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences, isLoading, isAuthenticated]);

  // Sync preferences with server
  const syncWithServer = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fontSize: preferences.fontSize,
          highContrast: preferences.highContrast,
          reducedMotion: preferences.reducedMotion,
          // We don't sync color scheme or autoDetect to the server 
          // as they're frontend-specific
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to sync preferences with server');
      }
    } catch (error) {
      console.error('Error syncing preferences with server:', error);
    }
  };

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
  const resetPreferences = async () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('userPreferences');
    
    // If authenticated, reset on the server too
    if (isAuthenticated) {
      try {
        const response = await fetch('/api/user/preferences/reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          toast({
            title: "Preferences Reset",
            description: "Your preferences have been reset to defaults",
          });
        } else {
          console.error('Failed to reset preferences on server');
        }
      } catch (error) {
        console.error('Error resetting preferences on server:', error);
      }
    }
  };

  // Auto-detect preferences from system/browser settings
  const autoDetectPreferences = async () => {
    if (!preferences.autoDetect) return;
    
    // Use our utility function to detect system preferences
    const detectedPreferences = detectSystemPreferences();
    
    setPreferences(prev => ({
      ...prev,
      ...detectedPreferences,
      // We're not auto-detecting colorScheme to allow for user customization
    }));
    
    // If authenticated, sync the detected preferences to server
    if (isAuthenticated) {
      try {
        const response = await fetch('/api/user/preferences/detect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(detectedPreferences),
        });
        
        if (!response.ok) {
          console.error('Failed to sync detected preferences with server');
        }
      } catch (error) {
        console.error('Error syncing detected preferences with server:', error);
      }
    }
  };

  return (
    <UserPreferencesContext.Provider 
      value={{ 
        preferences, 
        updatePreference, 
        resetPreferences, 
        isLoading,
        autoDetectPreferences,
        isAuthenticated,
        syncWithServer,
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