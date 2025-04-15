import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface CanvaDesign {
  id: string;
  title: string;
  thumbnailUrl?: string;
  modifiedAt: string;
}

interface CanvaEditorProps {
  designId?: string;
}

// Canva Editor component that loads an embedded Canva editor
const CanvaEditor: React.FC<CanvaEditorProps> = ({ designId }) => {
  const [editorUrl, setEditorUrl] = useState<string>('');
  const { toast } = useToast();
  
  useEffect(() => {
    if (designId) {
      // Fetch the editor URL from our backend
      fetch(`/api/canva/editor-url?designId=${designId}`)
        .then(res => res.json())
        .then(data => {
          if (data.embedUrl) {
            setEditorUrl(data.embedUrl);
          }
        })
        .catch(err => {
          console.error('Error fetching Canva editor URL:', err);
          toast({
            title: 'Error',
            description: 'Failed to load Canva editor',
            variant: 'destructive'
          });
        });
    }
  }, [designId, toast]);
  
  if (!designId) {
    return (
      <div className="p-6 text-center">
        <p>Select a design to edit or create a new one.</p>
      </div>
    );
  }
  
  if (!editorUrl) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-primary">Loading editor...</div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <iframe 
        src={editorUrl}
        title="Canva Editor"
        width="100%"
        height="100%"
        allow="camera; microphone; clipboard-write"
        style={{ border: 'none' }}
      />
    </div>
  );
};

// Design Card component for displaying a Canva design
const DesignCard: React.FC<{ design: CanvaDesign; onSelect: (id: string) => void }> = ({ design, onSelect }) => {
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="p-4">
        <CardTitle className="text-lg truncate">{design.title}</CardTitle>
        <CardDescription>
          Modified: {new Date(design.modifiedAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {design.thumbnailUrl ? (
          <img 
            src={design.thumbnailUrl} 
            alt={design.title} 
            className="w-full h-32 object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
            No Preview
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => onSelect(design.id)}
        >
          Edit Design
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main Canva Integration component
export const CanvaIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('designs');
  const [selectedDesignId, setSelectedDesignId] = useState<string | undefined>();
  const [newDesignTitle, setNewDesignTitle] = useState('');
  const { toast } = useToast();

  // Query to fetch Canva designs
  const { 
    data: designs = [], 
    isLoading: isLoadingDesigns,
    isError: isDesignsError,
    refetch: refetchDesigns
  } = useQuery<CanvaDesign[]>({
    queryKey: ['/api/canva/designs'],
    enabled: activeTab === 'designs',
  });

  // Mutation to create a new design
  const createDesignMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await fetch('/api/canva/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create design');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'New design created successfully',
      });
      setNewDesignTitle('');
      queryClient.invalidateQueries({ queryKey: ['/api/canva/designs'] });
      
      // Select the newly created design
      if (data.id) {
        setSelectedDesignId(data.id);
        setActiveTab('editor');
      }
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create new design',
        variant: 'destructive',
      });
    },
  });

  // Handle design selection
  const handleSelectDesign = (designId: string) => {
    setSelectedDesignId(designId);
    setActiveTab('editor');
  };

  // Handle creating a new design
  const handleCreateDesign = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDesignTitle.trim()) {
      createDesignMutation.mutate(newDesignTitle);
    } else {
      toast({
        title: 'Error',
        description: 'Please enter a design title',
        variant: 'destructive',
      });
    }
  };

  // Handle authentication with Canva
  const handleAuthWithCanva = async () => {
    try {
      const response = await fetch('/api/canva/auth/init');
      const data = await response.json();
      
      if (data.authUrl) {
        // Open Canva OAuth flow in a new window
        window.open(data.authUrl, '_blank', 'width=800,height=600');
      }
    } catch (error) {
      console.error('Error initiating Canva auth:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect to Canva',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Canva Integration</h1>
        <p className="text-gray-500">Create and edit designs with Canva integration</p>
        
        <div className="mt-4">
          <Button onClick={handleAuthWithCanva} variant="outline" className="bg-primary/10">
            Connect with Canva
          </Button>
        </div>
      </header>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="designs">My Designs</TabsTrigger>
          <TabsTrigger value="editor">Design Editor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="designs" className="mt-6">
          <div className="mb-6">
            <form onSubmit={handleCreateDesign} className="flex items-end gap-4">
              <div className="flex-1">
                <label htmlFor="designTitle" className="block text-sm font-medium mb-1">
                  New Design Title
                </label>
                <Input
                  id="designTitle"
                  placeholder="Enter design title"
                  value={newDesignTitle}
                  onChange={(e) => setNewDesignTitle(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button 
                type="submit" 
                disabled={createDesignMutation.isPending || !newDesignTitle.trim()}
              >
                {createDesignMutation.isPending ? 'Creating...' : 'Create Design'}
              </Button>
            </form>
          </div>
          
          {isLoadingDesigns ? (
            <div className="py-8 text-center">
              <div className="animate-pulse text-primary">Loading designs...</div>
            </div>
          ) : isDesignsError ? (
            <div className="py-8 text-center">
              <p className="text-destructive mb-4">Failed to load designs</p>
              <Button onClick={() => refetchDesigns()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : designs?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {designs.map((design: CanvaDesign) => (
                <DesignCard 
                  key={design.id} 
                  design={design} 
                  onSelect={handleSelectDesign} 
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="mb-4">You don't have any designs yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first design using the form above
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="editor" className="mt-6">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Canva Editor</h2>
            <Button 
              variant="ghost" 
              onClick={() => setActiveTab('designs')}
              className="text-sm"
            >
              Back to Designs
            </Button>
          </div>
          
          <CanvaEditor designId={selectedDesignId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CanvaIntegration;