import React, { useEffect, useState, Suspense } from "react";
import { Switch, Route, Link } from "wouter";
import { motion } from "framer-motion";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { AdminProtectedRoute } from "@/lib/admin-protected-route";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ThemeProvider } from "@/providers/theme-provider";
import { ColorSchemeProvider } from "@/providers/color-scheme-provider";
import { UserPreferencesProvider } from "@/providers/user-preferences-provider";
import { PageTransition } from "@/components/animations/page-transition";
import MagicCursor from "@/components/ui/magic-cursor";
import { ApplyModal } from "@/components/ui/apply-modal";
import { useCursorInteraction } from "@/hooks/use-cursor-interaction";
import Favicon from "@/components/ui/Favicon";
import UpdateNotification from "@/components/ui/update-notification";
import OrientationAlert from "@/components/ui/orientation-alert";
import { VERSION } from "@/version";
import { UserPlus, Calendar, User, MapPin, RefreshCw, RotateCcw } from "lucide-react";
import { GlassNav } from "@/components/ui/glass-nav";
import { ComingSoon } from "@/components/ui/coming-soon";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import About from "@/pages/About";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Trainers from "@/pages/Trainers";
import Gallery from "@/pages/Gallery";
import AdminDashboard from "@/pages/AdminDashboard";
import Learning from "@/pages/Learning";
import ProfileSettings from "@/pages/ProfileSettings";
import JoinOurTeam from "@/pages/Join-Our-Team";
import Cohorts from "@/pages/Cohorts";
import AuthPage from "@/pages/auth-page";
import DiscordConnect from "@/pages/DiscordConnect";
import AvatarCreator from "@/pages/AvatarCreator";
import Achievers from "@/pages/Achievers";
import UserProgress from "@/pages/UserProgress";
import AICodeTools from "@/pages/AICodeTools";
import CodeTools from "@/pages/CodeTools";
import Payment from "@/pages/Payment";
import SkillMarketplace from "@/pages/SkillMarketplace";
import ModuleDetail from "@/pages/ModuleDetail";
import AICourseCreator from "@/pages/AICourseCreator";
import Reinvestment from "@/pages/reinvestment";
import CreateCourse from "@/pages/create-course";
import AccessAI from "@/pages/AccessAI";
import ModelTest from "@/pages/ModelTest";
import ImageLocker from "@/pages/ImageLocker";
import SubscriptionPlans from "@/pages/SubscriptionPlans";
import Checkout from "@/pages/Checkout";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import LandingPage from "@/pages/LandingPage";
import Account from "@/pages/Account";
import NurdInitiative from "@/pages/NurdInitiative";
import AdvancedCheckout from "@/pages/AdvancedCheckout";
import { useIsMobile } from "@/hooks/use-mobile";
import { LayoutDashboard, Send } from "lucide-react";

// Lazy load code playground and V.I.B.E. (Vibe Interactive Build Environment)
const CodePlayground = React.lazy(() => import("@/pages/code-playground"));
const VIBEPage = React.lazy(() => import("@/pages/VIBE"));

// Import NURD skateboard image
import nurdSkateboardImg from "./assets/nurd-skateboard.png";
// New skateboard image from Pooler
import nurdSkateboardPoolerImg from "@assets/nurd-skateboard-pooler.png";
// Made in Pooler image
import madeInPoolerImg from "./assets/made-in-pooler.png";
// Made in Pooler green logo
import madeInPoolerGreenImg from "./assets/made-in-pooler-green.png";
// Import BetaStamp component instead of using image
import { BetaStamp } from "@/components/BetaStamp";

