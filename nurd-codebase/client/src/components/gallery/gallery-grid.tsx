import React, { useState } from 'react';
import { Search, Filter, ChevronDown, UploadCloud, SlidersHorizontal } from 'lucide-react';
import GalleryItemCard, { GalleryItem } from './gallery-item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Mock data for gallery items
const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    title: '3D Game Character Design',
    description: 'A 3D character model created for my game development project. Designed and textured in Blender.',
    imageUrl: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    fileType: 'image',
    tags: ['3D Modeling', 'Game Development', 'Character Design'],
    createdAt: '2023-06-15T14:48:00.000Z',
    likes: 24,
    comments: 5,
    author: {
      id: '101',
      name: 'Alex Johnson',
      username: 'alexj',
      avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    },
    isModerated: true,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Pixel Art Landscape',
    description: 'A pixel art landscape for my 2D platformer game. Created using Aseprite.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    fileType: 'image',
    tags: ['Pixel Art', 'Game Development', 'Landscape'],
    createdAt: '2023-06-10T09:30:00.000Z',
    likes: 18,
    comments: 3,
    author: {
      id: '102',
      name: 'Maya Patel',
      username: 'mayap',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80'
    },
    isModerated: true
  },
  {
    id: '3',
    title: 'Machine Learning Project',
    description: 'Visualization of my machine learning project analyzing student performance data.',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    fileType: 'image',
    tags: ['AI', 'Machine Learning', 'Data Visualization', 'Python'],
    createdAt: '2023-06-05T16:20:00.000Z',
    likes: 12,
    comments: 7,
    author: {
      id: '103',
      name: 'Jordan Smith',
      username: 'jordans',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
    },
    isModerated: true
  },
  {
    id: '4',
    title: 'Website Design Project',
    description: 'A website design for a local business created using Figma and implemented with React.',
    imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1336&q=80',
    fileType: 'image',
    tags: ['Web Design', 'UI/UX', 'React', 'Figma'],
    createdAt: '2023-06-01T11:15:00.000Z',
    likes: 9,
    comments: 2,
    author: {
      id: '104',
      name: 'Sam Taylor',
      username: 'samt',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
    },
    isModerated: true
  },
  {
    id: '5',
    title: 'Robot Arm Control System',
    description: 'Programming the control system for a 3D printed robot arm using Arduino.',
    imageUrl: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
    fileType: 'image',
    tags: ['Robotics', 'Arduino', 'Engineering', '3D Printing'],
    createdAt: '2023-05-28T14:00:00.000Z',
    likes: 15,
    comments: 4,
    author: {
      id: '105',
      name: 'Jamie Lee',
      username: 'jamiel',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'
    },
    isModerated: true
  },
  {
    id: '6',
    title: 'Digital Painting - Fantasy World',
    description: 'Digital painting of a fantasy world created in Procreate during my digital art class.',
    imageUrl: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80',
    fileType: 'image',
    tags: ['Digital Art', 'Procreate', 'Fantasy', 'Painting'],
    createdAt: '2023-05-25T09:45:00.000Z',
    likes: 28,
    comments: 6,
    author: {
      id: '106',
      name: 'Riley Chen',
      username: 'rileyc',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80'
    },
    isModerated: true,
    isFeatured: true
  }
];

// Tag options for filtering
const tagOptions = [
  '3D Modeling',
  'Game Development',
  'Character Design',
  'Pixel Art',
  'AI',
  'Machine Learning',
  'Data Visualization',
  'Python',
  'Web Design',
  'UI/UX',
  'React',
  'Figma',
  'Robotics',
  'Arduino',
  'Engineering',
  '3D Printing',
  'Digital Art',
  'Procreate',
  'Fantasy',
  'Painting'
];

// File type options for filtering
const fileTypeOptions = [
  'image',
  'video',
  'model',
  'audio',
  'document'
];

interface GalleryGridProps {
  initialItems?: GalleryItem[];
  onUpload?: () => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ 
  initialItems = mockGalleryItems,
  onUpload 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'comments'>('newest');
  
