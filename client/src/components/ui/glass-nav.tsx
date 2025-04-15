import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Home, 
  Users, 
  BookOpen, 
  Award, 
  Settings, 
  Menu, 
  X,
  UserPlus,
  GalleryVertical,
  LayoutDashboard,
  FileText,
  ExternalLink,
  PanelLeftClose,
  ChevronDown,
  Globe,
  Users2,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/components/ui/supabase-provider';

interface NavItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  roles?: string[];
  children?: NavItem[];
  isDropdown?: boolean;
}

// Main navigation structure with dropdowns
const navigation: NavItem[] = [
  { 
    name: 'Dashboard', 
    icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    isDropdown: true,
    children: [
      { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
      { name: 'Gallery', path: '/gallery', icon: <GalleryVertical className="h-4 w-4 mr-2" /> },
      { name: 'Learn', path: '/learning', icon: <BookOpen className="h-4 w-4 mr-2" /> },
      { name: 'Join Our Team', path: '/join', icon: <UserPlus className="h-4 w-4 mr-2" />, roles: ['admin', 'freelancer'] },
    ]
  },
  { 
    name: 'Community', 
    icon: <Users2 className="h-4 w-4 mr-2" />,
    isDropdown: true,
    children: [
      { name: 'Trainers', path: '/trainers', icon: <Users className="h-4 w-4 mr-2" /> },
      { name: 'Techies', path: '/cohorts', icon: <Globe className="h-4 w-4 mr-2" /> },
      { name: 'ACHIEVERS', path: '/achievers', icon: <Award className="h-4 w-4 mr-2" /> },
    ]
  },
  { name: 'Code Playground', path: '/code-playground', icon: <Code className="h-4 w-4 mr-2" /> },
  { name: 'Apply to Teach', path: '/register', icon: <UserPlus className="h-4 w-4 mr-2" /> },
];

const adminLinks: NavItem[] = [
  { name: 'Admin Dashboard', path: '/admin', icon: <PanelLeftClose className="h-4 w-4 mr-2" />, roles: ['admin'] },
];

// Splatter effect component
const SplatterEffect = ({ startPosition }: { 
  startPosition: { x: number, y: number }
}) => {
  // Colorful splatter for navigation
  const splatterColors = [
    'rgba(62, 198, 224, 0.6)',  // nurd blue
    'rgba(106, 47, 248, 0.6)',  // nurd purple
    'rgba(255, 138, 0, 0.6)',   // nurd orange
    'rgba(61, 224, 83, 0.6)',   // nurd green
  ];
  
  const randomColor = splatterColors[Math.floor(Math.random() * splatterColors.length)];
  
  return (
    <motion.div
      initial={{ opacity: 1, scale: 0, x: startPosition.x, y: startPosition.y }}
      animate={{ opacity: 0, scale: 3 }}
      transition={{ duration: 0.6 }}
      className="absolute pointer-events-none z-10"
      style={{
        background: `radial-gradient(circle, ${randomColor} 0%, transparent 70%)`,
        width: '40px',
        height: '40px',
        borderRadius: '50%'
      }}
    />
  );
};

export const GlassNav: React.FC = () => {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [splatterEffects, setSplatterEffects] = useState<{id: number, path: string, position: {x: number, y: number}}[]>([]);
  const splatterCounter = React.useRef(0);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { user } = useSupabase();
  
  const isAdmin = user?.role === 'admin';
  const isFreelancer = user?.role === 'freelancer';

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.entries(dropdownRefs.current).forEach(([key, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdowns(prev => ({...prev, [key]: false}));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper to safely handle paths
  const ensurePath = (path: string | undefined): string => {
    return path || '/';
  };

  const handleNavClick = (path: string | undefined, e: React.MouseEvent) => {
    if (!path) return; // Skip for dropdown parent items
    
    // Don't add splatter if already on this page
    if (location === path) return;
    
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add a new splatter effect
    setSplatterEffects(prev => [
      ...prev,
      { id: splatterCounter.current++, path, position: { x, y } }
    ]);
    
    // Clean up old splatter effects
    if (splatterEffects.length > 5) {
      setTimeout(() => {
        setSplatterEffects(prev => prev.slice(1));
      }, 100);
    }
    
    // Close mobile menu if it's open
    if (isMobile && isOpen) {
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  const toggleDropdown = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Filter navigation based on user roles
  const filteredNavigation = navigation.map(item => {
    if (item.children) {
      return {
        ...item,
        children: item.children.filter(child => {
          if (!child.roles) return true;
          if (isAdmin) return true;
          if (isFreelancer && child.roles.includes('freelancer')) return true;
          return false;
        })
      };
    }
    return item;
  }).filter(item => {
    // If it's a dropdown, only include if it has visible children
    if (item.isDropdown && item.children) {
      return item.children.length > 0;
    }
    // For regular items
    if (!item.roles) return true;
    if (isAdmin) return true;
    if (isFreelancer && item.roles.includes('freelancer')) return true;
    return false;
  });

  const visibleAdminLinks = isAdmin ? adminLinks : [];
  
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/70 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <span className="text-xl font-bold text-primary">NURD</span>
              </div>
            </Link>
            
            {/* NURD logo is now the universal home button, no additional home button needed */}
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-1">
            {filteredNavigation.map((item, index) => {
              // For dropdown items
              if (item.isDropdown) {
                const isParentActive = item.children?.some(child => location === child.path);
                const isOpen = openDropdowns[item.name] || false;
                
                return (
                  <div 
                    key={`dropdown-${index}`} 
                    className="relative"
                    ref={el => dropdownRefs.current[item.name] = el}
                  >
                    <div
                      onClick={(e) => toggleDropdown(item.name, e)}
                      className={cn(
                        "relative overflow-hidden px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer",
                        "bg-background/20 backdrop-blur-md border border-border/10",
                        "hover:bg-primary/10 hover:border-primary/30",
                        "transform hover:scale-105 hover:rotate-1 flex items-center space-x-1",
                        isParentActive || isOpen
                          ? "text-primary border-primary/40 bg-primary/10" 
                          : "text-foreground/70 hover:text-foreground"
                      )}
                    >
                      <span className="flex items-center">
                        {item.icon}
                        {item.name}
                      </span>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen ? "rotate-180" : ""
                      )} />
                    </div>
                    
                    {/* Dropdown Menu */}
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white/80 backdrop-blur-md ring-1 ring-black ring-opacity-5 z-50"
                      >
                        <div className="py-1 divide-y divide-gray-200/50">
                          {item.children?.map((child, childIndex) => {
                            const isChildActive = location === child.path;
                            
                            return (
                              <Link key={`${child.path}-${childIndex}`} href={ensurePath(child.path)}>
                                <div
                                  onClick={(e) => handleNavClick(ensurePath(child.path), e)}
                                  className={cn(
                                    "px-4 py-2 text-sm flex items-center hover:bg-primary/10 transition-colors",
                                    isChildActive ? "text-primary font-medium" : "text-gray-700"
                                  )}
                                >
                                  {child.icon}
                                  <span className="ml-2">{child.name}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              }
              
              // For regular items
              const isActive = location === item.path;
              const splatter = splatterEffects.find(s => s.path === item.path);
              
              return (
                <div key={`item-${index}`} className="relative">
                  {item.path && (
                    <Link href={item.path}>
                      <div
                        onClick={(e) => handleNavClick(ensurePath(item.path), e)}
                        className={cn(
                          "relative overflow-hidden px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer",
                          "bg-background/20 backdrop-blur-md border border-border/10",
                          "hover:bg-primary/10 hover:border-primary/30",
                          "transform hover:scale-105 hover:rotate-1",
                          isActive 
                            ? "text-primary border-primary/40 bg-primary/10" 
                            : "text-foreground/70 hover:text-foreground"
                        )}
                      >
                        <span className="flex items-center">
                          {item.icon}
                          {item.name}
                        </span>
                        
                        {/* Conditional bottom border for active state */}
                        {isActive && (
                          <motion.div 
                            layoutId="activeNavIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        
                        {/* Splatter effect */}
                        {splatter && (
                          <SplatterEffect startPosition={splatter.position} />
                        )}
                      </div>
                    </Link>
                  )}
                </div>
              );
            })}
            
            {visibleAdminLinks.map((item, index) => {
              if (!item.path) return null;
              const isActive = location === item.path;
              
              return (
                <div key={`admin-${index}`} className="relative">
                  <Link href={item.path}>
                    <div
                      onClick={(e) => handleNavClick(ensurePath(item.path), e)}
                      className={cn(
                        "relative overflow-hidden px-3 py-2 rounded-md text-sm font-medium cursor-pointer",
                        "bg-red-500/10 backdrop-blur-md border border-red-500/20",
                        "hover:bg-red-500/20 hover:border-red-500/40",
                        "transform hover:scale-105 hover:rotate-1 transition-all duration-300",
                        isActive 
                          ? "text-red-500 border-red-500/40 bg-red-500/10" 
                          : "text-foreground/70 hover:text-foreground"
                      )}
                    >
                      <span className="flex items-center">
                        {item.icon}
                        {item.name}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
            
            {user ? (
              <Link href="/settings">
                <div className="ml-2 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
              </Link>
            ) : (
              <Link href="/auth">
                <div className="ml-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer">
                  Sign In
                </div>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button 
              variant="ghost" 
              onClick={() => setIsOpen(!isOpen)}
              className="relative inline-flex items-center justify-center rounded-md p-2"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={cn("sm:hidden", isOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 backdrop-blur-md bg-background/95 border-b border-border/20">
          {/* Home button for mobile navigation */}
          <Link href="/home">
            <div className="block px-3 py-2 rounded-md text-base font-medium bg-primary/10 border-l-2 border-primary/30 text-primary cursor-pointer mb-2">
              <span className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Home
              </span>
            </div>
          </Link>
          
          {filteredNavigation.map((item, index) => {
            // For dropdown items on mobile
            if (item.isDropdown) {
              const isOpen = openDropdowns[item.name] || false;
              const isParentActive = item.children?.some(child => location === child.path);
              
              return (
                <div key={`mobile-dropdown-${index}`} className="mb-1">
                  <div
                    onClick={(e) => toggleDropdown(item.name, e)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md text-base font-medium cursor-pointer",
                      isParentActive
                        ? "text-primary bg-primary/10 border-l-2 border-primary"
                        : "text-foreground/70 hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    <span className="flex items-center">
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isOpen ? "rotate-180" : ""
                    )} />
                  </div>
                  
                  {/* Mobile dropdown content */}
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 mt-1 space-y-1"
                    >
                      {item.children?.map((child, childIndex) => {
                        const isChildActive = location === child.path;
                        if (!child.path) return null;
                        
                        return (
                          <Link key={`mobile-child-${childIndex}`} href={child.path}>
                            <div
                              onClick={(e) => handleNavClick(ensurePath(child.path), e)}
                              className={cn(
                                "block px-3 py-2 rounded-md text-sm font-medium cursor-pointer",
                                isChildActive
                                  ? "text-primary bg-primary/10 border-l-2 border-primary"
                                  : "text-foreground/70 hover:text-foreground hover:bg-background/20"
                              )}
                            >
                              <span className="flex items-center">
                                {child.icon}
                                <span className="ml-2">{child.name}</span>
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              );
            }
            
            // For regular items
            if (!item.path) return null;
            const isActive = location === item.path;
            
            return (
              <Link key={`mobile-item-${index}`} href={item.path}>
                <div
                  onClick={(e) => handleNavClick(ensurePath(item.path), e)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium cursor-pointer",
                    isActive
                      ? "text-primary bg-primary/10 border-l-2 border-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <span className="flex items-center">
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </span>
                </div>
              </Link>
            );
          })}
          
          {visibleAdminLinks.map((item, index) => {
            if (!item.path) return null;
            const isActive = location === item.path;
            
            return (
              <Link key={`mobile-admin-${index}`} href={item.path}>
                <div
                  onClick={(e) => handleNavClick(ensurePath(item.path), e)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium cursor-pointer",
                    isActive
                      ? "text-red-500 bg-red-500/10 border-l-2 border-red-500"
                      : "text-foreground/70 hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <span className="flex items-center">
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </span>
                </div>
              </Link>
            );
          })}
          
          {user ? (
            <Link href="/settings">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-foreground hover:bg-background/50 cursor-pointer">
                <span className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </span>
              </div>
            </Link>
          ) : (
            <Link href="/auth">
              <div className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground cursor-pointer">
                <span className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Sign In
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};