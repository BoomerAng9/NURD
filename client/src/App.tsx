import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SupabaseProvider } from "@/components/ui/supabase-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
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
import ProgressTracking from "@/pages/ProgressTracking";
import { useEffect } from "react";
import AuthGuard from "@/lib/auth-guard";

function Router() {
  const [location] = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/register" component={Register} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/trainers" component={Trainers} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/admin">
        {() => (
          <AuthGuard allowedRoles={['admin']}>
            <AdminDashboard />
          </AuthGuard>
        )}
      </Route>
      <Route path="/learning" component={Learning} />
      <Route path="/cohorts" component={Cohorts} />
      <Route path="/profile/settings" component={ProfileSettings} />
      <Route path="/discord/connect" component={DiscordConnect} />
      <Route path="/avatar/create" component={AvatarCreator} />
      <Route path="/progress-tracking" component={ProgressTracking} />
      <Route path="/join-our-team">
        {() => (
          <AuthGuard allowedRoles={['admin', 'freelancer']}>
            <JoinOurTeam />
          </AuthGuard>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <Router />
        <Toaster />
      </SupabaseProvider>
    </QueryClientProvider>
  );
}

export default App;
