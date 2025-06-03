import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

// Define a mock user type for compatibility
type User = {
  id: string;
  email?: string;
  first_name?: string;
  role?: string;
  user_metadata?: {
    is_admin?: boolean;
    is_freelancer?: boolean;
  }
};

// Create a mock auth context
interface AuthContextType {
  user: User | null;
  supabase: any; // This is just a placeholder to maintain compatibility
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const SupabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // In a real implementation, we would fetch from our API
  // Here we're just using a local state
  useEffect(() => {
    // Simulate already logged in for demo purposes
    setUser({
      id: '1',
      email: 'admin@nurd.com',
      first_name: 'Admin',
      role: 'admin',
      user_metadata: {
        is_admin: true,
        is_freelancer: false
      }
    });
  }, []);
  
  // We've removed the userData dependency and now use the direct initialization above
  
  // Mock sign-in function
  const signIn = async (email: string, password: string) => {
    // In a real implementation, we would call our API
    console.log('Signing in with:', email, password);
    
    // Simulate a successful sign-in
    setUser({
      id: '1',
      email: email,
      first_name: 'Demo',
      role: email.includes('admin') ? 'admin' : 'user',
      user_metadata: {
        is_admin: email.includes('admin'),
        is_freelancer: email.includes('freelancer')
      }
    });
  };
  
  // Mock sign-out function
  const signOut = async () => {
    // In a real implementation, we would call our API
    setUser(null);
  };
  
  // Create a mock supabase object with common methods
  const mockSupabase = {
    auth: {
      signOut: signOut,
      signInWithPassword: async ({ email, password }: { email: string, password: string }) => {
        await signIn(email, password);
        return { data: { user }, error: null };
      }
    },
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      }),
      insert: (data: any) => Promise.resolve({ data: null, error: null })
    })
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      supabase: mockSupabase,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useSupabase = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};