import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import TrainerCard, { TrainerProfile } from './trainer-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Mock data for trainers
const mockTrainers: TrainerProfile[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    title: 'Game Development Instructor',
    specialties: ['Game Development', 'Unity', 'C#'],
    bio: 'Alex has been teaching game development for over 5 years and has worked on several indie game titles. Passionate about helping students bring their game ideas to life.',
    imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    calendlyUrl: 'https://calendly.com/alexj',
    email: 'alex@nurd.example.com',
    availability: {
      days: ['Mon', 'Wed', 'Fri'],
      hours: '3:00 PM - 8:00 PM'
    }
  },
  {
    id: '2',
    name: 'Maya Patel',
    title: 'Digital Art & Animation Lead',
    specialties: ['Digital Art', 'Animation', 'Character Design'],
    bio: 'Maya is a professional animator with experience working at major animation studios. She specializes in teaching digital art and animation techniques to students of all ages.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80',
    calendlyUrl: 'https://calendly.com/mayap',
    phone: '(555) 123-4567',
    availability: {
      days: ['Tue', 'Thu', 'Sat'],
      hours: '1:00 PM - 6:00 PM'
    }
  },
  {
    id: '3',
    name: 'Jordan Smith',
    title: 'AI & Machine Learning Expert',
    specialties: ['AI', 'Machine Learning', 'Python'],
    bio: 'Jordan has a PhD in Computer Science with a focus on AI. They have worked with several tech companies implementing machine learning solutions and love teaching the next generation of AI developers.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    email: 'jordan@nurd.example.com',
    phone: '(555) 987-6543',
    availability: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      hours: '4:00 PM - 7:00 PM'
    }
  }
];

// Specialty options for filtering
const specialtyOptions = [
  'Game Development',
  'Digital Art',
  'Animation',
  'AI',
  'Machine Learning',
  'Web Development',
  'App Design',
  'Robotics',
  'Unity',
  'C#',
  'Python',
  'Character Design'
];

interface TrainersListProps {
  variant?: 'default' | 'compact';
}

const TrainersList: React.FC<TrainersListProps> = ({ variant = 'default' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  
  // Filter trainers based on search query and selected specialties
  const filteredTrainers = mockTrainers.filter(trainer => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === '' || 
      trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by selected specialties
    const matchesSpecialties = 
      selectedSpecialties.length === 0 ||
      trainer.specialties.some(s => selectedSpecialties.includes(s));
    
    return matchesSearch && matchesSpecialties;
  });

  // Toggle specialty selection
  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search trainers by name, specialty, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              Specialties
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
            {specialtyOptions.map((specialty) => (
              <DropdownMenuCheckboxItem
                key={specialty}
                checked={selectedSpecialties.includes(specialty)}
                onCheckedChange={() => toggleSpecialty(specialty)}
              >
                {specialty}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Selected filters display */}
      {selectedSpecialties.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSpecialties.map(specialty => (
            <div key={specialty} className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {specialty}
              <button 
                onClick={() => toggleSpecialty(specialty)} 
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          ))}
          <button 
            onClick={() => setSelectedSpecialties([])} 
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Clear all
          </button>
        </div>
      )}
      
      {/* Results count */}
      <div className="text-sm text-gray-500">
        {filteredTrainers.length} trainer{filteredTrainers.length !== 1 ? 's' : ''} found
      </div>
      
      {/* Trainers grid */}
      <div className={`grid gap-6 ${
        variant === 'compact' 
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {filteredTrainers.length > 0 ? (
          filteredTrainers.map((trainer) => (
            <TrainerCard 
              key={trainer.id} 
              trainer={trainer} 
              variant={variant}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No trainers found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainersList;