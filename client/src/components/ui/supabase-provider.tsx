import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// This context will hold the Supabase client
interface SupabaseContextType {
  supabase: SupabaseClient;
  isSupabaseLoaded: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isSupabaseLoaded, setIsSupabaseLoaded] = useState(false);

  useEffect(() => {
    // Initialize Supabase client
    const supabaseUrl = 'https://pjfgckbjijkxirhutbuq.supabase.co';
    const supabaseKey = process.env.SUPABASE_KEY || '';
    
    if (!supabaseKey) {
      console.warn('Supabase key is not set. File uploads will not work.');
    }
    
    const client = createClient(supabaseUrl, supabaseKey);
    setSupabase(client);
    setIsSupabaseLoaded(true);
  }, []);

  // Value of the context provider
  const value = {
    supabase: supabase as SupabaseClient,
    isSupabaseLoaded,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

// Hook to use the Supabase context
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};