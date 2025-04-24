import { ReactNode } from 'react';
import { Redirect, Route } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface PublicRouteProps {
  path: string;
  children: ReactNode;
  redirectIfAuthenticated?: boolean;
  redirectTo?: string;
}

export const PublicRoute = ({ 
  path, 
  children, 
  redirectIfAuthenticated = false,
  redirectTo = '/'
}: PublicRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (redirectIfAuthenticated && user) {
    return (
      <Route path={path}>
        <Redirect to={redirectTo} />
      </Route>
    );
  }

  return <Route path={path}>{children}</Route>;
};