import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SupabaseProvider } from "@/components/ui/supabase-provider";
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
import AchievementDemo from "@/pages/AchievementDemo";

// Simple component for initial testing
const TestComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-black">
      <h1 className="text-3xl font-bold">NURD Summer Initiative</h1>
      <p className="mt-4 text-xl">Simple test page to verify rendering</p>
      <div className="mt-8 p-4 border rounded bg-green-100">
        <p>If you can see this page, basic rendering is working!</p>
      </div>
      <div className="mt-4 flex space-x-4">
        <a href="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Dashboard</a>
        <a href="/landing" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">Landing</a>
        <a href="/achievements" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Achievement Animations</a>
      </div>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <Switch>
          <Route path="/" component={TestComponent} />
          <Route path="/home" component={Home} />
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
          <Route path="/landing" component={Landing} />
          <Route path="/achievements" component={AchievementDemo} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </SupabaseProvider>
    </QueryClientProvider>
  );
}

export default App;