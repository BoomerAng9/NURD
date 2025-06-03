import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Trash2, PencilLine, ExternalLink, FilePlus, Upload } from 'lucide-react';
import { useIsAdmin } from '@/lib/auth-guard';
import { LandingContent } from '@shared/schema';

// Form schema for adding/editing landing content
const landingContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  mediaType: z.enum(['image', 'video', 'document', '']).optional(),
  documentTitle: z.string().optional(),
  documentDescription: z.string().optional(),
  actionUrl: z.string().optional(),
  actionText: z.string().optional(),
  displayOrder: z.number().default(0),
});

type LandingContentForm = z.infer<typeof landingContentSchema>;

interface AdminLandingEditorProps {
  landingContent: LandingContent[];
  onSaveContent: (content: any) => void;
  onDeleteContent: (id: number) => void;
  onReorderContent: (ids: number[]) => void;
}

export function AdminLandingEditor({
  landingContent = [],
  onSaveContent,
  onDeleteContent,
  onReorderContent
}: AdminLandingEditorProps) {
  const isAdmin = useIsAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<LandingContent | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Use the provided landingContent instead of fetching it
  const isLoading = false;

  // Form setup
  const form = useForm<LandingContentForm>({
    resolver: zodResolver(landingContentSchema),
    defaultValues: {
      title: '',
      content: '',
      mediaType: '',
      documentTitle: '',
      documentDescription: '',
      actionUrl: '',
      actionText: '',
      displayOrder: 0,
    },
  });

  // Using passed functions for adding/updating/deleting content instead of local mutations

  // Handle file uploads for documents/images/videos
  const handleFileUpload = async (file: File) => {
    if (!file) return null;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload to server
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });
      
      // Create a promise to handle the XHR request
      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response.url);
            } catch (e) {
              reject(new Error('Invalid response from server'));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.ontimeout = () => reject(new Error('Upload timed out'));
      });
      
      // Start the upload
      xhr.open('POST', '/api/upload', true);
      xhr.send(formData);
      
      // Wait for upload to complete
      const fileUrl = await uploadPromise;
      
      toast({
        title: 'Upload successful',
        description: 'File has been uploaded successfully',
      });
      
      return fileUrl;
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'An unknown error occurred',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleOpenDialog = (content?: LandingContent) => {
    if (content) {
      setEditingContent(content);
      form.reset({
        title: content.title,
        content: content.content,
        mediaType: content.mediaType as any || '',
        documentTitle: content.documentTitle || '',
        documentDescription: content.documentDescription || '',
        actionUrl: content.actionUrl || '',
        actionText: content.actionText || '',
        displayOrder: content.displayOrder || 0,
      });
    } else {
      setEditingContent(null);
      form.reset({
        title: '',
        content: '',
        mediaType: '',
        documentTitle: '',
        documentDescription: '',
        actionUrl: '',
        actionText: '',
        displayOrder: landingContent ? landingContent.length : 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingContent(null);
    form.reset();
  };

  const handleDeleteContent = (id: number) => {
    if (confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      onDeleteContent(id);
    }
  };

  const onSubmit = async (data: LandingContentForm) => {
    // Check if we need to handle a file upload
    const fileInput = fileInputRef.current;
    let mediaUrl = editingContent?.mediaUrl || undefined;
    
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const uploadedUrl = await handleFileUpload(fileInput.files[0]);
      if (uploadedUrl) {
        mediaUrl = uploadedUrl;
      }
    }

    // Prepare the data for submission
    const contentData = {
      ...data,
      id: editingContent?.id,
      mediaUrl,
    };

    // Submit the data using the passed function
    onSaveContent(contentData);
    handleCloseDialog();
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-600">You need administrator privileges to manage landing page content.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Landing Page Content Manager</h1>
          <p className="text-gray-600">Manage the content sections that appear on the landing page</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <Plus size={16} />
          Add New Section
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : landingContent && landingContent.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingContent.map((content) => (
            <Card key={content.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{content.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {content.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                {content.mediaType && (
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">Media Type:</div>
                    <div className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {content.mediaType.charAt(0).toUpperCase() + content.mediaType.slice(1)}
                    </div>
                  </div>
                )}
                
                {content.displayOrder !== undefined && (
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">Display Order:</div>
                    <div className="text-sm">{content.displayOrder}</div>
                  </div>
                )}
                
                {content.actionUrl && (
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">Action:</div>
                    <div className="text-sm flex items-center gap-1">
                      <ExternalLink size={14} />
                      {content.actionText || 'Link'}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDeleteContent(content.id)}
                  className="text-destructive border-destructive/20 hover:bg-destructive/10"
                >
                  <Trash2 size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleOpenDialog(content)}
                >
                  <PencilLine size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-border">
          <FilePlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Content Sections Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Add your first content section to appear on the landing page. You can include text, images, videos, and documents.
          </p>
          <Button onClick={() => handleOpenDialog()}>
            Add Your First Section
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingContent ? 'Edit Content Section' : 'Add New Content Section'}
            </DialogTitle>
            <DialogDescription>
              {editingContent
                ? 'Update this content section on the landing page'
                : 'Add a new content section to be displayed on the landing page'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a title for this section" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the main content (HTML supported)" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      You can use basic HTML for formatting.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mediaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select media type (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers display first.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.watch('mediaType') && (
                <div className="p-4 border rounded-md bg-muted/10">
                  <div className="font-medium mb-2">Media Upload</div>
                  <div className="mb-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept={
                        form.watch('mediaType') === 'image'
                          ? 'image/*'
                          : form.watch('mediaType') === 'video'
                          ? 'video/*'
                          : form.watch('mediaType') === 'document'
                          ? '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'
                          : undefined
                      }
                      onChange={(e) => {
                        // Handle file selection - just update the form, actual upload happens on submit
                        if (e.target.files && e.target.files.length > 0) {
                          const fileName = e.target.files[0].name;
                          if (form.watch('mediaType') === 'document' && !form.watch('documentTitle')) {
                            form.setValue('documentTitle', fileName);
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full justify-center"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading ({uploadProgress}%)
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Select {form.watch('mediaType')}
                        </>
                      )}
                    </Button>
                  </div>

                  {editingContent?.mediaUrl && (
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">Current file: </span>
                      <a
                        href={editingContent.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate inline-block max-w-[300px] align-bottom"
                      >
                        {editingContent.mediaUrl.split('/').pop()}
                      </a>
                    </div>
                  )}

                  {form.watch('mediaType') === 'document' && (
                    <>
                      <FormField
                        control={form.control}
                        name="documentTitle"
                        render={({ field }) => (
                          <FormItem className="mt-3">
                            <FormLabel>Document Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter a title for this document" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="documentDescription"
                        render={({ field }) => (
                          <FormItem className="mt-3">
                            <FormLabel>Document Description</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter a brief description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="actionUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Action URL</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., /register or https://..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Link to direct users to (optional).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="actionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Action Text</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Learn More, Register Now" {...field} />
                      </FormControl>
                      <FormDescription>
                        Button text for the action URL.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={uploading}
                >
                  {uploading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingContent ? 'Update' : 'Add'} Content
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}