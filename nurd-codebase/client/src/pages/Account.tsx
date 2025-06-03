import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/components/UserProfile';
import { Loader2 } from 'lucide-react';

export default function AccountPage() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Account Access</h1>
        <p className="text-center mb-6">
          Please log in to access your account information.
        </p>
        <a
          href="/api/login"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          Log In with Replit
        </a>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <UserProfile />
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Account Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-muted-foreground">Subscription</h3>
                <p>
                  {user.subscription_tier || 'No active subscription'}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-muted-foreground">Account Type</h3>
                <p>
                  {user.user_type || 'Standard User'}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-muted-foreground">Member Since</h3>
                <p>
                  {user.created_at 
                    ? new Date(user.created_at).toLocaleDateString() 
                    : 'Unknown'}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-muted-foreground">Last Login</h3>
                <p>
                  {user.last_login 
                    ? new Date(user.last_login).toLocaleDateString() 
                    : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}