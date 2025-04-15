import { Route, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({
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

        if (!user) {
          // Redirect to auth page
          setTimeout(() => setLocation('/auth'), 100);
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