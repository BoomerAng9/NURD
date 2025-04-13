import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, MoreHorizontal, Download, Flag, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define gallery item type
export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  fileType: 'image' | 'video' | 'model' | 'audio' | 'document';
  tags: string[];
  createdAt: string;
  likes: number;
  comments: number;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
    username: string;
  };
  isModerated: boolean;
  isFeatured?: boolean;
}

interface GalleryItemCardProps {
  item: GalleryItem;
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
}

export const GalleryItemCard: React.FC<GalleryItemCardProps> = ({ 
  item, 
  onLike, 
  onComment, 
  onShare 
}) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(item.likes);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    if (onLike) onLike(item.id);
  };

  const handleComment = () => {
    if (onComment) onComment(item.id);
  };

  const handleShare = () => {
    if (onShare) onShare(item.id);
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Card className="overflow-hidden group h-full flex flex-col hover:shadow-md transition-shadow duration-300">
        <div className="relative overflow-hidden" style={{ paddingBottom: '75%' }}>
          {/* Gallery item preview */}
          <img 
            src={item.thumbnailUrl || item.imageUrl} 
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
            onClick={() => setModalOpen(true)}
          />
          
          {/* Badges for special states */}
          {item.isFeatured && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                Featured
              </Badge>
            </div>
          )}
          
          {/* File type indicator */}
          <div className="absolute bottom-2 right-2 z-10">
            <Badge variant="outline" className="bg-black/70 text-white border-none">
              {item.fileType.toUpperCase()}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="p-3 pb-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-base line-clamp-1">{item.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.open(item.imageUrl, '_blank')}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Flag className="mr-2 h-4 w-4" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {item.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
          )}
          
          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 3 && (
                <Badge variant="outline" className="text-gray-500">
                  +{item.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardFooter className="p-3 pt-2 mt-auto flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={item.author.avatarUrl} alt={item.author.name} />
              <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600">{item.author.name}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${liked ? 'text-red-500' : 'text-gray-500'}`}
              onClick={handleLike}
            >
              <Heart className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} />
              {likes > 0 && <span className="ml-1 text-xs">{likes}</span>}
            </Button>
            
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={handleComment}>
              <MessageSquare className="h-4 w-4" />
              {item.comments > 0 && <span className="ml-1 text-xs">{item.comments}</span>}
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Expanded View Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
          >
            <div className="md:w-2/3 relative bg-gray-900 flex items-center justify-center">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="max-h-[70vh] max-w-full object-contain"
              />
              <button 
                className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                onClick={() => setModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="md:w-1/3 p-5 overflow-y-auto max-h-[70vh]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">{item.title}</h2>
                  <p className="text-sm text-gray-500">Posted on {formatDate(item.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={item.author.avatarUrl} alt={item.author.name} />
                  <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{item.author.name}</p>
                  <p className="text-sm text-gray-500">@{item.author.username}</p>
                </div>
              </div>
              
              {item.description && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              )}
              
              {item.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between border-t pt-4">
                <div className="flex space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLike}
                    className={liked ? 'text-red-500' : ''}
                  >
                    <Heart className="h-4 w-4 mr-1" fill={liked ? 'currentColor' : 'none'} />
                    {liked ? 'Liked' : 'Like'} ({likes})
                  </Button>
                  
                  <Button variant="ghost" size="sm" onClick={handleComment}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Comment ({item.comments})
                  </Button>
                </div>
                
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default GalleryItemCard;