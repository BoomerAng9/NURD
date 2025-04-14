import React, { useState, useRef } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { 
  Upload, 
  Play, 
  Calendar, 
  ChevronRight, 
  Users, 
  BookOpen, 
  Award, 
  Star,
  Video,
  Sparkles,
  LayoutGrid,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';

// Import the NURD Card profile image
import nurdCardProfileImage from '@assets/A40E73FE-AAEE-4C08-A6E8-9C8E4B863A88.png';

export default function LandingPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle video file selection
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      
      // Create a URL for the video preview
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  // Handle video upload
  const handleVideoUpload = async () => {
    if (!videoFile) return;
    
    setIsUploading(true);
    
    try {
      // Here you would normally upload to a server
      // For demonstration, we'll simulate an upload with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success handling
      console.log('Video uploaded successfully');
      setIsUploading(false);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>NURD App | Where Creativity Meets Technology</title>
        <meta name="description" content="Join the NURD Summer Initiative and unlock your creative potential through technology, coding, and digital innovation." />
      </Helmet>
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-800 via-indigo-700 to-blue-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-6xl mb-6 leading-tight">
              BECOME A <span className="text-gradient bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200">NURD</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Where Creativity Meets Technology through our immersive summer initiative designed for young innovators.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg">
                Join Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-3xl"></div>
        <div className="absolute top-20 -right-20 w-40 h-40 bg-gradient-to-br from-amber-500/20 to-red-500/20 rounded-full blur-2xl"></div>
      </section>
      
      {/* Highlights Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Program Highlights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive program equips participants with the skills, knowledge, and experience they need to thrive in the digital world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Vibe Coding</CardTitle>
                <CardDescription>Learn coding through creative expression and enjoyment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our signature approach to teaching coding that emphasizes creativity, collaboration, and building projects that matter to you.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-start">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Learn more about Vibe Coding
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Achievements & Growth</CardTitle>
                <CardDescription>Track your progress and earn recognition</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Earn badges, level up, and showcase your skills through our comprehensive progress tracking system.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/progress-tracking">
                  <Button variant="ghost" className="w-full justify-start">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Explore progress tracking
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Community</CardTitle>
                <CardDescription>Connect with fellow young innovators</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Join a vibrant community of like-minded peers, mentors, and industry professionals who share your passion for technology.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/discord/connect">
                  <Button variant="ghost" className="w-full justify-start">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Join our Discord community
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Video Upload Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-indigo-950 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Share Your NURD Journey
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Upload videos showcasing your projects, experiences, and insights from the NURD Summer Initiative.
              </p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl border border-gray-700">
              {videoUrl ? (
                <div className="space-y-6">
                  <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
                    <video 
                      src={videoUrl} 
                      className="absolute inset-0 w-full h-full object-cover" 
                      controls
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-300 truncate max-w-xs sm:max-w-md">
                      Selected: {videoFile?.name}
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setVideoFile(null);
                          setVideoUrl(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleVideoUpload}
                        disabled={isUploading}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                      >
                        {isUploading ? 'Uploading...' : 'Upload Video'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-12 cursor-pointer hover:border-blue-400 transition-colors"
                  onClick={triggerFileInput}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="video/*" 
                    onChange={handleVideoSelect}
                  />
                  <Video className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Upload a Video</h3>
                  <p className="text-gray-400 text-center mb-6">
                    Drag and drop a video file here, or click to browse
                  </p>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Select Video
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Events Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Upcoming Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these exciting opportunities to learn, connect, and showcase your skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event Card 1 */}
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">
                  <Calendar className="h-4 w-4" />
                  June 15, 2023
                </div>
                <CardTitle className="text-xl">Coding Challenge Kickoff</CardTitle>
                <CardDescription>Virtual Event</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Join us for the launch of our summer coding challenge series, with prizes and recognition for top performers.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  4:00 PM - 6:00 PM EST
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Register Now</Button>
              </CardFooter>
            </Card>
            
            {/* Event Card 2 */}
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">
                  <Calendar className="h-4 w-4" />
                  July 8, 2023
                </div>
                <CardTitle className="text-xl">NURD Workshop: AI Basics</CardTitle>
                <CardDescription>Atlanta, GA</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Hands-on workshop introducing artificial intelligence concepts and tools for beginners.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  10:00 AM - 3:00 PM EST
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Reserve Your Spot</Button>
              </CardFooter>
            </Card>
            
            {/* Event Card 3 */}
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">
                  <Calendar className="h-4 w-4" />
                  August 20, 2023
                </div>
                <CardTitle className="text-xl">Summer Project Showcase</CardTitle>
                <CardDescription>Pooler, GA</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Present your summer projects to peers, mentors, and industry professionals in this celebratory event.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  1:00 PM - 5:00 PM EST
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Submit Your Project</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* NURD Card Profile Section */}
      <section className="py-20 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Your NURD Identity</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each participant receives a customizable digital trading card that showcases their skills, achievements, and personality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="font-heading font-bold text-2xl mb-6">Personalized NURD Trading Cards</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Star className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">Showcase Your Skills</h4>
                    <p className="text-gray-600">
                      Display your class, level, core traits, and abilities that represent your unique skills and learning journey.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">Express Your Creativity</h4>
                    <p className="text-gray-600">
                      Customize your profile card with your personal bio, avatar image, and highlight your unique abilities.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <LayoutGrid className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">Connect With Others</h4>
                    <p className="text-gray-600">
                      Share your profile card with fellow NURDs, use the "Tap to Connect" feature, or draft messages to others.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link href="/profile/settings">
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                      Create Your NURD Card
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center order-1 lg:order-2">
              <img 
                src={nurdCardProfileImage} 
                alt="NURD Profile Card" 
                className="max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Connect Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">Ready to Begin Your NURD Journey?</h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Join our community of young innovators and start building the skills that will shape the future.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-gray-100">
              Register Now
            </Button>
            <Link href="/about">
              <Button size="lg" variant="outline" className="text-white border-white/70 hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}