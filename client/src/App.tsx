import React, { useEffect, useState, Suspense } from "react";
import { Switch, Route } from "wouter";
import { ProtectedRoute } from "@/lib/protected-route";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { LayoutDashboard, Send } from "lucide-react";

// Lazy load code playground
const CodePlayground = React.lazy(() => import("@/pages/code-playground"));

// Import NURD skateboard image
import nurdSkateboardImg from "./assets/nurd-skateboard.png";

// Simple component for initial testing - updated with glass UI
const TestComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="glass-container max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          NURD by: ACHIEVEMOR
        </h1>
        
        <div className="mt-8 p-6 glass-card overflow-hidden">
          <img 
            src={nurdSkateboardImg} 
            alt="NURD Skateboarding" 
            className="mx-auto max-h-[500px] rounded-lg shadow-lg"
          />
        </div>
        
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <a href="/auth" className="glass-button transform hover:scale-105 transition-all flex items-center space-x-2">
            <LayoutDashboard className="h-5 w-5" />
            <span>Login / Register</span>
          </a>
          <a href="/code-playground" className="glass-button transform hover:scale-105 transition-all flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span>Code Playground</span>
          </a>
          <a href="/ai-code-tools" className="glass-button transform hover:scale-105 transition-all flex items-center space-x-2 bg-gradient-to-r from-purple-700/30 to-pink-700/30 border-purple-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
              <path d="M7 7h.01"></path>
            </svg>
            <span>AI Code Tools</span>
          </a>
          <a href="/achievers" className="glass-button bg-primary/20 border-primary/30 transform hover:scale-105 transition-all flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
            <span>ACHIEVERS</span>
          </a>
        </div>
      </div>
    </div>
  );
};

function App() {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for smoother initial page transitions
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);
  
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <GlassNav />
          
          <main className="flex-grow">
            <PageTransition>
              <Switch>
                <Route path="/" component={TestComponent} />
                <Route path="/about" component={About} />
                <Route path="/auth" component={AuthPage} />
                <Route path="/register" component={Register} />
                <Route path="/apply" component={Register} />
                <ProtectedRoute path="/dashboard" component={Dashboard} />
                <ProtectedRoute path="/trainers" component={Trainers} />
                <ProtectedRoute path="/gallery" component={Gallery} />
                <ProtectedRoute path="/admin" component={AdminDashboard} />
                <ProtectedRoute path="/learning" component={Learning} />
                <ProtectedRoute path="/settings" component={ProfileSettings} />
                <ProtectedRoute path="/join" component={JoinOurTeam} />
                <ProtectedRoute path="/cohorts" component={Cohorts} />
                <ProtectedRoute path="/discord" component={DiscordConnect} />
                <ProtectedRoute path="/avatar" component={AvatarCreator} />
                <Route path="/home" component={Landing} />
                <Route path="/achievers" component={ACHIEVERS} />
                <Route path="/ai-code-tools" component={AICodeTools} />
                <ProtectedRoute path="/progress" component={UserProgress} />
                
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
                <p className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600 font-medium">
                  NURD = Naturally Unstoppable Resourceful Dreamers
                </p>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2"></span>
                    Creativity First
                  </span>
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
                    AI Collaboration
                  </span>
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-purple-400 mr-2"></span>
                    Community Building
                  </span>
                </div>
                <p className="text-gray-500">© {new Date().getFullYear()} NURD by: ACHIEVEMOR. All rights reserved.</p>
              </div>
            </footer>
          )}
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;