import { ReactNode } from 'react';
import { Redirect, Route } from 'wouter';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  path: string;
  children: ReactNode;
}

// Note: Replit Auth has been removed
// This now uses the standard authentication system
export const ProtectedRoute = ({ path, children }: ProtectedRouteProps) => {
  // For now, we'll just define a placeholder component
  // This should be replaced with actual authentication logic later
  
  // No authentication required - temporarily allow all access
  return <Route path={path}>{children}</Route>;
};