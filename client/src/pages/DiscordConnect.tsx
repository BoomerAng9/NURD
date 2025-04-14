import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSupabase } from '@/components/ui/supabase-provider';
import { Loader2, Check, X, AlertTriangle, Bot, Settings, Terminal, Server } from 'lucide-react';
import n8nApi, { AgentConfig } from '@/lib/n8n-integration';

const DiscordConnect: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isN8nConfigOpen, setIsN8nConfigOpen] = useState(false);
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);
  const [n8nApiKey, setN8nApiKey] = useState('');
  const [n8nApiUrl, setN8nApiUrl] = useState('');
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [discordUser, setDiscordUser] = useState<{
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
  } | null>(null);
  
  // State for agent creation
  const [newAgent, setNewAgent] = useState<Partial<AgentConfig>>({
    name: '',
    description: '',
    triggers: [],
    actions: [],
    isActive: true,
    discordIntegration: {
      channelId: '',
      enabled: false
    }
  });
  
  // Check if user is already connected to Discord
  useEffect(() => {
    const checkDiscordConnection = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        // In a real implementation, fetch Discord connection status
        // from backend or Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('discord_id, discord_username, discord_avatar')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data && data.discord_id) {
          setIsConnected(true);
          setDiscordUser({
            id: data.discord_id,
            username: data.discord_username,
            avatar: data.discord_avatar,
            discriminator: '#0000' // This would come from the Discord API
          });
        }
      } catch (error) {
        console.error('Error checking Discord connection:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkDiscordConnection();
  }, [user]);
  
  const handleConnectDiscord = () => {
    // For demonstration, we'll simulate the OAuth process
    // In a real implementation, you would redirect to Discord OAuth URL
    
    setIsLoading(true);
    toast({
      title: "Connecting to Discord...",
      description: "You'll be redirected to Discord for authorization.",
    });
    
    // Simulate OAuth process
    setTimeout(() => {
      // This would actually redirect to Discord:
      // window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20email%20guilds.join`;
      
      // For demo, we'll just simulate a successful connection
      const mockDiscordUser = {
        id: '123456789012345678',
        username: 'nurd_student',
        avatar: 'https://cdn.discordapp.com/avatars/123456789012345678/abcdef1234567890.png',
        discriminator: '#1234'
      };
      
      setDiscordUser(mockDiscordUser);
      setIsConnected(true);
      setIsLoading(false);
      
      toast({
        title: "Discord Connected!",
        description: "Your Discord account has been successfully linked.",
      });
    }, 2000);
  };
  
  const handleDisconnectDiscord = () => {
    setIsLoading(true);
    
    // In a real implementation, you would make an API call to disconnect
    // the Discord account
    
    setTimeout(() => {
      setDiscordUser(null);
      setIsConnected(false);
      setIsLoading(false);
      
      toast({
        title: "Discord Disconnected",
        description: "Your Discord account has been unlinked.",
      });
    }, 1500);
  };
  
  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user && !isLoading) {
      toast({
        title: "Authentication Required",
        description: "Please log in to connect your Discord account.",
        variant: "destructive",
      });
      
      const timer = setTimeout(() => {
        setLocation('/auth');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, setLocation, toast]);
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-20">
          <Card className="w-[380px]">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please log in to connect your Discord account.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setLocation('/')}>
                Go Home
              </Button>
              <Button onClick={() => setLocation('/auth')}>
                Login
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold font-heading text-gray-900 mb-4">
                Discord Connection
              </h1>
              <p className="text-xl text-gray-600">
                Connect your Discord account to join the NURD community server and access exclusive channels.
              </p>
            </div>
            
            <Card className="overflow-hidden border-2 border-indigo-100">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2" />
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Discord Integration</CardTitle>
                    <CardDescription>
                      Enhance your learning experience with Discord connectivity.
                    </CardDescription>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <img 
                      src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" 
                      alt="Discord Logo" 
                      className="h-10 w-auto"
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2 text-indigo-900">Benefits of Connecting</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Automatic access to the NURD community Discord server</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Access to private channels based on your enrolled courses</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Receive notifications about events, workshops, and activities</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Connect with other NURD students and trainers</span>
                      </li>
                    </ul>
                  </div>
                  
                  {isConnected && discordUser ? (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="relative mr-4">
                          {discordUser.avatar ? (
                            <img 
                              src={discordUser.avatar} 
                              alt="Discord Avatar" 
                              className="h-16 w-16 rounded-full"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-xl font-bold text-indigo-700">
                                {discordUser.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          
                          <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-white" />
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-lg">
                            {discordUser.username}
                            <span className="text-gray-500 text-sm ml-1">
                              {discordUser.discriminator}
                            </span>
                          </h3>
                          <p className="text-green-600 text-sm font-medium flex items-center">
                            <Check className="h-4 w-4 mr-1" />
                            Connected
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            Your Discord account is linked to your NURD profile.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-lg p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                          <img 
                            src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" 
                            alt="Discord Logo" 
                            className="h-10 w-auto opacity-70"
                          />
                        </div>
                      </div>
                      <h3 className="font-medium text-lg mb-2">Not Connected</h3>
                      <p className="text-gray-600 mb-4">
                        Connect your Discord account to join our community server and access exclusive content.
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-yellow-50 p-4 rounded-lg flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Important Note</h4>
                      <p className="text-yellow-700 text-sm">
                        By connecting your Discord account, you'll be automatically added to the NURD Discord server. 
                        Our community guidelines and code of conduct apply to all interactions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t bg-gray-50 px-6 py-4">
                {isConnected ? (
                  <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto"
                      onClick={handleDisconnectDiscord}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      Disconnect Discord
                    </Button>
                    
                    <Link href="/dashboard">
                      <div className="btn-nurd w-full sm:w-auto text-center cursor-pointer">
                        Return to Dashboard
                      </div>
                    </Link>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleConnectDiscord}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 127.14 96.36"
                        className="h-5 w-5 mr-2 fill-current"
                      >
                        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                      </svg>
                    )}
                    Connect with Discord
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {isConnected && (
              <Card className="mt-8 overflow-hidden border-2 border-gray-100">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2" />
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        n8n Agent Builder
                      </CardTitle>
                      <CardDescription>
                        Configure automated agents to help manage Discord interactions
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="configure" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="configure">
                        <Settings className="h-4 w-4 mr-2" />
                        API Configuration
                      </TabsTrigger>
                      <TabsTrigger value="create">
                        <Bot className="h-4 w-4 mr-2" />
                        Create Agent
                      </TabsTrigger>
                      <TabsTrigger value="manage">
                        <Server className="h-4 w-4 mr-2" />
                        Manage Agents
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="configure">
                      <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-medium text-lg mb-2 text-blue-900">
                            Connect n8n for Advanced Integration
                          </h3>
                          <p className="text-blue-800 text-sm mb-3">
                            Provide your n8n API details to enable advanced automation and agent building.
                          </p>
                          
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="apiUrl">n8n API URL</Label>
                              <Input
                                id="apiUrl"
                                placeholder="https://your-n8n-instance.com/api/v1"
                                value={n8nApiUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setN8nApiUrl(e.target.value)}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                The full URL to your n8n API endpoint
                              </p>
                            </div>
                            
                            <div>
                              <Label htmlFor="apiKey">n8n API Key</Label>
                              <Input
                                id="apiKey"
                                type="password"
                                placeholder="Your n8n API Key"
                                value={n8nApiKey}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setN8nApiKey(e.target.value)}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                The API key to authenticate with your n8n instance
                              </p>
                            </div>
                            
                            <Button
                              onClick={() => {
                                // Configure the n8n API
                                n8nApi.setApiKey(n8nApiKey);
                                
                                // Store the API URL
                                (n8nApi as any).apiUrl = n8nApiUrl;
                                
                                toast({
                                  title: "n8n API Configured",
                                  description: "Your n8n API connection has been configured successfully.",
                                });
                              }}
                            >
                              Save Configuration
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="create">
                      <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium text-lg mb-4">Create a Discord Agent</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="agentName">Agent Name</Label>
                              <Input
                                id="agentName"
                                placeholder="NURD Bot Assistant"
                                value={newAgent.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAgent({...newAgent, name: e.target.value})}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="agentDesc">Description</Label>
                              <Textarea
                                id="agentDesc"
                                placeholder="This agent helps manage the NURD Discord server..."
                                value={newAgent.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewAgent({...newAgent, description: e.target.value})}
                                className="min-h-[100px] resize-none"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="channelId">Discord Channel ID</Label>
                              <Input
                                id="channelId"
                                placeholder="123456789012345678"
                                value={selectedChannelId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  setSelectedChannelId(e.target.value);
                                  setNewAgent({
                                    ...newAgent, 
                                    discordIntegration: {
                                      ...newAgent.discordIntegration as any,
                                      channelId: e.target.value,
                                      enabled: !!e.target.value
                                    }
                                  });
                                }}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                The Discord channel ID where this agent will operate
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Agent Triggers</Label>
                              <div className="grid grid-cols-2 gap-2">
                                {['message', 'reaction', 'join', 'scheduled'].map((trigger) => (
                                  <div key={trigger} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={`trigger-${trigger}`}
                                      checked={(newAgent.triggers || []).includes(trigger)}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.checked) {
                                          setNewAgent({
                                            ...newAgent,
                                            triggers: [...(newAgent.triggers || []), trigger]
                                          });
                                        } else {
                                          setNewAgent({
                                            ...newAgent,
                                            triggers: (newAgent.triggers || []).filter(t => t !== trigger)
                                          });
                                        }
                                      }}
                                      className="rounded border-gray-300"
                                    />
                                    <Label htmlFor={`trigger-${trigger}`} className="cursor-pointer text-sm">
                                      {trigger.charAt(0).toUpperCase() + trigger.slice(1)}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Agent Actions</Label>
                              <div className="grid grid-cols-2 gap-2">
                                {['send-message', 'dm-user', 'add-role', 'create-event'].map((action) => (
                                  <div key={action} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={`action-${action}`}
                                      checked={(newAgent.actions || []).includes(action)}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.checked) {
                                          setNewAgent({
                                            ...newAgent,
                                            actions: [...(newAgent.actions || []), action]
                                          });
                                        } else {
                                          setNewAgent({
                                            ...newAgent,
                                            actions: (newAgent.actions || []).filter(a => a !== action)
                                          });
                                        }
                                      }}
                                      className="rounded border-gray-300"
                                    />
                                    <Label htmlFor={`action-${action}`} className="cursor-pointer text-sm">
                                      {action.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <Button
                              className="w-full"
                              onClick={async () => {
                                try {
                                  setIsLoading(true);
                                  
                                  // Create the agent
                                  await n8nApi.createAgent(newAgent as AgentConfig);
                                  
                                  // Reset form and show success message
                                  setNewAgent({
                                    name: '',
                                    description: '',
                                    triggers: [],
                                    actions: [],
                                    isActive: true,
                                    discordIntegration: {
                                      channelId: '',
                                      enabled: false
                                    }
                                  });
                                  
                                  setSelectedChannelId('');
                                  
                                  toast({
                                    title: "Agent Created",
                                    description: "Your Discord agent has been created successfully!",
                                  });
                                  
                                } catch (error) {
                                  console.error("Error creating agent:", error);
                                  toast({
                                    title: "Agent Creation Failed",
                                    description: error instanceof Error ? error.message : "Failed to create the agent.",
                                    variant: "destructive",
                                  });
                                } finally {
                                  setIsLoading(false);
                                }
                              }}
                              disabled={isLoading || !newAgent.name || !selectedChannelId || (newAgent.triggers || []).length === 0}
                            >
                              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Bot className="h-4 w-4 mr-2" />}
                              Create Discord Agent
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="manage">
                      <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium text-lg mb-4">Manage Discord Agents</h3>
                          
                          <div className="text-center py-8">
                            <Server className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h4 className="font-medium text-lg">No Agents Found</h4>
                            <p className="text-gray-600 mt-2 mb-4">
                              You haven't created any Discord agents yet. Create your first agent to get started.
                            </p>
                            <Button onClick={() => {}}>
                              <Bot className="h-4 w-4 mr-2" />
                              Create Your First Agent
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Need help with Discord integration? Check out our 
                <Link href="/help">
                  <span className="text-purple-600 hover:text-purple-700 cursor-pointer mx-1">
                    help center
                  </span>
                </Link>
                or 
                <Link href="/contact">
                  <span className="text-purple-600 hover:text-purple-700 cursor-pointer ml-1">
                    contact our support team
                  </span>
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DiscordConnect;