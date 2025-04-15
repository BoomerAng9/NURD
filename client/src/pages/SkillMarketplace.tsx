import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FilterIcon,
  Search,
  SlidersHorizontal,
  Users2,
  BadgeHelp,
  PlusCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { SkillCategory, SkillOffering, SkillRequest } from '@shared/schema';
import { cn } from '@/lib/utils';
import useMedia, { useBreakpoints } from '@/hooks/use-media';
import SkillOfferingCard from '@/components/marketplace/skill-offering-card';
import SkillRequestCard from '@/components/marketplace/skill-request-card';
import CreateOfferingDialog from '@/components/marketplace/create-offering-dialog';
import CreateRequestDialog from '@/components/marketplace/create-request-dialog';

const SkillMarketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("offerings");
  const [offeringDialogOpen, setOfferingDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  
  const { isMobile } = useBreakpoints();

  // Fetch skill categories
  const { data: categories = [] } = useQuery<SkillCategory[]>({
    queryKey: ['/api/skill-categories'],
  });

  // Fetch skill offerings
  const { data: offerings = [], isLoading: offeringsLoading } = useQuery<SkillOffering[]>({
    queryKey: ['/api/skill-offerings'],
  });

  // Fetch skill requests
  const { data: requests = [], isLoading: requestsLoading } = useQuery<SkillRequest[]>({
    queryKey: ['/api/skill-requests'],
  });

  // Filter offerings based on search and filters
  const filteredOfferings = offerings.filter(offering => {
    let matchesSearch = true;
    let matchesCategory = true;
    let matchesLevel = true;

    if (searchText) {
      matchesSearch = offering.title.toLowerCase().includes(searchText.toLowerCase()) || 
                     offering.description.toLowerCase().includes(searchText.toLowerCase());
    }

    if (selectedCategory !== 'all') {
      matchesCategory = offering.category_id.toString() === selectedCategory;
    }

    if (selectedLevel !== 'all') {
      matchesLevel = offering.skill_level === selectedLevel;
    }

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    let matchesSearch = true;
    let matchesCategory = true;
    let matchesLevel = true;

    if (searchText) {
      matchesSearch = request.title.toLowerCase().includes(searchText.toLowerCase()) || 
                     request.description.toLowerCase().includes(searchText.toLowerCase());
    }

    if (selectedCategory !== 'all') {
      matchesCategory = request.category_id.toString() === selectedCategory;
    }

    if (selectedLevel !== 'all') {
      matchesLevel = request.desired_skill_level === selectedLevel;
    }

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Skill Marketplace | NURD</title>
      </Helmet>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Skills Exchange
            </h1>
            <p className="text-muted-foreground mt-1">
              Share your skills with others or learn from your peers
            </p>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <Button 
              size={isMobile ? "sm" : "default"}
              onClick={() => {
                if (activeTab === "offerings") {
                  setOfferingDialogOpen(true);
                } else {
                  setRequestDialogOpen(true);
                }
              }}
              className="gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              {!isMobile && (activeTab === "offerings" ? "Offer a Skill" : "Request a Skill")}
              {isMobile && "Create"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search skills..."
                className="pl-10"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedLevel}
              onValueChange={setSelectedLevel}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Skill Level" />
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
      </div>

      <Tabs 
        defaultValue="offerings" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="offerings" className="flex items-center">
            <Users2 className="h-4 w-4 mr-2" />
            Skills Offered
            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
              {offerings.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center">
            <BadgeHelp className="h-4 w-4 mr-2" />
            Skills Requested
            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
              {requests.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offerings">
          {offeringsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="border border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader className="p-4 space-y-2">
                    <div className="h-4 bg-muted/30 rounded animate-pulse w-1/3"></div>
                    <div className="h-6 bg-muted/30 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted/30 rounded animate-pulse"></div>
                      <div className="h-4 bg-muted/30 rounded animate-pulse w-2/3"></div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <div className="h-8 bg-muted/30 rounded-full animate-pulse w-8"></div>
                    <div className="h-8 bg-muted/30 rounded animate-pulse w-1/3"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredOfferings.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredOfferings.map((offering) => (
                <motion.div key={offering.id} variants={itemVariants}>
                  <SkillOfferingCard offering={offering} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="border border-border/40 bg-card/20 backdrop-blur text-center py-12">
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Users2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">No skills found</h3>
                  <p className="text-muted-foreground">
                    {searchText || selectedCategory !== 'all' || selectedLevel !== 'all'
                      ? "Try adjusting your filters to find more skills"
                      : "Be the first to offer your skills to the community!"
                    }
                  </p>
                  {!searchText && selectedCategory === 'all' && selectedLevel === 'all' && (
                    <Button onClick={() => setOfferingDialogOpen(true)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Offer a Skill
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests">
          {requestsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="border border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader className="p-4 space-y-2">
                    <div className="h-4 bg-muted/30 rounded animate-pulse w-1/3"></div>
                    <div className="h-6 bg-muted/30 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted/30 rounded animate-pulse"></div>
                      <div className="h-4 bg-muted/30 rounded animate-pulse w-2/3"></div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <div className="h-8 bg-muted/30 rounded-full animate-pulse w-8"></div>
                    <div className="h-8 bg-muted/30 rounded animate-pulse w-1/3"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredRequests.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredRequests.map((request) => (
                <motion.div key={request.id} variants={itemVariants}>
                  <SkillRequestCard request={request} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="border border-border/40 bg-card/20 backdrop-blur text-center py-12">
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <BadgeHelp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">No requests found</h3>
                  <p className="text-muted-foreground">
                    {searchText || selectedCategory !== 'all' || selectedLevel !== 'all'
                      ? "Try adjusting your filters to find skill requests"
                      : "Be the first to request a skill from the community!"
                    }
                  </p>
                  {!searchText && selectedCategory === 'all' && selectedLevel === 'all' && (
                    <Button onClick={() => setRequestDialogOpen(true)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Request a Skill
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Create dialogs */}
      <CreateOfferingDialog 
        open={offeringDialogOpen} 
        onOpenChange={setOfferingDialogOpen}
        categories={categories}
      />
      <CreateRequestDialog 
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
        categories={categories}
      />
    </div>
  );
};

export default SkillMarketplace;