  // Filter gallery items based on search query, selected tags, and file types
  const filteredItems = initialItems.filter(item => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by selected tags
    const matchesTags = 
      selectedTags.length === 0 ||
      item.tags.some(tag => selectedTags.includes(tag));
    
    // Filter by selected file types
    const matchesFileTypes = 
      selectedFileTypes.length === 0 ||
      selectedFileTypes.includes(item.fileType);
    
    return matchesSearch && matchesTags && matchesFileTypes;
  });

  // Sort filtered items based on sortBy
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'popular') {
      return b.likes - a.likes;
    } else {
      return b.comments - a.comments;
    }
  });

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  // Toggle file type selection
  const toggleFileType = (fileType: string) => {
    setSelectedFileTypes(prev => 
      prev.includes(fileType)
        ? prev.filter(t => t !== fileType)
        : [...prev, fileType]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedFileTypes([]);
    setSearchQuery('');
  };
  
  // Handle like, comment, share actions
  const handleLike = (id: string) => {
    console.log(`Liked item: ${id}`);
  };
  
  const handleComment = (id: string) => {
    console.log(`Comment on item: ${id}`);
  };
  
  const handleShare = (id: string) => {
    console.log(`Share item: ${id}`);
  };
  
  const handleUpload = () => {
    if (onUpload) onUpload();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Gallery</h2>
        <Button onClick={handleUpload} className="bg-green-600 hover:bg-green-700">
          <UploadCloud className="h-4 w-4 mr-2" />
          Upload Your Work
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <TabsList>
            <TabsTrigger value="all">All Works</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="game-dev">Game Development</TabsTrigger>
            <TabsTrigger value="digital-art">Digital Art</TabsTrigger>
            <TabsTrigger value="ai-ml">AI & ML</TabsTrigger>
          </TabsList>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy('newest')} className={sortBy === 'newest' ? 'bg-blue-50' : ''}>
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('popular')} className={sortBy === 'popular' ? 'bg-blue-50' : ''}>
                Popular
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('comments')} className={sortBy === 'comments' ? 'bg-blue-50' : ''}>
                Most Comments
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row gap-4 my-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search by title, tag, or creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Tags
                  {selectedTags.length > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                      {selectedTags.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
                {tagOptions.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => toggleTag(tag)}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  File Type
                  {selectedFileTypes.length > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                      {selectedFileTypes.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {fileTypeOptions.map((fileType) => (
                  <DropdownMenuCheckboxItem
                    key={fileType}
                    checked={selectedFileTypes.includes(fileType)}
                    onCheckedChange={() => toggleFileType(fileType)}
                  >
                    {fileType.charAt(0).toUpperCase() + fileType.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {(selectedTags.length > 0 || selectedFileTypes.length > 0 || searchQuery) && (
              <Button variant="ghost" onClick={clearFilters} className="text-gray-500">
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        {/* Selected filters display */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map(tag => (
              <div key={tag} className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {tag}
                <button 
                  onClick={() => toggleTag(tag)} 
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Results count */}
        <div className="text-sm text-gray-500 mb-4">
          {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'} found
        </div>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <GalleryItemCard
                  key={item.id}
                  item={item}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No gallery items found matching your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="featured">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.filter(item => item.isFeatured).length > 0 ? (
              sortedItems
                .filter(item => item.isFeatured)
                .map((item) => (
                  <GalleryItemCard
                    key={item.id}
                    item={item}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No featured items found matching your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="game-dev">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.filter(item => item.tags.some(tag => tag.includes('Game') || tag.includes('3D'))).length > 0 ? (
              sortedItems
                .filter(item => item.tags.some(tag => tag.includes('Game') || tag.includes('3D')))
                .map((item) => (
                  <GalleryItemCard
                    key={item.id}
                    item={item}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No game development items found matching your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="digital-art">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.filter(item => item.tags.some(tag => tag.includes('Art') || tag.includes('Design'))).length > 0 ? (
              sortedItems
                .filter(item => item.tags.some(tag => tag.includes('Art') || tag.includes('Design')))
                .map((item) => (
                  <GalleryItemCard
                    key={item.id}
                    item={item}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No digital art items found matching your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="ai-ml">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.filter(item => item.tags.some(tag => tag.includes('AI') || tag.includes('Machine Learning'))).length > 0 ? (
              sortedItems
                .filter(item => item.tags.some(tag => tag.includes('AI') || tag.includes('Machine Learning')))
                .map((item) => (
                  <GalleryItemCard
                    key={item.id}
                    item={item}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No AI/ML items found matching your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GalleryGrid;