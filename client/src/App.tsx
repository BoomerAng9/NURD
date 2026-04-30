import React, { useEffect, useState, Suspense } from "react";
import { Switch, Route } from "wouter";
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
import Favicon from "@/components/ui/Favicon";
import UpdateNotification from "@/components/ui/update-notification";
import OrientationAlert from "@/components/ui/orientation-alert";
import { GlassNav } from "@/components/ui/glass-nav";
import { ComingSoon } from "@/components/ui/coming-soon";
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
import Auth from "@/pages/Auth";
import Chat from "@/pages/Chat";
import Build from "@/pages/Build";
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
import Pricing from "@/pages/Pricing";
import Tribe from "@/pages/Tribe";
import Services from "@/pages/Services";
import Dreamers from "@/pages/Dreamers";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load V.I.B.E. and Code Playground — these are heavy code surfaces
const CodePlayground = React.lazy(() => import("@/pages/code-playground"));
const VIBEPage = React.lazy(() => import("@/pages/VIBE"));

const AppContent = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const { isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => setIsLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground">
          Loading.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-[100vw] overflow-x-hidden bg-background">
      <OrientationAlert />
      <GlassNav />

      <main className="flex-grow w-full max-w-[100vw] overflow-x-hidden">
        <PageTransition>
          <Switch>
            <Route path="/" component={Home} />
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
            <Route path="/pricing" component={Pricing} />
            <Route path="/tribe" component={Tribe} />
            <Route path="/community" component={Tribe} />
            <Route path="/services" component={Services} />
            <Route path="/chat" component={Chat} />
            <Route path="/build" component={Build} />
            <Route path="/dreamers" component={Dreamers} />
            <Route path="/subscription-plans" component={SubscriptionPlans} />
            <Route path="/advanced-checkout" component={AdvancedCheckout} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/checkout-success" component={CheckoutSuccess} />
            <Route path="/bootcamp" component={LandingPage} />
            <Route path="/settings" component={ProfileSettings} />
            <Route path="/join" component={JoinOurTeam} />
            <Route path="/apply" component={JoinOurTeam} />
            <Route path="/cohorts" component={Cohorts} />
            <Route path="/discord" component={DiscordConnect} />
            <Route path="/avatar" component={AvatarCreator} />
            <Route path="/auth" component={Auth} />
            <Route path="/auth/legacy" component={AuthPage} />
            <Route path="/achievers" component={Achievers} />
            <Route path="/access-ai" component={AccessAI} />
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
              <ComingSoon
                title="Weekend Workshops"
                description="Hands-on weekend workshops focused on tech and creativity coming soon."
              />
            </Route>
            <Route path="/school-programs">
              <ComingSoon
                title="School Programs"
                description="NURD School Programs will be available soon. Learn how we're bringing tech education to schools."
              />
            </Route>
            <Route path="/online-learning">
              <ComingSoon
                title="Online Learning"
                description="Self-paced online learning experiences are being developed. Stay tuned."
              />
            </Route>
            <Route path="/resources">
              <ComingSoon
                title="Resources"
                description="A comprehensive collection of learning resources for students and educators coming soon."
              />
            </Route>
            <Route path="/parent-guide">
              <ComingSoon
                title="Parent Guide"
                description="Information for parents on how to support their child's learning journey in tech."
              />
            </Route>
            <Route path="/student-resources">
              <ComingSoon
                title="Student Resources"
                description="Student-focused resources and learning materials coming soon."
              />
            </Route>
            <Route path="/scholarships">
              <ComingSoon
                title="Scholarships"
                description="Information about our scholarship programs and how to apply will be available soon."
              />
            </Route>
            <Route path="/faq">
              <ComingSoon
                title="Frequently Asked Questions"
                description="Answers to common questions about NURD programs and opportunities."
              />
            </Route>

            <Route path="/code-playground">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground">
                      Loading playground.
                    </p>
                  </div>
                }
              >
                <CodePlayground />
              </Suspense>
            </Route>

            <Route path="/vibe">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground">
                      Loading V.I.B.E.
                    </p>
                  </div>
                }
              >
                <VIBEPage />
              </Suspense>
            </Route>

            <Route component={NotFound} />
          </Switch>
        </PageTransition>
      </main>
    </div>
  );
};

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
