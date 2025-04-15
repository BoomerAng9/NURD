import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import {
  Home,
  BookOpen,
  Users,
  Image,
  Award,
  User,
  Settings,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  isNew?: boolean;
  adminOnly?: boolean;
}

interface AnimatedMenuProps {
  className?: string;
}

const AnimatedMenu: React.FC<AnimatedMenuProps> = ({ className }) => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Simulate an admin user check
  const isAdmin = user?.user_type === 'admin';
  
  const menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/'
    },
    {
      label: 'Dashboard',
      icon: <Award className="h-5 w-5" />,
      href: '/dashboard'
    },
    {
      label: 'Learning Modules',
      icon: <BookOpen className="h-5 w-5" />,
      href: '/learning',
      isNew: true
    },
    {
      label: 'Trainers',
      icon: <Users className="h-5 w-5" />,
      href: '/trainers'
    },
    {
      label: 'Gallery',
      icon: <Image className="h-5 w-5" />,
      href: '/gallery'
    },
    {
      label: 'Profile Settings',
      icon: <User className="h-5 w-5" />,
      href: '/profile/settings'
    },
    {
      label: 'Admin Panel',
      icon: <ShieldCheck className="h-5 w-5" />,
      href: '/admin',
      adminOnly: true
    }
  ];
  
  const filteredItems = menuItems.filter(item => !item.adminOnly || (item.adminOnly && isAdmin));
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleLogout = () => {
    try {
      logoutMutation.mutate();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const menuVariants = {
    collapsed: {
      width: "60px",
      transition: {
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    expanded: {
      width: "220px",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
        staggerDirection: 1
      }
    }
  };
  
  const itemVariants = {
    collapsed: {
      opacity: 0,
      x: -10,
      display: "none",
      transition: {
        duration: 0.2
      }
    },
    expanded: {
      opacity: 1,
      x: 0,
      display: "block",
      transition: {
        duration: 0.2
      }
    }
  };
  
  const dropletVariants = {
    initial: { 
      y: -10, 
      opacity: 0,
      scale: 0
    },
    animate: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    },
    exit: { 
      y: 10, 
      opacity: 0,
      scale: 0,
      transition: {
        duration: 0.2
      }
    }
  };
  
  const activeItemAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 0.3 }
  };
  
  return (
    <div className={cn("fixed left-4 top-1/2 transform -translate-y-1/2 z-50", className)}>
      <motion.div
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={menuVariants}
        className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col py-4"
        style={{ originX: 0 }}
      >
        <div className="flex items-center px-3 mb-6">
          <button
            onClick={toggleExpand}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 6-6 6 6 6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              )}
            </motion.div>
          </button>
          
          <motion.div 
            variants={itemVariants}
            className="ml-3 font-bold text-lg"
          >
            NURD Menu
          </motion.div>
        </div>
        
        {user ? (
          <div className="mb-6 px-3 flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url || ''} />
              <AvatarFallback>{user.first_name?.charAt(0)?.toUpperCase() || 'N'}</AvatarFallback>
            </Avatar>
            
            <motion.div 
              variants={itemVariants}
              className="ml-3 text-sm font-medium truncate"
            >
              {user.username}
            </motion.div>
          </div>
        ) : null}
        
        <ul className="space-y-1 px-2">
          {filteredItems.map((item) => {
            const isActive = location === item.href;
            
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <motion.div
                    onHoverStart={() => setHoveredItem(item.href)}
                    onHoverEnd={() => setHoveredItem(null)}
                    animate={isActive ? activeItemAnimation : {}}
                    className={cn(
                      "flex items-center p-2 rounded-md cursor-pointer relative overflow-hidden",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-gray-100 text-gray-700"
                    )}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        {item.icon}
                        {item.isNew && (
                          <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2.5 h-2.5" />
                        )}
                      </div>
                      
                      <motion.span 
                        variants={itemVariants}
                        className="ml-3 font-medium"
                      >
                        {item.label}
                        {item.isNew && (
                          <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </motion.span>
                    </div>
                    
                    <AnimatePresence>
                      {hoveredItem === item.href && !isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                          variants={dropletVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
        
        {user && (
          <div className="mt-auto pt-4 px-2">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start p-2 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <motion.span variants={itemVariants} className="ml-3">
                Logout
              </motion.span>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AnimatedMenu;