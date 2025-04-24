import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex items-center">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarImage src={user.profileImageUrl || ''} alt={user.username} />
          <AvatarFallback>
            {user.username?.slice(0, 2)?.toUpperCase() || 'NU'}
          </AvatarFallback>
        </Avatar>
        <CardTitle>{user.username}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {user.email && (
          <div className="text-sm">
            <span className="font-medium">Email:</span> {user.email}
          </div>
        )}
        {(user.first_name || user.last_name) && (
          <div className="text-sm">
            <span className="font-medium">Name:</span>{' '}
            {`${user.first_name || ''} ${user.last_name || ''}`.trim()}
          </div>
        )}
        {user.bio && (
          <div className="text-sm">
            <span className="font-medium">Bio:</span> {user.bio}
          </div>
        )}
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = '/api/logout'}
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};