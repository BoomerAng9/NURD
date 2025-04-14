import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Home} />
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
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;