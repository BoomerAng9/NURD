import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  ListFilter, 
  Search, 
  BookOpen, 
  GraduationCap, 
  Code,
  PenTool,
  Gamepad2,
  Flame,
  Zap
} from 'lucide-react';
import ModuleCard, { LearningModule } from './module-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data - this would typically come from an API or database
const sampleModules: LearningModule[] = [
  {
    id: '1',
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming with a fun and interactive approach. Perfect for beginners!',
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=3270&auto=format&fit=crop',
    category: 'Coding Basics',
    level: 'Beginner',
    duration: '2 hours',
    progress: 100,
    isLocked: false,
    completeCount: 5,
    totalLessons: 5
  },
  {
    id: '2',
    title: 'Web Development Fundamentals',
    description: 'Discover how to build your own websites with HTML, CSS, and JavaScript.',
    imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=3174&auto=format&fit=crop',
    category: 'Web Development',
    level: 'Beginner',
    duration: '4 hours',
    progress: 75,
    isLocked: false,
    completeCount: 6,
    totalLessons: 8
  },
  {
    id: '3',
    title: 'Game Development with JavaScript',
    description: 'Create exciting games that you can play and share with friends.',
    imageUrl: 'https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=3174&auto=format&fit=crop',
    category: 'Game Development',
    level: 'Intermediate',
    duration: '6 hours',
    progress: 25,
    isLocked: false,
    completeCount: 2,
    totalLessons: 8
  },
  {
    id: '4',
    title: 'Mobile App Design',
    description: 'Learn to design beautiful and functional mobile applications.',
    imageUrl: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=3174&auto=format&fit=crop',
    category: 'UI/UX Design',
    level: 'Intermediate',
    duration: '5 hours',
    progress: 0,
    isLocked: false,
    completeCount: 0,
    totalLessons: 6
  },
  {
    id: '5',
    title: 'AI Project: Build a Chatbot',
    description: 'Create your own AI chatbot using machine learning and natural language processing.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad994?q=80&w=3132&auto=format&fit=crop',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    duration: '8 hours',
    progress: 0,
    isLocked: true,
    completeCount: 0,
    totalLessons: 10
  },
  {
    id: '6',
    title: 'Digital Art Creation',
    description: 'Express your creativity with digital art tools and techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=3271&auto=format&fit=crop',
    category: 'Digital Art',
    level: 'Beginner',
    duration: '3 hours',
    progress: 0,
    isLocked: false,
    completeCount: 0,
    totalLessons: 5
  },
];

interface ModulesGridProps {
  featured?: LearningModule;
  showTabs?: boolean;
  showFilters?: boolean;
  compact?: boolean;
}

const ModulesGrid: React.FC<ModulesGridProps> = ({ 
  featured,
  showTabs = true, 
  showFilters = true,
  compact = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('all');
  
  // Filter modules based on search query, category, and level
  const filteredModules = sampleModules.filter(module => {
    // Search filter
    if (searchQuery && !module.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !module.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (selectedCategory && module.category !== selectedCategory) {
      return false;
    }
    
    // Level filter
    if (selectedLevel && module.level !== selectedLevel) {
      return false;
    }
    
    // Tab filter
    if (currentTab === 'in-progress' && (module.progress === 0 || module.progress === 100)) {
      return false;
    }
    if (currentTab === 'completed' && module.progress !== 100) {
      return false;
    }
    if (currentTab === 'not-started' && module.progress > 0) {
      return false;
    }
    
    return true;
  });
  
  // Get unique categories and levels for filters
  const getUniqueValues = <T,>(arr: T[], key: keyof T): T[typeof key][] => {
    const unique: T[typeof key][] = [];
    arr.forEach(item => {
      if (!unique.includes(item[key])) {
        unique.push(item[key]);
      }
    });
    return unique;
  };
  
  const categories = getUniqueValues(sampleModules, 'category');
  const levels = getUniqueValues(sampleModules, 'level');
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedLevel(null);
  };
  
  return (
    <div className="w-full">
      {/* Featured Module */}
      {featured && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Featured Module</h2>
          <ModuleCard module={featured} variant="featured" />
        </div>
      )}
      
      {/* Tabs */}
      {showTabs && (
        <Tabs defaultValue="all" className="mb-8" onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All Modules</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="not-started">Not Started</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      {/* Search and Filters */}
      {showFilters && (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search modules..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ListFilter size={16} />
                  Category
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  {categories.map(category => (
                    <DropdownMenuItem 
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-primary/10" : ""}
                    >
                      {category === 'Coding Basics' && <Code className="mr-2 h-4 w-4" />}
                      {category === 'Web Development' && <Globe className="mr-2 h-4 w-4" />}
                      {category === 'Game Development' && <Gamepad2 className="mr-2 h-4 w-4" />}
                      {category === 'UI/UX Design' && <PenTool className="mr-2 h-4 w-4" />}
                      {category === 'Artificial Intelligence' && <Zap className="mr-2 h-4 w-4" />}
                      {category === 'Digital Art' && <PenTool className="mr-2 h-4 w-4" />}
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <GraduationCap size={16} />
                  Level
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  {levels.map(level => (
                    <DropdownMenuItem 
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={selectedLevel === level ? "bg-primary/10" : ""}
                    >
                      {level === 'Beginner' && <BookOpen className="mr-2 h-4 w-4" />}
                      {level === 'Intermediate' && <Code className="mr-2 h-4 w-4" />}
                      {level === 'Advanced' && <Flame className="mr-2 h-4 w-4" />}
                      {level}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {(selectedCategory || selectedLevel || searchQuery) && (
              <Button variant="ghost" onClick={clearFilters} className="text-gray-500">
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Active Filters */}
      {(selectedCategory || selectedLevel) && (
        <div className="flex gap-2 mb-4">
          {selectedCategory && (
            <Badge variant="outline" className="flex items-center gap-1">
              {selectedCategory}
              <button 
                onClick={() => setSelectedCategory(null)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </Badge>
          )}
          
          {selectedLevel && (
            <Badge variant="outline" className="flex items-center gap-1">
              {selectedLevel}
              <button 
                onClick={() => setSelectedLevel(null)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
      
      {/* Modules Grid */}
      {filteredModules.length > 0 ? (
        <motion.div 
          className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredModules.map(module => (
            <ModuleCard 
              key={module.id} 
              module={module} 
              variant={compact ? 'compact' : 'default'} 
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <LayoutGrid className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No modules found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters or search criteria
          </p>
          <Button variant="outline" onClick={clearFilters} className="mt-4">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModulesGrid;

function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}