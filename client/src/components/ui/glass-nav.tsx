import React, { useState } from 'react';
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
  PanelLeftClose
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/components/ui/supabase-provider';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navigation: NavItem[] = [
  { name: 'Home', path: '/home', icon: <Home className="h-4 w-4 mr-2" /> },
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
  { name: 'Learn', path: '/learning', icon: <BookOpen className="h-4 w-4 mr-2" /> },
  { name: 'Trainers', path: '/trainers', icon: <Users className="h-4 w-4 mr-2" /> },
  { name: 'Techies', path: '/cohorts', icon: <UserPlus className="h-4 w-4 mr-2" /> },
  { name: 'ACHIEVERS', path: '/achievers', icon: <Award className="h-4 w-4 mr-2" /> },
  { name: 'Gallery', path: '/gallery', icon: <GalleryVertical className="h-4 w-4 mr-2" /> },
  { name: 'Join Our Team', path: '/join', icon: <UserPlus className="h-4 w-4 mr-2" />, roles: ['admin', 'freelancer'] },
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
  const [splatterEffects, setSplatterEffects] = useState<{id: number, path: string, position: {x: number, y: number}}[]>([]);
  const splatterCounter = React.useRef(0);
  const { user } = useSupabase();
  
  const isAdmin = user?.role === 'admin';
  const isFreelancer = user?.role === 'freelancer';

  const handleNavClick = (path: string, e: React.MouseEvent) => {
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

  // Filter navigation based on user roles
  const filteredNavigation = navigation.filter(item => {
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
            
            {/* Universal Home Button */}
            <Link href="/home">
              <div className="px-3 py-1 rounded-md text-sm font-medium bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all duration-300 transform hover:scale-105 flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Home
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-1">
            {filteredNavigation.map((item) => {
              const isActive = location === item.path;
              const splatter = splatterEffects.find(s => s.path === item.path);
              
              return (
                <div key={item.path} className="relative">
                  <Link href={item.path}>
                    <div
                      onClick={(e) => handleNavClick(item.path, e)}
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
                </div>
              );
            })}
            
            {visibleAdminLinks.map((item) => (
              <div key={item.path} className="relative">
                <Link href={item.path}>
                  <div
                    onClick={(e) => handleNavClick(item.path, e)}
                    className={cn(
                      "relative overflow-hidden px-3 py-2 rounded-md text-sm font-medium cursor-pointer",
                      "bg-red-500/10 backdrop-blur-md border border-red-500/20",
                      "hover:bg-red-500/20 hover:border-red-500/40",
                      "transform hover:scale-105 hover:rotate-1 transition-all duration-300",
                      location === item.path 
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
            ))}
            
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
          {/* Universal Home Button for Mobile */}
          <Link href="/home">
            <div className="block px-3 py-2 rounded-md text-base font-medium bg-primary/10 border-l-2 border-primary/30 text-primary cursor-pointer mb-2">
              <span className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Home
              </span>
            </div>
          </Link>
          {filteredNavigation.map((item) => {
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <div
                  onClick={(e) => handleNavClick(item.path, e)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium cursor-pointer",
                    isActive
                      ? "text-primary bg-primary/10 border-l-2 border-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
          
          {visibleAdminLinks.map((item) => (
            <Link key={item.path} href={item.path}>
              <div
                onClick={(e) => handleNavClick(item.path, e)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium cursor-pointer",
                  location === item.path
                    ? "text-red-500 bg-red-500/10 border-l-2 border-red-500"
                    : "text-foreground/70 hover:text-foreground hover:bg-background/50"
                )}
              >
                <span className="flex items-center">
                  {item.icon}
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
          
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