// Simple component for initial testing - updated with glass UI
const TestComponent = () => {
  // State for the animated counters
  const [joinedCount, setJoinedCount] = useState(0);
  const [createdCount, setCreatedCount] = useState(0);
  
  // Animation for counters
  useEffect(() => {
    const joinedInterval = setInterval(() => {
      setJoinedCount(prev => {
        if (prev < 120) return prev + 1;
        clearInterval(joinedInterval);
        return prev;
      });
    }, 50);
    
    const createdInterval = setInterval(() => {
      setCreatedCount(prev => {
        if (prev < 87) return prev + 1;
        clearInterval(createdInterval);
        return prev;
      });
    }, 70);
    
    return () => {
      clearInterval(joinedInterval);
      clearInterval(createdInterval);
    };
  }, []);
  
  // Format counter to ensure 4 digits with leading zeros
  const formatCounter = (count: number) => {
    return count.toString().padStart(4, '0');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="glass-container max-w-4xl mx-auto text-center p-8 rounded-2xl shadow-xl backdrop-blur-md border border-white/20">
        <motion.h1 
          className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-600 animate-gradient-x mb-3 inline-block cursor-pointer"
          data-cursor-text="Welcome to NURD!"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.1
          }}
        >
          NURD by: ACHIEVEMOR
        </motion.h1>
        <motion.p 
          className="text-gray-600 text-xl max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.3
          }}
        >
          Empowering youth through innovative tech education
        </motion.p>
        
        <div className="flex gap-6">
          {/* Left Stats Panel */}
          <motion.div 
            className="w-[200px] flex flex-col h-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col h-full px-4 py-5 glass-card rounded-lg border border-white/20 shadow-lg">
              {/* Top Section - NURDs Joined */}
              <motion.div
                className="mb-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <h3 className="text-sm font-bold text-white/90 mb-2">NURDs Joined</h3>
                <div className="flex items-center">
                  <motion.div 
                    className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {formatCounter(joinedCount)}
                  </motion.div>
                  <motion.span 
                    className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md"
                    animate={{ 
                      scale: [1, 1.15, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      repeatType: "reverse",
                      ease: "easeInOut" 
                    }}
                  >
                    Active
                  </motion.span>
                </div>
              </motion.div>
              
              {/* Middle Section - NURDs Created */}
              <motion.div
                className="mb-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <h3 className="text-sm font-bold text-white/90 mb-2">NURDs Created</h3>
                <div className="flex items-center">
                  <motion.div 
                    className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {formatCounter(createdCount)}
                  </motion.div>
                  <motion.span 
                    className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md"
                    animate={{ 
                      scale: [1, 1.15, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    Graduates
                  </motion.span>
                </div>
              </motion.div>
              
              {/* Bottom Section - Upcoming Cohort Info */}
              <motion.div
                className="mt-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <h3 className="text-sm font-bold text-white/90 mb-2">Upcoming Cohort</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-white/90">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">TBD</span>
                  </div>
                  <div className="flex items-center text-white/90">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">TBD</span>
                  </div>
                  <div className="flex items-center text-white/90">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">TBD</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Central Hero Image - Keep all original properties unchanged */}
          <motion.div 
            className="relative group flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg blur"
              initial={{ opacity: 0.25 }}
              whileHover={{ opacity: 0.75, transition: { duration: 0.3 } }}
              animate={{ 
                opacity: [0.25, 0.35, 0.25],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
            <div className="relative p-1 bg-white rounded-lg">
              <div className="p-5 glass-card overflow-hidden rounded-lg relative">
                <motion.img 
                  src={madeInPoolerImg} 
                  alt="NURD Made in Pooler, GA" 
                  className="mx-auto max-h-[500px] rounded-lg shadow-lg cursor-pointer"
                  data-cursor-text="Made in Pooler, GA"
                  whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                  initial={{ scale: 1, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                />
                

              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <motion.a 
            href="/auth" 
            className="glass-button flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-blue-500/30 px-5 py-3 rounded-lg shadow-md cursor-pointer"
            data-cursor-text="Sign in or create an account"
            whileHover={{ y: -4, scale: 1.05, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-semibold">Login / Register</span>
          </motion.a>
          <motion.a 
            href="/code-playground" 
            className="glass-button flex items-center space-x-2 bg-gradient-to-r from-green-600/20 to-teal-600/20 border-green-500/30 px-5 py-3 rounded-lg shadow-md cursor-pointer"
            data-cursor-text="Try our interactive code editor"
            whileHover={{ y: -4, scale: 1.05, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span className="font-semibold">Code Playground</span>
          </motion.a>
          
          <motion.a 
            href="/vibe" 
            className="glass-button flex items-center space-x-2 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border-cyan-500/30 px-5 py-3 rounded-lg shadow-md cursor-pointer"
            data-cursor-text="Advanced AI-powered coding environment"
            whileHover={{ y: -4, scale: 1.05, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2c1.4 0 2.8 1.1 2.9 2.4a2.5 2.5 0 0 0 3.5 2 3 3 0 0 1 3.9 3.9 2.5 2.5 0 0 0 2 3.5 2.9 2.9 0 0 1 0 5.8 2.5 2.5 0 0 0-2 3.5 3 3 0 0 1-3.9 3.9 2.5 2.5 0 0 0-3.5 2 2.9 2.9 0 0 1-5.8 0 2.5 2.5 0 0 0-3.5-2 3 3 0 0 1-3.9-3.9 2.5 2.5 0 0 0-2-3.5 2.9 2.9 0 0 1 0-5.8 2.5 2.5 0 0 0 2-3.5 3 3 0 0 1 3.9-3.9 2.5 2.5 0 0 0 3.5-2A2.9 2.9 0 0 1 12 2"></path>
              <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
            </svg>
            <span className="font-semibold">V.I.B.E.</span>
          </motion.a>

          <motion.a 
            href="/achievers" 
            className="glass-button flex items-center space-x-2 bg-gradient-to-r from-orange-600/20 to-amber-600/20 border-orange-500/30 px-5 py-3 rounded-lg shadow-md cursor-pointer"
            data-cursor-text="Join our ACHIEVERS program!"
            whileHover={{ y: -4, scale: 1.05, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
            <span className="font-semibold">ACHIEVERS</span>
          </motion.a>
        </div>
      </div>
    </div>
  );
};

// Content component wrapped by AuthProvider
const AppContent = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const [isCursorEnabled, setIsCursorEnabled] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    // Load cursor preference from localStorage
    const savedPreference = localStorage.getItem('magic-cursor-enabled');
    if (savedPreference !== null) {
      setIsCursorEnabled(savedPreference === 'true');
    }
  }, []);

  // Toggle cursor function
  const toggleCursor = () => {
    const newValue = !isCursorEnabled;
    setIsCursorEnabled(newValue);
    localStorage.setItem('magic-cursor-enabled', String(newValue));
  };

  useEffect(() => {
    if (!authLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  }, [authLoading]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-12 w-48 bg-primary/10 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-[100vw] overflow-x-hidden pb-14">
      {isCursorEnabled && <MagicCursor />}
      <OrientationAlert />
      <GlassNav />
      
      {/* Cursor toggle button */}
      <motion.button 
        onClick={toggleCursor}
        className="fixed bottom-20 md:bottom-4 right-4 z-50 p-2 bg-black/20 backdrop-blur-md rounded-full"
        whileHover={{ 
          scale: 1.2, 
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          rotate: [0, -10, 10, -5, 0],
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: isCursorEnabled 
            ? ["0 0 0 0 rgba(14, 165, 233, 0)", "0 0 0 4px rgba(14, 165, 233, 0.3)", "0 0 0 0 rgba(14, 165, 233, 0)"] 
            : "none"
        }}
        transition={{ 
          duration: 2,
          repeat: isCursorEnabled ? Infinity : 0,
          repeatType: "loop"
        }}
        title={isCursorEnabled ? "Disable custom cursor" : "Enable custom cursor"}
      >
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={isCursorEnabled ? "text-primary" : "text-gray-400"}
          animate={isCursorEnabled ? { 
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ 
            duration: 1.5, 
            repeat: isCursorEnabled ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          <path d="m3 3 7 7"></path>
          <path d="m21 21-7-7"></path>
          <path d="M11 4 7 20l4-1 1 4 4-16-4 1-1-4z"></path>
        </motion.svg>
      </motion.button>
      
      {/* Apply Now button fixed at bottom right */}
      <motion.button 
        onClick={() => setIsApplyModalOpen(true)}
        className="fixed bottom-20 md:bottom-4 right-20 z-50 px-4 py-2 bg-primary text-white font-bold rounded-full shadow-lg flex items-center space-x-2"
        data-cursor-text="Start your journey!"
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 0 15px rgba(14, 165, 233, 0.5)"
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 400,
          damping: 15
        }}
      >
        <motion.span
          animate={{ rotate: [0, 10, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse", 
            ease: "easeInOut" 
          }}
        >
          <UserPlus className="h-5 w-5" />
        </motion.span>
        <span>Apply Now</span>
      </motion.button>
      
      {/* Apply modal */}
      <ApplyModal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)} 
      />
      
      {/* Floating BETA disclaimer stamp */}
      <BetaStamp />
      
      <main className="flex-grow w-full max-w-[100vw] overflow-x-hidden px-2 sm:px-4">
        <PageTransition>
          <Switch>
            <Route path="/" component={TestComponent} />
            <Route path="/about" component={About} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/trainers" component={Trainers} />
            <Route path="/gallery" component={Gallery} />
            <AdminProtectedRoute path="/admin" component={AdminDashboard} />
            <Route path="/partners" component={Learning} />
            <Route path="/partners/create" component={AICourseCreator} />
            <Route path="/partners/:id" component={ModuleDetail} />
            <Route path="/learning" component={Learning} />
            <Route path="/learn" component={Learning} />
            <Route path="/subscription-plans" component={SubscriptionPlans} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/checkout-success" component={CheckoutSuccess} />
            <Route path="/bootcamp" component={LandingPage} />
            <Route path="/settings" component={ProfileSettings} />
            <Route path="/join" component={JoinOurTeam} />
            <Route path="/apply" component={JoinOurTeam} />
            <Route path="/cohorts" component={Cohorts} />
            <Route path="/discord" component={DiscordConnect} />
            <Route path="/avatar" component={AvatarCreator} />
            <Route path="/home" component={Landing} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/achievers" component={Achievers} />
            <Route path="/access-ai" component={AccessAI} />
            {/* AI Code Tools page hidden for now - functionality under development 
            <Route path="/ai-code-tools" component={AICodeTools} /> */}
            <Route path="/code-tools" component={CodeTools} />
            <Route path="/payment" component={Payment} />
            <Route path="/progress" component={UserProgress} />
            <Route path="/skill-marketplace" component={SkillMarketplace} />
            <Route path="/reinvestment" component={Reinvestment} />
            <Route path="/create-course" component={CreateCourse} />
            <AdminProtectedRoute path="/model-test" component={ModelTest} />
            <AdminProtectedRoute path="/image-locker" component={ImageLocker} />
            
            {/* Initiative pages */}
            <Route path="/summer-initiative" component={NurdInitiative} />
            <Route path="/weekend-workshops">
              <ComingSoon title="Weekend Workshops" description="Hands-on weekend workshops focused on tech and creativity coming soon!" />
            </Route>
            <Route path="/school-programs">
              <ComingSoon title="School Programs" description="NURD School Programs will be available soon. Learn how we're bringing tech education to schools." />
            </Route>
            <Route path="/online-learning">
              <ComingSoon title="Online Learning" description="Self-paced online learning experiences are being developed. Stay tuned!" />
            </Route>
            <Route path="/resources">
              <ComingSoon title="Resources" description="A comprehensive collection of learning resources for students and educators coming soon." />
            </Route>
            <Route path="/parent-guide">
              <ComingSoon title="Parent Guide" description="Information for parents on how to support their child's learning journey in tech." />
            </Route>
            <Route path="/student-resources">
              <ComingSoon title="Student Resources" description="Student-focused resources and learning materials coming soon." />
            </Route>
            <Route path="/scholarships">
              <ComingSoon title="Scholarships" description="Information about our scholarship programs and how to apply will be available soon." />
            </Route>
            <Route path="/faq">
              <ComingSoon title="Frequently Asked Questions" description="Answers to common questions about NURD programs and opportunities." />
            </Route>
            
            {/* Interactive Code Playground */}
            <Route path="/code-playground">
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <CodePlayground />
              </Suspense>
            </Route>
            
            <Route path="/vibe">
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <VIBEPage />
              </Suspense>
            </Route>
            
            <Route component={NotFound} />
          </Switch>
        </PageTransition>
      </main>
      
      {/* Desktop Footer */}
      {!isMobile && (
        <motion.footer 
          className="py-4 px-6 text-center text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <motion.p 
              className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-green-500 to-blue-600 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              NURD = Naturally Unstoppable Resourceful Dreamers
            </motion.p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
              <motion.span 
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <motion.span 
                  className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-400 to-green-500 mr-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                ></motion.span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-green-500 to-blue-600 font-medium">
                  Creativity First
                </span>
              </motion.span>
              <motion.span 
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                <motion.span 
                  className="h-2 w-2 rounded-full bg-gradient-to-r from-green-500 to-blue-600 mr-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
                ></motion.span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-green-500 to-blue-600 font-medium">
                  AI Collaboration
                </span>
              </motion.span>
              <motion.span 
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.3 }}
              >
                <motion.span 
                  className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-400 to-blue-600 mr-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.6 }}
                ></motion.span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-green-500 to-blue-600 font-medium">
                  Community Building
                </span>
              </motion.span>
            </div>
            <motion.div 
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.4, type: "spring" }}
            >
              <motion.img 
                src={madeInPoolerGreenImg} 
                alt="Made in Pooler, GA" 
                className="h-16 object-contain"
                whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
            
            {/* Version indicator */}
            <motion.div
              className="flex items-center justify-center mt-2 text-xs text-muted-foreground/70 cursor-pointer group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              onClick={() => window.location.reload()}
              title="Click to refresh application"
            >
              <RefreshCw className="h-3 w-3 mr-1 group-hover:text-primary group-hover:animate-spin" />
              <span>Version {VERSION.number} <span className="hidden sm:inline-block">({VERSION.name})</span></span>
            </motion.div>
          </div>
        </motion.footer>
      )}
      
      {/* Mobile Footer - Very compact */}
      {isMobile && (
        <motion.footer 
          className="fixed bottom-0 left-0 right-0 py-1 px-2 text-center text-xs bg-background/90 backdrop-blur-sm border-t border-border/30 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <img 
                src={madeInPoolerGreenImg} 
                alt="Made in Pooler, GA" 
                className="h-10 object-contain"
              />
            </motion.div>
            
            <div className="flex flex-col items-end">
              <motion.p 
                className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-green-500 to-blue-600 font-medium text-2xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                NURD = Naturally Unstoppable Resourceful Dreamers
              </motion.p>
              
              {/* Version indicator */}
              <motion.div
                className="flex items-center justify-center text-2xs text-muted-foreground/70 cursor-pointer group mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                onClick={() => window.location.reload()}
                title="Click to refresh application"
              >
                <RefreshCw className="h-2 w-2 mr-1 group-hover:text-primary group-hover:animate-spin" />
                <span>v{VERSION.number}</span>
              </motion.div>
            </div>
          </div>
        </motion.footer>
      )}
    </div>
  );
};

// Main App component that provides auth context
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <UserPreferencesProvider>
            <ColorSchemeProvider>
              <Favicon />
              <AppContent />
              <UpdateNotification />
              <Toaster />
            </ColorSchemeProvider>
          </UserPreferencesProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;