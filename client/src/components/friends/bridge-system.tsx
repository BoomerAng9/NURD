import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { NurdCard } from '@/components/profile/nurd-card';
import { UsersRound, Network, HomeIcon, PlusCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Friend {
  id: number;
  name: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'away';
  level: number;
  connectDate: string;
}

interface PendingFriendRequest {
  id: number;
  name: string;
  avatarUrl?: string;
  requestDate: string;
}

interface BridgeSystemProps {
  friends: Friend[];
  pendingRequests: PendingFriendRequest[];
  bridges: number;
  houses: number;
  onSendRequest?: (username: string) => void;
  onAcceptRequest?: (requestId: number) => void;
  onDeclineRequest?: (requestId: number) => void;
  onRemoveFriend?: (friendId: number) => void;
}

export function BridgeSystem({
  friends = [],
  pendingRequests = [],
  bridges = 0,
  houses = 0,
  onSendRequest,
  onAcceptRequest,
  onDeclineRequest,
  onRemoveFriend
}: BridgeSystemProps) {
  const { toast } = useToast();
  const [usernameInput, setUsernameInput] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  
  const MAX_BRIDGES_PER_HOUSE = 4;
  const currentHouses = Math.floor(bridges / MAX_BRIDGES_PER_HOUSE);
  const currentBridges = bridges % MAX_BRIDGES_PER_HOUSE;
  const totalProgress = (bridges / ((currentHouses + 1) * MAX_BRIDGES_PER_HOUSE)) * 100;
  
  const handleSendRequest = () => {
    if (!usernameInput.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to send a bridge request",
        variant: "destructive"
      });
      return;
    }
    
    onSendRequest?.(usernameInput);
    setUsernameInput('');
    
    toast({
      title: "Bridge request sent",
      description: `Your bridge request has been sent to ${usernameInput}`,
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Bridge Building Progress */}
      <Card className="border-2 border-cyan-500 bg-black text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-cyan-400 flex items-center gap-2">
            <Network className="h-5 w-5" /> 
            Bridge Building System
          </CardTitle>
          <CardDescription className="text-gray-400">
            Connect with other NURDs to build bridges and form houses in the community
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-gray-900 rounded-lg flex flex-col items-center">
              <UsersRound className="h-8 w-8 text-blue-400 mb-2" />
              <span className="text-2xl font-bold">{friends.length}</span>
              <span className="text-sm text-gray-400">Connected NURDs</span>
            </div>
            
            <div className="p-4 bg-gray-900 rounded-lg flex flex-col items-center">
              <Bridge className="h-8 w-8 text-purple-400 mb-2" />
              <span className="text-2xl font-bold">{bridges}</span>
              <span className="text-sm text-gray-400">Bridges Built</span>
            </div>
            
            <div className="p-4 bg-gray-900 rounded-lg flex flex-col items-center">
              <Home className="h-8 w-8 text-amber-400 mb-2" />
              <span className="text-2xl font-bold">{houses}</span>
              <span className="text-sm text-gray-400">Houses Established</span>
            </div>
          </div>
          
          {/* Progress Toward Next House */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Progress toward next house</span>
              <span className="text-sm">{currentBridges}/{MAX_BRIDGES_PER_HOUSE} bridges</span>
            </div>
            <Progress value={totalProgress} className="h-2.5" />
            
            <div className="mt-2 flex justify-between">
              {Array.from({ length: MAX_BRIDGES_PER_HOUSE }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    i < currentBridges ? 'border-purple-500 bg-purple-900 text-white' : 'border-gray-700 bg-gray-800 text-gray-500'
                  }`}
                >
                  <Bridge className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Houses Display */}
          {houses > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Your NURD Houses:</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: houses }).map((_, i) => (
                  <div key={i} className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Send Bridge Request */}
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Connect with a NURD:</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter username"
                className="flex-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
              />
              <Button 
                onClick={handleSendRequest} 
                className="bg-cyan-700 hover:bg-cyan-600"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Connect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card className="border-cyan-500 bg-black text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400">Pending Bridge Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingRequests.map(request => (
                <div key={request.id} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {request.avatarUrl ? (
                        <AvatarImage src={request.avatarUrl} />
                      ) : (
                        <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.name}</p>
                      <p className="text-xs text-gray-400">Requested: {request.requestDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-green-500 text-green-500 hover:bg-green-900 hover:text-green-400"
                      onClick={() => onAcceptRequest?.(request.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-500 text-red-500 hover:bg-red-900 hover:text-red-400"
                      onClick={() => onDeclineRequest?.(request.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Connected Friends */}
      <Card className="border-cyan-500 bg-black text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-cyan-400">Connected NURDs</CardTitle>
          <CardDescription className="text-gray-400">Your network of friends in the NURD community</CardDescription>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <UsersRound className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-gray-400">No connections yet</h3>
              <p className="text-sm text-gray-500 mt-1">
                Send bridge requests to connect with other NURDs and start building together!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends.map(friend => (
                <div 
                  key={friend.id} 
                  className="flex items-center justify-between bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800"
                  onClick={() => setSelectedFriend(friend)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {friend.avatarUrl ? (
                        <AvatarImage src={friend.avatarUrl} />
                      ) : (
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{friend.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={
                          friend.status === 'online' ? 'bg-green-500' : 
                          friend.status === 'away' ? 'bg-amber-500' : 'bg-gray-500'
                        }>
                          {friend.status}
                        </Badge>
                        <span className="text-xs text-gray-400">Level {friend.level}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Selected Friend Card Dialog */}
      {selectedFriend && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <NurdCard 
              level={selectedFriend.level}
              description={`Connected since ${selectedFriend.connectDate}`}
              techs={['TECH SAGE']}
              onConnect={() => {
                toast({
                  title: "Bridge reinforced",
                  description: "You've strengthened your connection with this NURD"
                });
                setSelectedFriend(null);
              }}
              onDraft={() => {
                onRemoveFriend?.(selectedFriend.id);
                toast({
                  variant: "destructive",
                  title: "Bridge disconnected",
                  description: "You've removed this NURD from your connections"
                });
                setSelectedFriend(null);
              }}
            />
            <div className="mt-4 flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => setSelectedFriend(null)}
                className="border-white text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}