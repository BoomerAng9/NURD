import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, Link, Copy, MessageSquare, Send, UserPlus, Check, ExternalLink, Globe
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  createSession, 
  joinSession, 
  leaveSession, 
  updateSessionCode,
  getSession,
  generateShareableLink,
  SessionData
} from '@/services/collaboration-service';

// Generate a unique ID for the user if not already present
function getUserId(): string {
  let userId = localStorage.getItem('vibe-user-id');
  
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('vibe-user-id', userId);
  }
  
  return userId;
}

// Get or set username
function getUserName(): string {
  let userName = localStorage.getItem('vibe-user-name');
  
  if (!userName) {
    // Generate a friendly default name
    const adjectives = ['Happy', 'Clever', 'Bright', 'Curious', 'Creative'];
    const nouns = ['Coder', 'Maker', 'Creator', 'Builder', 'Inventor'];
    
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
    userName = `${randomAdj}${randomNoun}`;
    localStorage.setItem('vibe-user-name', userName);
  }
  
  return userName;
}

interface CollaborationPanelProps {
  code: string;
  onCodeChange: (newCode: string) => void;
}

export default function CollaborationPanel({ code, onCodeChange }: CollaborationPanelProps) {
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [shareableLink, setShareableLink] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [userName, setUserName] = useState(getUserName());
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    userId: string;
    userName: string;
    message: string;
    timestamp: string;
  }>>([]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [sessionIdToJoin, setSessionIdToJoin] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [sessionParticipants, setSessionParticipants] = useState<Array<{
    id: string;
    name: string;
    isActive: boolean;
    lastActive: string;
  }>>([]);

  // Check URL for session parameter on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionParam = params.get('session');
    
    if (sessionParam) {
      setSessionIdToJoin(sessionParam);
      setShowJoinDialog(true);
    }
  }, []);
  
  // Handle code updates
  useEffect(() => {
    if (isCollaborating && sessionData) {
      // Update session code
      updateSessionCode(sessionData.id, getUserId(), code);
    }
  }, [code, isCollaborating, sessionData]);
  
  // Refresh session data periodically
  useEffect(() => {
    if (isCollaborating && sessionData) {
      const interval = setInterval(async () => {
        const refreshedSession = await getSession(sessionData.id);
        
        if (refreshedSession) {
          setSessionData(refreshedSession);
          setSessionParticipants(refreshedSession.participants);
          
          // If code has changed and we're not the initiator, update local code
          if (refreshedSession.code !== code) {
            onCodeChange(refreshedSession.code);
          }
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [code, isCollaborating, sessionData, onCodeChange]);

  // Create a new session
  const handleCreateSession = async () => {
    const userId = getUserId();
    
    try {
      const session = await createSession({
        userId,
        userName,
        initialCode: code
      });
      
      setSessionData(session);
      setIsCollaborating(true);
      setIsHost(true);
      setShareableLink(generateShareableLink(session.id));
      setSessionParticipants(session.participants);
      
      toast({
        title: "Collaboration session created",
        description: "Share the link to invite others to code with you!",
      });
      
      setShowInviteDialog(true);
    } catch (error) {
      console.error('Failed to create session:', error);
      toast({
        title: "Failed to create session",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  // Join an existing session
  const handleJoinSession = async () => {
    if (!sessionIdToJoin) {
      toast({
        title: "Session ID required",
        description: "Please enter a valid session ID",
        variant: "destructive",
      });
      return;
    }
    
    const userId = getUserId();
    
    try {
      const session = await joinSession({
        sessionId: sessionIdToJoin,
        userId,
        userName
      });
      
      if (!session) {
        toast({
          title: "Session not found",
          description: "The session may have expired or been deleted",
          variant: "destructive",
        });
        return;
      }
      
      setSessionData(session);
      setIsCollaborating(true);
      setIsHost(session.hostId === userId);
      setShareableLink(generateShareableLink(session.id));
      setSessionParticipants(session.participants);
      
      // Update local code with session code
      onCodeChange(session.code);
      
      toast({
        title: "Joined collaboration session",
        description: `You are now coding with ${session.hostName}`,
      });
      
      setShowJoinDialog(false);
    } catch (error) {
      console.error('Failed to join session:', error);
      toast({
        title: "Failed to join session",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  // Leave the current session
  const handleLeaveSession = async () => {
    if (!sessionData) return;
    
    try {
      await leaveSession(sessionData.id, getUserId());
      
      setIsCollaborating(false);
      setSessionData(null);
      setIsHost(false);
      setShareableLink('');
      setSessionParticipants([]);
      
      toast({
        title: "Left collaboration session",
        description: "You're now back in solo mode",
      });
    } catch (error) {
      console.error('Failed to leave session:', error);
    }
  };
  
  // Copy shareable link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setLinkCopied(true);
    
    toast({
      title: "Link copied!",
      description: "Share it with friends to code together",
    });
    
    setTimeout(() => setLinkCopied(false), 2000);
  };
  
  // Send a chat message
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    // In a real app, this would be sent to the server
    const newMessage = {
      userId: getUserId(),
      userName,
      message: chatMessage,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');
  };
  
  // Update username
  const handleUpdateUserName = (newName: string) => {
    if (!newName.trim()) return;
    
    setUserName(newName);
    localStorage.setItem('vibe-user-name', newName);
    
    toast({
      title: "Name updated",
      description: `You'll appear as ${newName} in collaborative sessions`,
    });
  };

  return (
    <div className="mb-4">
      {!isCollaborating ? (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={() => setShowInviteDialog(true)}
            variant="outline"
            className="flex items-center gap-2 border-blue-500/30 text-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
          >
            <UserPlus className="h-4 w-4" />
            Create Session
          </Button>
          
          <Button 
            onClick={() => setShowJoinDialog(true)}
            variant="outline"
            className="flex items-center gap-2 border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-400"
          >
            <Users className="h-4 w-4" />
            Join Session
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div>
              <h3 className="text-sm font-medium text-blue-400 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Live Collaboration Session
              </h3>
              <p className="text-xs text-blue-300/70 mt-1">
                {isHost ? 'You are hosting this session' : `You are collaborating with ${sessionData?.hostName}`}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-blue-500/30 text-blue-500 hover:bg-blue-500/10 hover:text-blue-400 h-8 text-xs"
                onClick={() => setShowInviteDialog(true)}
              >
                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                Invite
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 h-8 text-xs"
                onClick={handleLeaveSession}
              >
                Leave Session
              </Button>
            </div>
          </div>
          
          {/* Participant list */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Participants</h4>
            <div className="flex flex-wrap gap-2">
              {sessionParticipants.map(participant => (
                <Badge 
                  key={participant.id} 
                  variant="outline"
                  className={`flex items-center gap-1.5 ${
                    participant.isActive 
                      ? 'border-green-500/30 text-green-400' 
                      : 'border-gray-500/30 text-gray-400'
                  }`}
                >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[10px] bg-primary/10">
                      {participant.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {participant.name}
                  {participant.isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Simple chat UI - could be expanded in a real implementation */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm border-muted">
            <div className="flex flex-col p-3 h-32 overflow-y-auto">
              {chatMessages.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center my-auto">
                  Chat messages will appear here
                </p>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={idx} className="mb-2">
                    <p className="text-xs">
                      <span className="font-medium">{msg.userName}: </span>
                      <span className="text-muted-foreground">{msg.message}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center p-2 border-t border-muted">
              <Input
                className="text-xs"
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSendMessage}
                className="ml-2"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Session Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Collaboration Session</DialogTitle>
            <DialogDescription>
              Create a new session and invite friends to code together in real-time.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Your Display Name</label>
              <Input
                value={userName}
                onChange={(e) => handleUpdateUserName(e.target.value)}
                placeholder="Enter your display name"
              />
              <p className="text-xs text-muted-foreground">
                This is how other participants will see you.
              </p>
            </div>
            
            {!isCollaborating ? (
              <Button 
                className="w-full" 
                onClick={handleCreateSession}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create New Session
              </Button>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Shareable Link</label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={shareableLink} 
                    readOnly 
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={handleCopyLink}
                  >
                    {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Send this link to friends so they can join your coding session.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowInviteDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Join Session Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join Collaboration Session</DialogTitle>
            <DialogDescription>
              Enter a session ID or paste a shared link to join.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Your Display Name</label>
              <Input
                value={userName}
                onChange={(e) => handleUpdateUserName(e.target.value)}
                placeholder="Enter your display name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Session ID or URL</label>
              <Input
                value={sessionIdToJoin}
                onChange={(e) => {
                  const input = e.target.value;
                  // Extract session ID if it's a URL
                  if (input.includes('session=')) {
                    const match = input.match(/session=([^&]+)/);
                    if (match && match[1]) {
                      setSessionIdToJoin(match[1]);
                    } else {
                      setSessionIdToJoin(input);
                    }
                  } else {
                    setSessionIdToJoin(input);
                  }
                }}
                placeholder="Enter session ID or paste URL"
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowJoinDialog(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={handleJoinSession}>
              <Users className="mr-2 h-4 w-4" />
              Join Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}