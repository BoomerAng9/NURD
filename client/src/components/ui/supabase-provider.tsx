import { createClient } from '@supabase/supabase-js';
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Supabase credentials
const supabaseUrl = 'https://pjfgckbjijkxirhutbuq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqZmdja2JqaWpreGlyaHV0YnVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NjI5MTcsImV4cCI6MjA2MDEzODkxN30.WMQTXVbmsjuGkM081bqDI-RtK-2RuO5VrgAa6GOAszg';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Create context
type SupabaseContextType = {
  supabase: typeof supabase;
  user: any | null;
};

const SupabaseContext = createContext<SupabaseContextType>({
  supabase,
  user: null,
});

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, user }}>
      {children}
    </SupabaseContext.Provider>
  );
};

// Custom hook to use the Supabase context
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
