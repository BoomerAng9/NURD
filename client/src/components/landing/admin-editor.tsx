import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Edit, Image, Save, Trash2, Plus, 
  AlertCircle, CheckCircle, Settings 
} from 'lucide-react';
import { LandingContent } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SectionContent {
  id?: number;
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
}

interface AdminEditorProps {
  landingContent: LandingContent[];
  onSaveContent: (content: SectionContent) => void;
  onDeleteContent: (id: number) => void;
  onReorderContent?: (orderedIds: number[]) => void;
}

export function AdminLandingEditor({
  landingContent = [],
  onSaveContent,
  onDeleteContent,
  onReorderContent
}: AdminEditorProps) {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState<number | null>(null);
  const [newSectionMode, setNewSectionMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  
  const [editFormData, setEditFormData] = useState<SectionContent>({
    title: '',
    content: '',
    mediaUrl: '',
    mediaType: 'image'
  });
  
  const startEditing = (section: LandingContent) => {
    setEditFormData({
      id: section.id,
      title: section.title,
      content: section.content,
      mediaUrl: section.mediaUrl || '',
      mediaType: section.mediaType || 'image'
    });
    setEditMode(section.id);
    setNewSectionMode(false);
  };
  
  const startNewSection = () => {
    setEditFormData({
      title: '',
      content: '',
      mediaUrl: '',
      mediaType: 'image'
    });
    setNewSectionMode(true);
    setEditMode(null);
  };
  
  const cancelEditing = () => {
    setEditMode(null);
    setNewSectionMode(false);
  };
  
  const handleSave = () => {
    if (!editFormData.title.trim() || !editFormData.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a title and content for this section",
        variant: "destructive"
      });
      return;
    }
    
    onSaveContent(editFormData);
    
    toast({
      title: editMode ? "Section updated" : "Section created",
      description: editMode 
        ? "Your changes to this section have been saved" 
        : "New section has been added to the landing page",
    });
    
    setEditMode(null);
    setNewSectionMode(false);
  };
  
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this section? This action cannot be undone.")) {
      onDeleteContent(id);
      
      toast({
        title: "Section deleted",
        description: "The section has been removed from the landing page",
      });
    }
  };
  
  const handleDragStart = (id: number) => {
    setDraggedItem(id);
  };
  
  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    // Add visual indicator for drop area
  };
  
  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === targetId) return;
    
    // Create a new array with the reordered items
    const currentOrder = landingContent.map(item => item.id);
    const draggedIndex = currentOrder.indexOf(draggedItem);
    const targetIndex = currentOrder.indexOf(targetId);
    
    const newOrder = [...currentOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);
    
    onReorderContent?.(newOrder);
    setDraggedItem(null);
    
    toast({
      title: "Sections reordered",
      description: "The landing page sections have been rearranged",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Landing Page Editor</h2>
        <Button 
          onClick={startNewSection}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Section
        </Button>
      </div>
      
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="content">
            <Edit className="h-4 w-4 mr-2" />
            Content Editor
          </TabsTrigger>
          <TabsTrigger value="preview">
            <CheckCircle className="h-4 w-4 mr-2" />
            Preview Mode
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Page Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          {/* Editing Interface */}
          {(editMode !== null || newSectionMode) && (
            <Card className="mb-8 border-blue-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle>
                  {editMode !== null ? 'Edit Section' : 'Create New Section'}
                </CardTitle>
                <CardDescription>
                  Make changes to this landing page section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Section Title</label>
                  <Input 
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    placeholder="Enter section title"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Content</label>
                  <Textarea 
                    value={editFormData.content}
                    onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                    placeholder="Enter section content"
                    rows={5}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Basic HTML formatting is supported: &lt;b&gt;, &lt;i&gt;, &lt;a&gt;, &lt;ul&gt;, &lt;li&gt;
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Media URL (Optional)</label>
                  <Input 
                    value={editFormData.mediaUrl || ''}
                    onChange={(e) => setEditFormData({...editFormData, mediaUrl: e.target.value})}
                    placeholder="Enter image or video URL"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Media Type</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md"
                    value={editFormData.mediaType || 'image'}
                    onChange={(e) => setEditFormData({...editFormData, mediaType: e.target.value})}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="embed">Embed (iframe)</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-1" /> Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <div className="space-y-4">
            {landingContent.length === 0 ? (
              <Card className="border-dashed border-2 p-8">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-xl font-medium text-gray-600">No content sections</h3>
                  <p className="text-gray-500 mt-1 max-w-md mx-auto">
                    Add your first section to start building your landing page.
                  </p>
                  <Button 
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={startNewSection}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add First Section
                  </Button>
                </div>
              </Card>
            ) : (
              landingContent.map((section) => (
                <Card 
                  key={section.id}
                  className={`border ${draggedItem === section.id ? 'border-blue-500 opacity-50' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(section.id)}
                  onDragOver={(e) => handleDragOver(e, section.id)}
                  onDrop={(e) => handleDrop(e, section.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{section.title}</CardTitle>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => startEditing(section)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(section.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {section.content.length > 150 
                            ? `${section.content.substring(0, 150)}...` 
                            : section.content}
                        </p>
                      </div>
                      {section.mediaUrl && (
                        <div className="flex justify-center items-center bg-gray-100 rounded-md h-32 overflow-hidden">
                          {section.mediaType === 'image' ? (
                            <div className="relative h-full w-full">
                              <Image className="h-8 w-8 absolute inset-0 m-auto text-gray-400" />
                              <span className="absolute bottom-2 right-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                                {section.mediaUrl.substring(0, 20)}...
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full w-full">
                              <div className="text-gray-500 text-sm">
                                {section.mediaType} media
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Landing Page Preview</h1>
                  <p className="text-gray-500">This is how your landing page will appear to visitors</p>
                </div>
                
                {landingContent.map((section) => (
                  <div key={section.id} className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div>
                        <div dangerouslySetInnerHTML={{ __html: section.content }} />
                      </div>
                      {section.mediaUrl && (
                        <div className="bg-gray-100 rounded-lg overflow-hidden h-60 flex items-center justify-center">
                          {section.mediaType === 'image' ? (
                            <div className="relative h-full w-full flex items-center justify-center">
                              <Image className="h-12 w-12 text-gray-400" />
                              <p className="text-sm text-gray-500 mt-2">Image Preview</p>
                            </div>
                          ) : section.mediaType === 'video' ? (
                            <div className="text-center">
                              <p className="text-sm text-gray-500">Video Preview</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <p className="text-sm text-gray-500">Embedded Content</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {landingContent.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-xl font-medium text-gray-600">No content to preview</h3>
                    <p className="text-gray-500 mt-1 max-w-md mx-auto">
                      Add content sections to see a preview of your landing page.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Landing Page Settings</CardTitle>
              <CardDescription>
                Configure global settings for your landing page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Header Image</label>
                <Input 
                  placeholder="Enter URL for header background image"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Page Title</label>
                <Input 
                  placeholder="Enter page title (shown in browser tab)"
                  defaultValue="NURD Summer Initiative"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Meta Description</label>
                <Textarea 
                  placeholder="Enter page description for search engines"
                  defaultValue="Join the NURD Summer Initiative - Where creativity meets technology for students."
                />
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Email Address</label>
                    <Input 
                      placeholder="support@example.com"
                      defaultValue="nurds@achievemor.io"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Phone Number</label>
                    <Input 
                      placeholder="+1 (123) 456-7890"
                      defaultValue="(912) 742-9459"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Instagram</label>
                    <Input placeholder="https://instagram.com/yourpage" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Twitter</label>
                    <Input placeholder="https://twitter.com/yourpage" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-1" /> Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}