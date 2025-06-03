import { Route, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export function AdminProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: React.ComponentType;
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

        // Only admin users can access admin routes
        if (!user || user.user_type !== 'admin') {
          // Redirect to homepage for non-admin users
          setTimeout(() => setLocation('/'), 100);
          return (
            <div className="flex flex-col items-center justify-center min-h-screen">
              <p className="text-xl text-destructive font-semibold mb-2">Admin Access Required</p>
              <p className="text-muted-foreground">You don't have permission to access this page.</p>
              <p className="text-muted-foreground">Redirecting to home page...</p>
            </div>
          );
        }

        return <Component />;
      }}
    />
  );
}