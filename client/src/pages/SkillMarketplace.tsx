import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Brain, 
  Briefcase, 
  Clock, 
  Code, 
  FileQuestion, 
  Filter, 
  Lightbulb, 
  Music, 
  Palette, 
  PenTool, 
  Plus, 
  Search, 
  Share2, 
  Star, 
  ThumbsUp 
} from 'lucide-react';
import { SkillOffering, SkillRequest, SkillCategory } from '@shared/schema';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMedia } from '@/hooks/use-media';
import SkillOfferingCard from '@/components/marketplace/skill-offering-card';
import SkillRequestCard from '@/components/marketplace/skill-request-card';
import CreateOfferingDialog from '@/components/marketplace/create-offering-dialog';
import CreateRequestDialog from '@/components/marketplace/create-request-dialog';

const SkillMarketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [skillLevelFilter, setSkillLevelFilter] = useState<string>('all');
  const [showCreateOffering, setShowCreateOffering] = useState(false);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const isMobile = useMedia('(max-width: 640px)');
  const { toast } = useToast();

  // Fetch skill categories
  const { data: categories = [] } = useQuery<SkillCategory[]>({
    queryKey: ['/api/skill-categories'],
  });

  // Fetch skill offerings
  const { data: offerings = [], isLoading: offeringsLoading } = useQuery<(SkillOffering & { user: { username: string, avatar_url?: string } })[]>({
    queryKey: ['/api/skill-offerings'],
  });

  // Fetch skill requests
  const { data: requests = [], isLoading: requestsLoading } = useQuery<(SkillRequest & { user: { username: string, avatar_url?: string } })[]>({
    queryKey: ['/api/skill-requests'],
  });

  // Filter offerings
  const filteredOfferings = offerings.filter(offering => {
    const matchesSearch = searchTerm === '' || 
      offering.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offering.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || 
      offering.category_id.toString() === categoryFilter;
    
    const matchesSkillLevel = skillLevelFilter === 'all' || 
      offering.skill_level === skillLevelFilter;
    
    return matchesSearch && matchesCategory && matchesSkillLevel && offering.is_active;
  });

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || 
      request.category_id.toString() === categoryFilter;
    
    const matchesSkillLevel = skillLevelFilter === 'all' || 
      request.desired_skill_level === skillLevelFilter;
    
    return matchesSearch && matchesCategory && matchesSkillLevel && request.is_active;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 pb-12">
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-[#121645] to-[#2C2F7C] py-16 text-white">
        <div className="absolute inset-0 bg-grid-white/5 mask-gradient-b" />
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600">
              Peer Skill Exchange Marketplace
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Share your talents and learn from others in our collaborative community.
              Offer your skills or request help with something you'd like to learn.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Share2 className="h-8 w-8 mx-auto mb-2 text-[#3DE053]" />
                <span className="font-medium">Share Skills</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Brain className="h-8 w-8 mx-auto mb-2 text-[#3DE053]" />
                <span className="font-medium">Learn New Skills</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-[#3DE053]" />
                <span className="font-medium">Earn XP</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <ThumbsUp className="h-8 w-8 mx-auto mb-2 text-[#3DE053]" />
                <span className="font-medium">Build Community</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <main className="container px-4 mx-auto mt-8">
        {/* Filters */}
        <Card className="mb-8 bg-card/50 backdrop-blur border border-border/40">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search skills..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => setCategoryFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={skillLevelFilter}
                  onValueChange={(value) => setSkillLevelFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Offerings and Requests */}
        <Tabs defaultValue="offerings" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="offerings">Skills Offered</TabsTrigger>
              <TabsTrigger value="requests">Skills Requested</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCreateOffering(true)}
                className="hidden sm:flex items-center"
              >
                <Plus className="mr-1 h-4 w-4" />
                Offer Skill
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCreateRequest(true)}
                className="hidden sm:flex items-center"
              >
                <Plus className="mr-1 h-4 w-4" />
                Request Skill
              </Button>
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="flex space-x-2 mb-4 sm:hidden">
            <Button 
              variant="default" 
              size="sm"
              onClick={() => setShowCreateOffering(true)}
              className="flex-1 items-center justify-center"
            >
              <Plus className="mr-1 h-4 w-4" />
              Offer Skill
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowCreateRequest(true)}
              className="flex-1 items-center justify-center"
            >
              <Plus className="mr-1 h-4 w-4" />
              Request Skill
            </Button>
          </div>

          <TabsContent value="offerings" className="mt-0">
            {offeringsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="h-64 bg-muted/50"></Card>
                ))}
              </div>
            ) : filteredOfferings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOfferings.map((offering) => (
                  <SkillOfferingCard key={offering.id} offering={offering} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No skills offered</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || categoryFilter !== 'all' || skillLevelFilter !== 'all' 
                    ? "No skills match your current filters."
                    : "Be the first to share your skills with others!"}
                </p>
                <Button onClick={() => setShowCreateOffering(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Offer a Skill
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="mt-0">
            {requestsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="h-64 bg-muted/50"></Card>
                ))}
              </div>
            ) : filteredRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((request) => (
                  <SkillRequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No skills requested</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || categoryFilter !== 'all' || skillLevelFilter !== 'all' 
                    ? "No requests match your current filters."
                    : "Be the first to request help with learning a skill!"}
                </p>
                <Button onClick={() => setShowCreateRequest(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Request a Skill
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create dialogs */}
        <CreateOfferingDialog 
          open={showCreateOffering} 
          onOpenChange={setShowCreateOffering} 
          categories={categories}
        />

        <CreateRequestDialog 
          open={showCreateRequest} 
          onOpenChange={setShowCreateRequest}
          categories={categories} 
        />
      </main>
    </div>
  );
};

export default SkillMarketplace;