import React, { useEffect, useState, Suspense } from "react";
import { Switch, Route } from "wouter";
import { ProtectedRoute } from "@/lib/protected-route";
import { AdminProtectedRoute } from "@/lib/admin-protected-route";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ThemeProvider } from "@/providers/theme-provider";
import { PageTransition } from "@/components/animations/page-transition";
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
import ACHIEVERS from "@/pages/AchievementDemo";
import UserProgress from "@/pages/UserProgress";
import AICodeTools from "@/pages/AICodeTools";
import SkillMarketplace from "@/pages/SkillMarketplace";
import ModuleDetail from "@/pages/ModuleDetail";
import AICourseCreator from "@/pages/AICourseCreator";
import Reinvestment from "@/pages/reinvestment";
import CreateCourse from "@/pages/create-course";
import { useIsMobile } from "@/hooks/use-mobile";
import { LayoutDashboard, Send } from "lucide-react";

// Lazy load code playground
const CodePlayground = React.lazy(() => import("@/pages/code-playground"));

// Import NURD skateboard image
import nurdSkateboardImg from "./assets/nurd-skateboard.png";
// New skateboard image from Pooler
import nurdSkateboardPoolerImg from "@assets/nurd-skateboard-pooler.png";
// Made in Pooler image
import madeInPoolerImg from "./assets/made-in-pooler.png";
// Made in Pooler green logo
import madeInPoolerGreenImg from "./assets/made-in-pooler-green.png";

// Simple component for initial testing - updated with glass UI
const TestComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="glass-container max-w-4xl mx-auto text-center p-8 rounded-2xl shadow-xl backdrop-blur-md border border-white/20">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-600 animate-gradient-x mb-3">
          NURD by: ACHIEVEMOR
        </h1>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto mb-8">Empowering youth through innovative tech education</p>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative p-1 bg-white rounded-lg">
            <div className="p-5 glass-card overflow-hidden rounded-lg">
              <img 
                src={madeInPoolerImg} 
                alt="NURD Made in Pooler, GA" 
                className="mx-auto max-h-[500px] rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <a href="/auth" className="glass-button transform hover:scale-105 transition-all flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-blue-500/30 px-5 py-3 rounded-lg shadow-md">
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-semibold">Login / Register</span>
          </a>
          <a href="/code-playground" className="glass-button transform hover:scale-105 transition-all flex items-center space-x-2 bg-gradient-to-r from-green-600/20 to-teal-600/20 border-green-500/30 px-5 py-3 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span className="font-semibold">Code Playground</span>
          </a>
          <a href="/ai-code-tools" className="glass-button transform hover:scale-105 transition-all flex items-center space-x-2 bg-gradient-to-r from-purple-700/30 to-pink-700/30 border-purple-500/30 px-5 py-3 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
              <path d="M7 7h.01"></path>
            </svg>
            <span className="font-semibold">AI Code Tools</span>
          </a>
          <a href="/achievers" className="glass-button transform hover:scale-105 transition-all flex items-center space-x-2 bg-gradient-to-r from-orange-600/20 to-amber-600/20 border-orange-500/30 px-5 py-3 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
            <span className="font-semibold">ACHIEVERS</span>
          </a>
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
    <div className="min-h-screen flex flex-col">
      <GlassNav />
      
      <main className="flex-grow">
        <PageTransition>
          <Switch>
            <Route path="/" component={TestComponent} />
            <Route path="/about" component={About} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/trainers" component={Trainers} />
            <Route path="/gallery" component={Gallery} />
            <AdminProtectedRoute path="/admin" component={AdminDashboard} />
            <Route path="/learning" component={Learning} />
            <Route path="/learning/create" component={AICourseCreator} />
            <Route path="/learning/:id" component={ModuleDetail} />
            <Route path="/learn" component={Learning} />
            <Route path="/settings" component={ProfileSettings} />
            <Route path="/join" component={JoinOurTeam} />
            <Route path="/apply" component={JoinOurTeam} />
            <Route path="/cohorts" component={Cohorts} />
            <Route path="/discord" component={DiscordConnect} />
            <Route path="/avatar" component={AvatarCreator} />
            <Route path="/home" component={Landing} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/achievers" component={ACHIEVERS} />
            <Route path="/ai-code-tools" component={AICodeTools} />
            <Route path="/progress" component={UserProgress} />
            <Route path="/skill-marketplace" component={SkillMarketplace} />
            <Route path="/reinvestment" component={Reinvestment} />
            <Route path="/create-course" component={CreateCourse} />
            
            {/* Coming Soon placeholder pages */}
            <Route path="/summer-initiative">
              <ComingSoon title="Summer Initiative" description="Our summer program is coming soon! Check back for details on our exciting summer initiative for 2025." />
            </Route>
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
            
            <Route component={NotFound} />
          </Switch>
        </PageTransition>
      </main>
      
      {!isMobile && (
        <footer className="py-4 px-6 text-center text-sm">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 font-medium">
              NURD = Naturally Unstoppable Resourceful Dreamers
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-blue-600 mr-2"></span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 font-medium">
                  Creativity First
                </span>
              </span>
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-blue-600 mr-2"></span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 font-medium">
                  AI Collaboration
                </span>
              </span>
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-blue-600 mr-2"></span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 font-medium">
                  Community Building
                </span>
              </span>
            </div>
            <div className="flex items-center justify-center">
              <img 
                src={madeInPoolerGreenImg} 
                alt="Made in Pooler, GA" 
                className="h-16 object-contain"
              />
            </div>
          </div>
        </footer>
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
          <AppContent />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;