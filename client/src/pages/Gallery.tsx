import React, { useState } from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import GalleryGrid from '@/components/gallery/gallery-grid';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSupabase } from '@/components/ui/supabase-provider';

const Gallery: React.FC = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    tags: '',
    file: null as File | null
  });
  const { toast } = useToast();
  const { user } = useSupabase();

  // Handle opening upload dialog
  const handleOpenUploadDialog = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload your work to the gallery.",
        variant: "destructive"
      });
      return;
    }
    setUploadDialogOpen(true);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadForm({
        ...uploadForm,
        file: e.target.files[0]
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUploadForm({
      ...uploadForm,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!uploadForm.title) {
      toast({
        title: "Missing Title",
        description: "Please provide a title for your work.",
        variant: "destructive"
      });
      return;
    }
    
    if (!uploadForm.file) {
      toast({
        title: "Missing File",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real implementation, this would upload to Supabase Storage or similar
      // For now we'll simulate the upload with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Upload Successful",
        description: "Your work has been uploaded to the gallery!",
      });
      
      setUploadDialogOpen(false);
      setUploadForm({
        title: '',
        description: '',
        tags: '',
        file: null
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your work. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold font-heading text-gray-900 mb-4">Community Gallery</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore amazing projects created by the NURD community. Get inspired, share your work, and connect with fellow creators.
              </p>
            </div>
            
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-md">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-amber-700 font-medium">
                  These are only examples. What will you build and showcase?
                </p>
              </div>
            </div>
            
            <GalleryGrid 
              onUpload={handleOpenUploadDialog} 
            />
            
            {/* Upload Form Dialog */}
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Upload Your Work</DialogTitle>
                  <DialogDescription>
                    Share your creative projects with the NURD community. All uploads will be reviewed by our moderation team.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Give your work a title"
                      value={uploadForm.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Tell us about your work (tools used, inspiration, etc.)"
                      value={uploadForm.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      name="tags"
                      placeholder="e.g. 3D Modeling, Game Development (comma separated)"
                      value={uploadForm.tags}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-gray-500">Separate tags with commas</p>
                  </div>
                  
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="file">File</Label>
                    <Input
                      id="file"
                      name="file"
                      type="file"
                      accept="image/*,video/*,audio/*,.glb,.gltf,.obj,.blend,.fbx,.stl,.pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Supported formats: Images, videos, 3D models, audio files, and documents
                    </p>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUploading}>
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Gallery;