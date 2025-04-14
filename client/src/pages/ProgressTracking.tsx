import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Loader2, ArrowLeft, Book, Trophy, Zap, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { getQueryFn } from "@/lib/queryClient";

// Import progress components
import ProgressDashboard from "@/components/progress/progress-dashboard";
import AchievementBadge from "@/components/progress/achievement-badge";
import ActivityTimeline from "@/components/progress/activity-timeline";
import ProgressBar from "@/components/progress/progress-bar";

export default function ProgressTracking() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch current user
  const { 
    data: currentUser, 
    isLoading: isLoadingUser,
    error: userError
  } = useQuery({
    queryKey: ["/api/user"],
    queryFn: getQueryFn(),
  });

  // Show loading state while fetching user data
  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
        <span className="text-lg">Loading progress tracking...</span>
      </div>
    );
  }

  // Show error state if user data could not be fetched
  if (userError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Progress</h2>
        <p className="text-muted-foreground mb-4">
          {userError instanceof Error ? userError.message : "An unknown error occurred while loading your progress data."}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // If no user is found, show a message asking to log in
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h2 className="text-xl font-bold mb-2">Progress Tracking</h2>
        <p className="text-muted-foreground mb-4">
          Please log in to view your learning progress
        </p>
        <Button>Log In</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Progress Tracking | NURD App</title>
      </Helmet>

      <div className="container py-8 max-w-7xl">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <a href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Progress Tracking</h1>
            </div>
            <p className="text-muted-foreground">
              Track your learning journey, achievements, and skills development
            </p>
          </div>

          {/* Main Progress Dashboard */}
          <ProgressDashboard userId={currentUser.id} />

          {/* Learning Path Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Path Progress</CardTitle>
              <CardDescription>
                Your journey through the NURD program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center justify-center text-center p-4 bg-muted/50 rounded-lg">
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <Book className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Foundations</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Core skills and understanding
                  </p>
                  <ProgressBar
                    value={currentUser.xp_points && currentUser.xp_points > 300 ? 100 : (currentUser.xp_points || 0) / 3}
                    max={100}
                    size="md"
                    colorVariant={currentUser.xp_points && currentUser.xp_points > 300 ? "success" : "default"}
                    className="w-full mt-2"
                  />
                </div>

                <div className="flex flex-col items-center justify-center text-center p-4 bg-muted/50 rounded-lg">
                  <div className="bg-indigo-100 p-3 rounded-full mb-3">
                    <Trophy className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Skill Building</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Specialized techniques and practice
                  </p>
                  <ProgressBar
                    value={currentUser.xp_points && currentUser.xp_points > 600 ? 100 : Math.max(0, ((currentUser.xp_points || 0) - 300) / 3)}
                    max={100}
                    size="md" 
                    colorVariant={currentUser.xp_points && currentUser.xp_points > 600 ? "success" : "default"}
                    className="w-full mt-2"
                  />
                </div>

                <div className="flex flex-col items-center justify-center text-center p-4 bg-muted/50 rounded-lg">
                  <div className="bg-purple-100 p-3 rounded-full mb-3">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Advanced Topics</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Expert knowledge and project work
                  </p>
                  <ProgressBar
                    value={currentUser.xp_points && currentUser.xp_points > 900 ? 100 : Math.max(0, ((currentUser.xp_points || 0) - 600) / 3)}
                    max={100}
                    size="md"
                    colorVariant={currentUser.xp_points && currentUser.xp_points > 900 ? "success" : "default"}
                    className="w-full mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActivityTimeline 
                activities={[]} 
                showLoadMore 
                onLoadMore={() => {}}
              />
            </div>
            
            <div>
              {/* Next Achievement card */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Next Achievement</CardTitle>
                  <CardDescription>
                    Your next milestone to unlock
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center pt-2 pb-6">
                  <AchievementBadge
                    achievement={{
                      id: 101,
                      title: "Steady Learner",
                      description: "Maintain a 7-day learning streak",
                      type: "streak",
                      image_url: null,
                      requirement: "consecutive_days",
                      requirement_value: 7
                    }}
                    earned={false}
                    size="lg"
                    className="mb-4"
                  />
                  <h4 className="text-lg font-semibold mb-1">Steady Learner</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Continue your learning journey for 7 days in a row to unlock.
                  </p>
                  <ProgressBar
                    value={(currentUser.streak?.current || 0)}
                    max={7}
                    showValues
                    label="Current streak"
                    colorVariant="gradient"
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Quick Stats card */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Stats</CardTitle>
                  <CardDescription>
                    Your learning activity overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm">Total Learning Time</span>
                      <span className="font-medium">12h 30m</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm">Lessons Completed</span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm">Courses Completed</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm">Achievements Earned</span>
                      <span className="font-medium">6</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Level</span>
                      <span className="font-medium">{currentUser.level || 1}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}