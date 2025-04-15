import React from 'react';
import { 
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui';
import { Clock, MessageCircle, Star, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { SkillCategory, SkillExchange, SkillRequest } from '@shared/schema';
import { cn } from '@/lib/utils';

interface SkillRequestCardProps {
  request: SkillRequest & { 
    user: { 
      username: string;
      avatar_url?: string;
    };
    category?: SkillCategory;
  };
}

const SkillRequestCard: React.FC<SkillRequestCardProps> = ({ request }) => {
  const { toast } = useToast();

  // Offer to teach this skill
  const offerMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/skill-exchanges`, {
        requester_id: request.user_id,
        request_id: request.id,
      });
      return await res.json();
    },
    onSuccess: (data: SkillExchange) => {
      toast({
        title: "Offer sent!",
        description: "You've offered to teach this skill. The requester will be notified.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/skill-exchanges'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send offer",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'intermediate':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'advanced':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <Card className="overflow-hidden border border-border/40 bg-card/50 backdrop-blur hover:bg-card/70 transition-colors">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={cn("font-normal", getSkillLevelColor(request.desired_skill_level))}>
            {request.desired_skill_level.charAt(0).toUpperCase() + request.desired_skill_level.slice(1)}
          </Badge>
          <Badge variant="outline" className="font-normal bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
            Requested
          </Badge>
        </div>
        <CardTitle className="text-xl mt-2 line-clamp-1">{request.title}</CardTitle>
        <CardDescription className="flex items-center text-xs mt-1">
          <Calendar className="h-3 w-3 mr-1" />
          {request.time_availability}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-3 h-[4.5em]">
          {request.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={request.user.avatar_url || ''} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {request.user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{request.user.username}</span>
        </div>
        <div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => offerMutation.mutate()}
            disabled={offerMutation.isPending}
            className="text-xs"
          >
            {offerMutation.isPending ? 'Sending...' : 'Offer to teach'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SkillRequestCard;