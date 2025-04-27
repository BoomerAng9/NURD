import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Upload, Image as ImageIcon, Tag, FileImage, Info, Edit, Trash2, Link, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { OptimizedImage } from '@/components/ui/optimized-image';

// Define types based on our database schema
type ImageCategory = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

type AppPage = {
  id: number;
  name: string;
  route: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

type ImageTag = {
  id: number;
  name: string;
  created_at: string;
};

type Image = {
  id: number;
  title: string;
  description: string | null;
  file_path: string;
  file_size: number;
  file_type: string;
  alt_text: string | null;
  category_id: number | null;
  is_active: boolean;
  usage_count: number;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
};

type ImagePageMapping = {
  image_id: number;
  page_id: number;
  usage_type: string;
  position: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

// Form schemas for validation
const uploadImageSchema = z.object({
  title: z.string().min(3, "Title is required and must be at least 3 characters"),
  description: z.string().optional(),
  alt_text: z.string().optional(),
  category_id: z.string().optional(),
  image: z.instanceof(File).refine(file => file.size > 0, "Image file is required")
});

const addCategorySchema = z.object({
  name: z.string().min(3, "Name is required and must be at least 3 characters"),
  description: z.string().optional()
});

const addTagSchema = z.object({
  name: z.string().min(2, "Tag name is required and must be at least 2 characters")
});

const assignImageSchema = z.object({
  page_id: z.string().min(1, "Page is required"),
  usage_type: z.string().optional(),
  position: z.coerce.number().min(0).default(0),
  notes: z.string().optional()
});

// Main component for the Image Locker
export default function ImageLocker() {
  const [activeTab, setActiveTab] = useState('images');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isAddTagDialogOpen, setIsAddTagDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['/api/image-locker/categories'],
    enabled: true,
  });

  const { data: pages, isLoading: isPagesLoading } = useQuery({
    queryKey: ['/api/image-locker/pages'],
    enabled: true,
  });

  const { data: tags, isLoading: isTagsLoading } = useQuery({
    queryKey: ['/api/image-locker/tags'],
    enabled: true,
  });

  const { data: images, isLoading: isImagesLoading } = useQuery({
    queryKey: [
      '/api/image-locker/images', 
      { categoryId: selectedCategory !== 'all' ? selectedCategory : undefined }
    ],
    enabled: true,
  });

  // Image upload form
  const uploadForm = useForm<z.infer<typeof uploadImageSchema>>({
    resolver: zodResolver(uploadImageSchema),
    defaultValues: {
      title: '',
      description: '',
      alt_text: '',
      category_id: '',
    }
  });

  // Category form
  const categoryForm = useForm<z.infer<typeof addCategorySchema>>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: '',
      description: '',
    }
  });

  // Tag form
  const tagForm = useForm<z.infer<typeof addTagSchema>>({
    resolver: zodResolver(addTagSchema),
    defaultValues: {
      name: '',
    }
  });

  // Assign image to page form
  const assignForm = useForm<z.infer<typeof assignImageSchema>>({
    resolver: zodResolver(assignImageSchema),
    defaultValues: {
      page_id: '',
      usage_type: 'general',
      position: 0,
      notes: '',
    }
  });

  // Mutations
  const uploadImageMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/image-locker/images', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Image Uploaded',
        description: 'Your image has been successfully uploaded.',
        variant: 'default',
      });
      setIsUploadDialogOpen(false);
      uploadForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/image-locker/images'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const addCategoryMutation = useMutation({
    mutationFn: (data: z.infer<typeof addCategorySchema>) => {
      return apiRequest('/api/image-locker/categories', {
        method: 'POST',
        data,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Category Added',
        description: 'New category has been successfully added.',
        variant: 'default',
      });
      setIsAddCategoryDialogOpen(false);
      categoryForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/image-locker/categories'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const addTagMutation = useMutation({
    mutationFn: (data: z.infer<typeof addTagSchema>) => {
      return apiRequest('/api/image-locker/tags', {
        method: 'POST',
        data,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Tag Added',
        description: 'New tag has been successfully added.',
        variant: 'default',
      });
      setIsAddTagDialogOpen(false);
      tagForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/image-locker/tags'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const assignImageMutation = useMutation({
    mutationFn: (data: z.infer<typeof assignImageSchema> & { imageId: number }) => {
      const { imageId, ...rest } = data;
      return apiRequest(`/api/image-locker/images/${imageId}/pages/${rest.page_id}`, {
        method: 'POST',
        data: {
          usage_type: rest.usage_type,
          position: rest.position,
          notes: rest.notes,
        },
      });
    },
    onSuccess: () => {
      toast({
        title: 'Image Assigned',
        description: 'Image has been successfully assigned to the page.',
        variant: 'default',
      });
      setIsAssignDialogOpen(false);
      assignForm.reset();
      if (selectedImage) {
        queryClient.invalidateQueries({ queryKey: [`/api/image-locker/images/${selectedImage.id}/pages`] });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const toggleImageActiveMutation = useMutation({
    mutationFn: (imageId: number) => {
      return apiRequest(`/api/image-locker/images/${imageId}/toggle-active`, {
        method: 'PUT',
      });
    },
    onSuccess: (data) => {
      toast({
        title: data.is_active ? 'Image Activated' : 'Image Deactivated',
        description: `Image has been ${data.is_active ? 'activated' : 'deactivated'}.`,
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/image-locker/images'] });
      if (selectedImage?.id === data.id) {
        setSelectedImage(data);
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: number) => {
      return apiRequest(`/api/image-locker/images/${imageId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Image Deleted',
        description: 'Image has been permanently deleted.',
        variant: 'default',
      });
      setSelectedImage(null);
      queryClient.invalidateQueries({ queryKey: ['/api/image-locker/images'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Form submission handlers
  const onUploadSubmit = (values: z.infer<typeof uploadImageSchema>) => {
    const formData = new FormData();
    formData.append('title', values.title);
    if (values.description) formData.append('description', values.description);
    if (values.alt_text) formData.append('altText', values.alt_text);
    if (values.category_id) formData.append('categoryId', values.category_id);
    formData.append('image', values.image);
    
    uploadImageMutation.mutate(formData);
  };

  const onCategorySubmit = (values: z.infer<typeof addCategorySchema>) => {
    addCategoryMutation.mutate(values);
  };

  const onTagSubmit = (values: z.infer<typeof addTagSchema>) => {
    addTagMutation.mutate(values);
  };

  const onAssignSubmit = (values: z.infer<typeof assignImageSchema>) => {
    if (selectedImage) {
      assignImageMutation.mutate({
        ...values,
        imageId: selectedImage.id,
      });
    }
  };

  // Helper for formatting file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Filter and sort the images based on search query
  const filteredImages = React.useMemo(() => {
    if (!images) return [];
    
    return images.filter(image => 
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (image.description && image.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (image.alt_text && image.alt_text.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [images, searchQuery]);

  // Get image pages (for selected image)
  const { data: imagePagesData } = useQuery({
    queryKey: [`/api/image-locker/images/${selectedImage?.id}/pages`],
    enabled: !!selectedImage,
  });

  // Get image tags (for selected image)
  const { data: imageTagsData } = useQuery({
    queryKey: [`/api/image-locker/images/${selectedImage?.id}/tags`],
    enabled: !!selectedImage,
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Image Locker</h1>
        <p className="text-muted-foreground">Manage and organize all website images in one place</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-[500px]">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Input 
                placeholder="Search images..." 
                className="w-[300px]" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category: ImageCategory) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Upload New Image</DialogTitle>
                  <DialogDescription>
                    Upload an image file to add to the image locker.
                  </DialogDescription>
                </DialogHeader>
                <Form {...uploadForm}>
                  <form onSubmit={uploadForm.handleSubmit(onUploadSubmit)} className="space-y-4">
                    <FormField
                      control={uploadForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter image title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={uploadForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter image description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={uploadForm.control}
                      name="alt_text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alt Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter alt text for accessibility" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={uploadForm.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map((category: ImageCategory) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={uploadForm.control}
                      name="image"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Image File</FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(file);
                                }
                              }}
                              {...fieldProps}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        disabled={uploadImageMutation.isPending}
                      >
                        {uploadImageMutation.isPending ? 'Uploading...' : 'Upload Image'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isImagesLoading ? (
              <p>Loading images...</p>
            ) : filteredImages.length === 0 ? (
              <p>No images found</p>
            ) : (
              filteredImages.map((image: Image) => (
                <Card 
                  key={image.id} 
                  className={`overflow-hidden ${!image.is_active ? 'opacity-60' : ''} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative h-40 bg-muted flex items-center justify-center">
                    <OptimizedImage 
                      src={image.file_path} 
                      alt={image.alt_text || image.title} 
                      className="w-full h-full object-cover"
                      fallbackSrc='https://placehold.co/300x200?text=No+Image'
                    />
                    {!image.is_active && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Badge variant="outline" className="bg-background">Inactive</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium truncate">{image.title}</CardTitle>
                    <CardDescription className="text-xs truncate">
                      {formatFileSize(image.file_size)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Image Categories</h2>
            <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>
                    Create a new category to organize your images.
                  </DialogDescription>
                </DialogHeader>
                <Form {...categoryForm}>
                  <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
                    <FormField
                      control={categoryForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Category name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={categoryForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Category description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        disabled={addCategoryMutation.isPending}
                      >
                        {addCategoryMutation.isPending ? 'Adding...' : 'Add Category'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isCategoriesLoading ? (
              <p>Loading categories...</p>
            ) : categories?.length === 0 ? (
              <p>No categories found</p>
            ) : (
              categories?.map((category: ImageCategory) => (
                <Card key={category.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{category.description || 'No description'}</p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedCategory(category.id.toString())}
                    >
                      View Images
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Image Tags</h2>
            <Dialog open={isAddTagDialogOpen} onOpenChange={setIsAddTagDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tag
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Tag</DialogTitle>
                  <DialogDescription>
                    Create a new tag to label and categorize your images.
                  </DialogDescription>
                </DialogHeader>
                <Form {...tagForm}>
                  <form onSubmit={tagForm.handleSubmit(onTagSubmit)} className="space-y-4">
                    <FormField
                      control={tagForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Tag name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        disabled={addTagMutation.isPending}
                      >
                        {addTagMutation.isPending ? 'Adding...' : 'Add Tag'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-wrap gap-2">
            {isTagsLoading ? (
              <p>Loading tags...</p>
            ) : tags?.length === 0 ? (
              <p>No tags found</p>
            ) : (
              tags?.map((tag: ImageTag) => (
                <Badge key={tag.id} variant="secondary" className="px-3 py-1 text-sm">
                  #{tag.name}
                </Badge>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Details Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  {selectedImage.title}
                  {!selectedImage.is_active && (
                    <Badge variant="outline" className="ml-2">Inactive</Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                  Uploaded on {new Date(selectedImage.uploaded_at).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-4">
                  <div className="relative rounded-md overflow-hidden border bg-muted aspect-square flex items-center justify-center">
                    <OptimizedImage 
                      src={selectedImage.file_path} 
                      alt={selectedImage.alt_text || selectedImage.title}
                      className="max-w-full max-h-full object-contain"
                      fallbackSrc='https://placehold.co/600x400?text=Error+Loading+Image'
                      priority={true}
                    />
                  </div>
                  
                  <div className="flex justify-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(selectedImage.file_path, '_blank')}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Full Size
                    </Button>
                    <Button 
                      variant={selectedImage.is_active ? "destructive" : "outline"} 
                      size="sm"
                      onClick={() => toggleImageActiveMutation.mutate(selectedImage.id)}
                    >
                      {selectedImage.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
                          deleteImageMutation.mutate(selectedImage.id);
                        }
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Image Information</h3>
                    <ul className="space-y-1 text-sm">
                      <li><strong>ID:</strong> {selectedImage.id}</li>
                      <li><strong>File Size:</strong> {formatFileSize(selectedImage.file_size)}</li>
                      <li><strong>File Type:</strong> {selectedImage.file_type}</li>
                      <li><strong>Path:</strong> {selectedImage.file_path}</li>
                      <li><strong>Alt Text:</strong> {selectedImage.alt_text || 'None'}</li>
                      <li><strong>Category:</strong> {
                        selectedImage.category_id 
                          ? categories?.find((c: ImageCategory) => c.id === selectedImage.category_id)?.name || 'Unknown'
                          : 'None'
                      }</li>
                      <li><strong>Usage Count:</strong> {selectedImage.usage_count}</li>
                      <li><strong>Status:</strong> {selectedImage.is_active ? 'Active' : 'Inactive'}</li>
                      <li><strong>Description:</strong> {selectedImage.description || 'None'}</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">Pages Using This Image</h3>
                      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Assign to Page
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Assign to Page</DialogTitle>
                            <DialogDescription>
                              Add this image to a page in the website.
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...assignForm}>
                            <form onSubmit={assignForm.handleSubmit(onAssignSubmit)} className="space-y-4">
                              <FormField
                                control={assignForm.control}
                                name="page_id"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Page</FormLabel>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a page" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {pages?.map((page: AppPage) => (
                                          <SelectItem key={page.id} value={page.id.toString()}>
                                            {page.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={assignForm.control}
                                name="usage_type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Usage Type</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g., hero, background, content" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Describes how the image is used on the page
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={assignForm.control}
                                name="position"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Position</FormLabel>
                                    <FormControl>
                                      <Input type="number" min="0" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Determines the display order (0 = first)
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={assignForm.control}
                                name="notes"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder="Optional notes about this assignment" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <DialogFooter>
                                <Button 
                                  type="submit" 
                                  disabled={assignImageMutation.isPending}
                                >
                                  {assignImageMutation.isPending ? 'Assigning...' : 'Assign Image'}
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    {imagePagesData?.length === 0 ? (
                      <p className="text-sm text-muted-foreground">This image is not assigned to any pages yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {imagePagesData?.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between bg-muted/50 rounded-md p-2 text-sm">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-xs ml-2 text-muted-foreground">({item.mapping.usage_type || 'general'})</span>
                            </div>
                            <Button variant="ghost" size="icon" title="View page">
                              <Link className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {imageTagsData?.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No tags assigned to this image.</p>
                      ) : (
                        imageTagsData?.map((tag: ImageTag) => (
                          <Badge key={tag.id} variant="secondary">
                            #{tag.name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}