import React, { useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/components/ui/supabase-provider';
import { Loader2 } from 'lucide-react';

// Define the roles that can access specific routes
export type UserRole = 'admin' | 'freelancer' | 'student' | 'parent';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  allowedRoles,
  fallbackPath = '/auth'
}) => {
  const { user, supabase } = useSupabase();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [userRole, setUserRole] = React.useState<UserRole | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      setIsLoading(true);
      
      if (!user) {
        setIsLoading(false);
        toast({
          title: 'Authentication required',
          description: 'Please log in to access this page',
          variant: 'destructive',
        });
        setLocation(fallbackPath);
        return;
      }

      try {
        // In a real application, we would fetch the user's role from the database
        // For now, we'll check if the user is an admin based on their email
        // This is just a placeholder implementation
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          // If no role is found, default to student role (or check user metadata)
          // In a real app, you would implement proper role management
          const isAdmin = user.email?.includes('admin');
          const isFreelancer = user.user_metadata?.is_freelancer === true;
          
          const role = isAdmin ? 'admin' : isFreelancer ? 'freelancer' : 'student';
          setUserRole(role as UserRole);
        } else {
          setUserRole(data.role as UserRole);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        // Default role if there's an error
        setUserRole('student');
      }
      
      setIsLoading(false);
    };

    checkUserRole();
  }, [user, toast, setLocation, fallbackPath, supabase]);

  useEffect(() => {
    if (!isLoading && userRole && !allowedRoles.includes(userRole)) {
      toast({
        title: 'Access denied',
        description: 'You do not have permission to access this page',
        variant: 'destructive',
      });
      setLocation('/dashboard');
    }
  }, [isLoading, userRole, allowedRoles, toast, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (userRole && !allowedRoles.includes(userRole))) {
    return null;
  }

  return <>{children}</>;
};

// A quick utility function to check if user is an admin
// This could be used in components where you need to conditionally render admin features
export const useIsAdmin = () => {
  const { user } = useSupabase();
  const [isAdmin, setIsAdmin] = React.useState(false);

  useEffect(() => {
    // Check if user is admin (this is a simplified check)
    // In a real app, you would check a roles table or user metadata
    if (user && user.email?.includes('admin')) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return isAdmin;
};

// A utility to check if user is a freelancer
export const useIsFreelancer = () => {
  const { user } = useSupabase();
  const [isFreelancer, setIsFreelancer] = React.useState(false);

  useEffect(() => {
    // Check if user is a freelancer
    // In a real app, this would check a proper roles table
    if (user && user.user_metadata?.is_freelancer === true) {
      setIsFreelancer(true);
    } else {
      setIsFreelancer(false);
    }
  }, [user]);

  return isFreelancer;
};

export default AuthGuard;