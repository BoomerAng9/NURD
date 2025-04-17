import { type ColorScheme } from "@/providers/color-scheme-provider";
import { type UserPreferences } from "@/providers/user-preferences-provider";

// Apply user preferences to the document
export const applyUserPreferences = (preferences: UserPreferences) => {
  // Apply color scheme (handled by ColorSchemeProvider but can be extended here)
  
  // Apply font size
  document.documentElement.style.setProperty(
    '--user-font-size', 
    preferences.fontSize === 'small' 
      ? '0.875rem' 
      : preferences.fontSize === 'medium' 
        ? '1rem' 
        : '1.125rem'
  );
  
  // Apply high contrast if enabled
  if (preferences.highContrast) {
    document.documentElement.classList.add('high-contrast');
  } else {
    document.documentElement.classList.remove('high-contrast');
  }
  
  // Apply reduced motion if enabled
  if (preferences.reducedMotion) {
    document.documentElement.classList.add('reduced-motion');
  } else {
    document.documentElement.classList.remove('reduced-motion');
  }
};

// Get CSS variables for a given color scheme
export const getColorSchemeCSS = (colorScheme: ColorScheme): { primary: string; accent: string } => {
  const schemes = {
    default: { primary: '#3760ff', accent: '#6638e8' },
    ocean: { primary: '#0891b2', accent: '#2563eb' },
    forest: { primary: '#16a34a', accent: '#059669' },
    sunset: { primary: '#ea580c', accent: '#dc2626' },
    space: { primary: '#7c3aed', accent: '#4f46e5' },
  };
  
  return schemes[colorScheme] || schemes.default;
};

// Auto-detect system preferences
export const detectSystemPreferences = (): Partial<UserPreferences> => {
  const preferences: Partial<UserPreferences> = {};
  
  // Detect preferred color scheme
  // We don't auto-set the color scheme here, just detect the preference
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Detect reduced motion preference
  preferences.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Detect contrast preference (if supported)
  preferences.highContrast = window.matchMedia('(prefers-contrast: more)').matches;
  
  return preferences;
};