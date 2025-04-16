import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface ThemePreferences {
  color_scheme: string;
  theme_mode: string;
  accent_color: string;
}

interface ThemeContextType {
  colorScheme: string;
  themeMode: string;
  accentColor: string;
  setColorScheme: (scheme: string) => void;
  setThemeMode: (mode: string) => void;
  setAccentColor: (color: string) => void;
  isLoading: boolean;
}

const defaultTheme: ThemePreferences = {
  color_scheme: 'default',
  theme_mode: 'system',
  accent_color: '#3B82F6'
};

const ThemeContext = createContext<ThemeContextType>({
  colorScheme: defaultTheme.color_scheme,
  themeMode: defaultTheme.theme_mode,
  accentColor: defaultTheme.accent_color,
  setColorScheme: () => {},
  setThemeMode: () => {},
  setAccentColor: () => {},
  isLoading: true
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [colorScheme, setColorScheme] = useState<string>(defaultTheme.color_scheme);
  const [themeMode, setThemeMode] = useState<string>(defaultTheme.theme_mode);
  const [accentColor, setAccentColor] = useState<string>(defaultTheme.accent_color);
  const [hasInitializedPrefs, setHasInitializedPrefs] = useState(false);

  // Fetch user theme preferences
  const { isLoading: isLoadingPrefs } = useQuery({
    queryKey: user ? ['user-theme-preferences', user.id] : ['user-theme-preferences'],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return defaultTheme;
      
      const response = await fetch(`/api/users/${user.id}/theme-preferences`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        return defaultTheme;
      }
      
      return await response.json() as ThemePreferences;
    },
    onSuccess: (data: ThemePreferences) => {
      if (data) {
        setColorScheme(data.color_scheme);
        setThemeMode(data.theme_mode);
        setAccentColor(data.accent_color);
        setHasInitializedPrefs(true);
      }
    },
    staleTime: Infinity
  });

  // Save user theme preferences
  const { mutate: savePreferences } = useMutation({
    mutationFn: async (preferences: ThemePreferences) => {
      if (!user) return;
      
      const response = await fetch(`/api/users/${user.id}/theme-preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to save theme preferences');
      }
      
      return await response.json();
    }
  });

  // Save changes to preferences
  useEffect(() => {
    if (user && hasInitializedPrefs) {
      savePreferences({
        color_scheme: colorScheme,
        theme_mode: themeMode,
        accent_color: accentColor
      });
      
      // Invalidate the query to refresh cached data
      queryClient.invalidateQueries({ 
        queryKey: ['user-theme-preferences', user.id]
      });
    }
  }, [colorScheme, themeMode, accentColor, user, hasInitializedPrefs]);

  // Apply theme to document
  useEffect(() => {
    // Apply theme mode (light/dark)
    const root = document.documentElement;
    
    if (themeMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', themeMode === 'dark');
    }

    // Apply color scheme by adding CSS variables
    root.style.setProperty('--accent-color', accentColor);
    
    // Add the color scheme class
    root.setAttribute('data-color-scheme', colorScheme);
    
    // Listen for system theme changes if in system mode
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode, colorScheme, accentColor]);

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        themeMode,
        accentColor,
        setColorScheme,
        setThemeMode,
        setAccentColor,
        isLoading: isLoadingPrefs
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};