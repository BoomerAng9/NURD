import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SupabaseProvider } from "@/components/ui/supabase-provider";
import { PageTransition } from "@/components/animations/page-transition";
import { GlassNav } from "@/components/ui/glass-nav";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { LayoutDashboard, Send } from "lucide-react";

// Import NURD skateboard image
import nurdSkateboardImg from "./assets/nurd-skateboard.png";

// Simple component for initial testing - updated with glass UI
const TestComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="glass-container max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
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
          <a href="/dashboard" className="glass-button transform hover:scale-105 transition-all flex items-center space-x-2">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </a>
          <a href="/home" className="glass-button transform hover:scale-105 transition-all flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Home</span>
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
      <SupabaseProvider>
        <div className="min-h-screen flex flex-col">
          <GlassNav />
          
          <main className="flex-grow">
            <PageTransition>
              <Switch>
                <Route path="/" component={TestComponent} />
                <Route path="/about" component={About} />
                <Route path="/auth" component={AuthPage} />
                <Route path="/register" component={Register} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/trainers" component={Trainers} />
                <Route path="/gallery" component={Gallery} />
                <Route path="/admin" component={AdminDashboard} />
                <Route path="/learning" component={Learning} />
                <Route path="/settings" component={ProfileSettings} />
                <Route path="/join" component={JoinOurTeam} />
                <Route path="/cohorts" component={Cohorts} />
                <Route path="/discord" component={DiscordConnect} />
                <Route path="/avatar" component={AvatarCreator} />
                <Route path="/home" component={Landing} />
                <Route path="/achievers" component={ACHIEVERS} />
                <Route path="/progress" component={UserProgress} />
                <Route component={NotFound} />
              </Switch>
            </PageTransition>
          </main>
          
          {!isMobile && (
            <footer className="py-4 px-6 text-center text-sm text-foreground/60">
              <p>© {new Date().getFullYear()} NURD by: ACHIEVEMOR. All rights reserved.</p>
            </footer>
          )}
        </div>
        <Toaster />
      </SupabaseProvider>
    </QueryClientProvider>
  );
}

export default App;