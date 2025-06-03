import { Route, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({
  path,
  component: Component,
  requireAuth = false,
}: {
  path: string;
  component: React.ComponentType;
  requireAuth?: boolean;
}) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <Route
      path={path}
      component={() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }

        // Only check authentication if requireAuth is true
        if (requireAuth && !user) {
          // Redirect to auth page
          setLocation('/auth');
          return (
            <div className="flex items-center justify-center min-h-screen">
              <p className="text-muted-foreground">Redirecting to login...</p>
            </div>
          );
        }

        return <Component />;
      }}
    />
  );
}