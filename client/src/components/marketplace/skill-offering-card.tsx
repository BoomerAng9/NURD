import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Clock, MessageCircle, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { SkillCategory, SkillExchange, SkillOffering } from '@shared/schema';
import { cn } from '@/lib/utils';

interface SkillOfferingCardProps {
  offering: SkillOffering & { 
    user: { 
      username: string;
      avatar_url?: string;
    };
    category?: SkillCategory;
  };
}

const SkillOfferingCard: React.FC<SkillOfferingCardProps> = ({ offering }) => {
  const { toast } = useToast();

  // Request this skill
  const requestMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/skill-exchanges`, {
        offerer_id: offering.user_id,
        offering_id: offering.id,
      });
      return await res.json();
    },
    onSuccess: (data: SkillExchange) => {
      toast({
        title: "Request sent!",
        description: "You've requested to learn this skill. The offerer will be notified.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/skill-exchanges'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send request",
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
          <Badge variant="outline" className={cn("font-normal", getSkillLevelColor(offering.skill_level))}>
            {offering.skill_level.charAt(0).toUpperCase() + offering.skill_level.slice(1)}
          </Badge>
          <Badge variant="outline" className="font-normal bg-amber-500/10 text-amber-500 border-amber-500/20">
            {offering.xp_reward || 5} XP
          </Badge>
        </div>
        <CardTitle className="text-xl mt-2 line-clamp-1">{offering.title}</CardTitle>
        <CardDescription className="flex items-center text-xs mt-1">
          <Clock className="h-3 w-3 mr-1" />
          {offering.time_commitment}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-3 h-[4.5em]">
          {offering.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={offering.user.avatar_url || ''} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {offering.user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{offering.user.username}</span>
        </div>
        <div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => requestMutation.mutate()}
            disabled={requestMutation.isPending}
            className="text-xs"
          >
            {requestMutation.isPending ? 'Sending...' : 'Request this skill'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SkillOfferingCard;